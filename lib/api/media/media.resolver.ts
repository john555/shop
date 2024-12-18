import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Logger } from '@nestjs/common';
import { Media, MediaUsage } from './media.entity';
import { MediaService } from './media.service';
import {
  MediaCreateInput,
  MediaUpdateInput,
  MediaUploadInput,
  MediaSearchInput,
} from './media.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { Product } from '../product/entities/product.entity';
import { ProductVariant } from '../product/entities/product-variant.entity';
import { Category } from '../category/category.entity';
// import { Collection } from '../collection/collection.entity';
import { Store } from '../store/store.entity';
import { User } from '../user/user.entity';
// import { PropertyListing } from '../property/property-listing.entity';
// import { VehicleListing } from '../vehicle/vehicle-listing.entity';
import { MediaOwnerType, Prisma } from '@prisma/client';
import { UploadService } from './upload.service';
import { Auth } from '../authorization/decorators/auth.decorator';
import { Collection } from '../collection/collection.entity';
import { MediaOptimizationService } from './mediaoptimization.service';

@Resolver(() => Media)
export class MediaResolver {
  private readonly logger = new Logger(MediaResolver.name);

  constructor(
    private readonly mediaService: MediaService,
    private readonly uploadService: UploadService,
    private readonly mediaOptimizationService: MediaOptimizationService
  ) {}

  @Auth()
  @Query(() => [Media])
  async media(
    @Args('input') input: MediaSearchInput,
    @Args() args: PaginationArgs
  ): Promise<Media[]> {
    return this.mediaService.search(input, args);
  }

  @Auth()
  @Mutation(() => Media)
  async createMedia(@Args('input') input: MediaCreateInput): Promise<Media> {
    try {
      // TODO: Add ownership validation based on ownerType and ownerId
      return await this.mediaService.create(input);
    } catch (error) {
      this.logger.error('Failed to create media:', error);
      throw error;
    }
  }

  @Auth()
  @Mutation(() => Media)
  async updateMedia(@Args('input') input: MediaUpdateInput): Promise<Media> {
    try {
      // TODO: Add ownership validation based on ownerType and ownerId
      return await this.mediaService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update media ${input.id}:`, error);
      throw error;
    }
  }

  @Auth()
  @Mutation(() => [Media])
  async reorderMedia(
    @Args('ownerId') ownerId: string,
    @Args({ name: 'ownerType', type: () => MediaOwnerType })
    ownerType: MediaOwnerType,
    @Args({ name: 'orderedIds', type: () => [String] }) orderedIds: string[]
  ): Promise<Media[]> {
    try {
      // TODO: Add ownership validation based on ownerType and ownerId
      return await this.mediaService.reorderMedia(
        ownerId,
        ownerType,
        orderedIds
      );
    } catch (error) {
      this.logger.error('Failed to reorder media:', error);
      throw error;
    }
  }

  @Auth()
  @Mutation(() => Media)
  async uploadMedia(@Args('input') input: MediaUploadInput): Promise<Media> {
    try {
      // Get the file from the upload
      const file = await input.file;
      const buffer = await this.streamToBuffer(file.createReadStream());

      // Generate optimization metadata
      const metadata = await this.mediaOptimizationService.generateMetadata(
        file,
        buffer
      );

      // Upload to Bunny.net with organization by owner type
      const baseDir = input.ownerType.toLowerCase();
      const { url, path, mimeType } = await this.uploadService.uploadFile(
        buffer,
        file.filename,
        baseDir
      );

      // Calculate next position for the media item
      const existingMedia = await this.mediaService.findByOwner(
        input.ownerId,
        input.ownerType
      );
      const position = existingMedia.length;

      // Create media record with optimization metadata
      const mediaInput: Prisma.MediaCreateInput = {
        type: metadata.type, // Use detected type
        url,
        alt: input.alt,
        ownerType: input.ownerType,
        ownerId: input.ownerId,
        storeId: input.storeId,
        position,
        fileName: file.filename,
        mimeType,
        fileSize: buffer.length,
        width: metadata.width,
        height: metadata.height,
        duration: metadata.duration,
        blurHash: metadata.blurHash,
        placeholder: metadata.placeholder,
      };

      return await this.mediaService.create(mediaInput);
    } catch (error) {
      this.logger.error('Failed to upload media:', error);
      throw error;
    }
  }

  @Auth()
  @Mutation(() => Boolean)
  async deleteMedia(@Args('id') id: string): Promise<boolean> {
    try {
      const media = await this.mediaService.findById(id);
      if (!media) {
        return false;
      }

      // Delete from Bunny.net
      await this.uploadService.deleteFile(media.url);

      // Delete from database
      await this.mediaService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete media ${id}:`, error);
      throw error;
    }
  }

  private async streamToBuffer(stream: NodeJS.ReadableStream): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      stream.on('error', (err) => reject(err));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
    });
  }

  // Resolve Fields
  @ResolveField(() => Product, { nullable: true })
  async product(@Parent() media: Media): Promise<Product | null> {
    if (media.ownerType !== MediaOwnerType.PRODUCT) return null;
    return this.mediaService.resolveOwner(media);
  }

  @ResolveField(() => ProductVariant, { nullable: true })
  async productVariant(@Parent() media: Media): Promise<ProductVariant | null> {
    if (media.ownerType !== MediaOwnerType.PRODUCT_VARIANT) return null;
    return this.mediaService.resolveOwner(media);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() media: Media): Promise<Category | null> {
    if (media.ownerType !== MediaOwnerType.CATEGORY) return null;
    return this.mediaService.resolveOwner(media);
  }

  @ResolveField(() => Collection, { nullable: true })
  async collection(@Parent() media: Media): Promise<Collection | null> {
    if (media.ownerType !== MediaOwnerType.COLLECTION) return null;
    return this.mediaService.resolveOwner(media);
  }

  @ResolveField(() => Store, { nullable: true })
  async storeProfile(@Parent() media: Media): Promise<Store | null> {
    if (media.ownerType !== MediaOwnerType.STORE_PROFILE) return null;
    return this.mediaService.resolveOwner(media);
  }

  @ResolveField(() => User, { nullable: true })
  async userProfile(@Parent() media: Media): Promise<User | null> {
    if (media.ownerType !== MediaOwnerType.USER_PROFILE) return null;
    return this.mediaService.resolveOwner(media);
  }

  @ResolveField(() => [MediaUsage])
  async usedIn(@Parent() media: Media): Promise<MediaUsage[]> {
    return this.mediaService.findMediaUsage(media.id);
  }
}
