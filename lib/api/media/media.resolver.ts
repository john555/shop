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
  MediaSearchInput,
  MediaReorderInput,
} from './media.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { Product } from '../product/entities/product.entity';
import { ProductVariant } from '../product/entities/product-variant.entity';
import { Category } from '../category/category.entity';
import { Collection } from '../collection/collection.entity';
import { Store } from '../store/store.entity';
import { User } from '../user/user.entity';
import { MediaOwnerType } from '@prisma/client';
import { UploadService } from './upload.service';
import { Auth } from '../authorization/decorators/auth.decorator';
import { MediaOptimizationService } from './mediaoptimization.service';
import { GraphQLError } from 'graphql';

@Resolver(() => Media)
export class MediaResolver {
  private readonly logger = new Logger(MediaResolver.name);

  constructor(
    private readonly mediaService: MediaService,
    private readonly uploadService: UploadService,
    private readonly mediaOptimizationService: MediaOptimizationService
  ) {}

  // Queries
  @Auth()
  @Query(() => [Media])
  async media(
    @Args('input') input: MediaSearchInput,
    @Args() args: PaginationArgs
  ): Promise<Media[]> {
    return this.mediaService.search(input, args);
  }

  @Auth()
  @Query(() => Media)
  async mediaById(@Args('id') id: string): Promise<Media> {
    const media = await this.mediaService.findById(id);
    if (!media) {
      throw new GraphQLError(`Media with ID ${id} not found`);
    }
    return media;
  }

  // Mutations
  @Auth()
  @Mutation(() => Media)
  async createMedia(@Args('input') input: MediaCreateInput): Promise<Media> {
    try {
      const file = await input.file;
      const buffer = await this.streamToBuffer(file.createReadStream());

      // Generate optimization metadata
      const metadata = await this.mediaOptimizationService.generateMetadata(
        file,
        buffer
      );

      // Upload to storage
      const baseDir = input.purpose.toLowerCase();
      const { url, path, mimeType } = await this.uploadService.uploadFile(
        buffer,
        file.filename,
        baseDir
      );

      // Create media record with optimization metadata
      return this.mediaService.create({
        type: metadata.type,
        url,
        alt: input.alt,
        fileName: file.filename,
        mimeType,
        fileSize: buffer.length,
        width: metadata.width,
        height: metadata.height,
        duration: metadata.duration,
        blurHash: metadata.blurHash,
        placeholder: metadata.placeholder,
        purpose: input.purpose,
        storeId: input.storeId,
        owners: input.owners || [],
      });
    } catch (error) {
      this.logger.error('Failed to create media:', error);
      throw new GraphQLError('Failed to create media');
    }
  }

  @Auth()
  @Mutation(() => Media)
  async updateMedia(@Args('input') input: MediaUpdateInput): Promise<Media> {
    try {
      return await this.mediaService.update(input.id, {
        alt: input.alt,
        fileName: input.fileName,
        addOwners: input.addOwners,
        removeOwners: input.removeOwners,
      });
    } catch (error) {
      this.logger.error(`Failed to update media ${input.id}:`, error);
      throw new GraphQLError('Failed to update media');
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

      await this.uploadService.deleteFile(media.url);
      await this.mediaService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete media ${id}:`, error);
      throw new GraphQLError('Failed to delete media');
    }
  }

  @Auth()
  @Mutation(() => [Media])
  async reorderMedia(
    @Args('input') input: MediaReorderInput
  ): Promise<Media[]> {
    try {
      return await this.mediaService.reorder(
        input.ownerId,
        input.ownerType,
        input.mediaIds
      );
    } catch (error) {
      this.logger.error('Failed to reorder media:', error);
      throw new GraphQLError('Failed to reorder media');
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

  // Field Resolvers
  @ResolveField(() => Product, { nullable: true })
  async product(@Parent() media: Media): Promise<Product | null> {
    const owner = media.owners?.find(
      (o) => o.ownerType === MediaOwnerType.PRODUCT
    );
    if (!owner) return null;
    return this.mediaService.resolveOwner({
      ownerType: MediaOwnerType.PRODUCT,
      ownerId: owner.ownerId,
    });
  }

  @ResolveField(() => ProductVariant, { nullable: true })
  async productVariant(@Parent() media: Media): Promise<ProductVariant | null> {
    const owner = media.owners?.find(
      (o) => o.ownerType === MediaOwnerType.PRODUCT_VARIANT
    );
    if (!owner) return null;
    return this.mediaService.resolveOwner({
      ownerType: MediaOwnerType.PRODUCT_VARIANT,
      ownerId: owner.ownerId,
    });
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() media: Media): Promise<Category | null> {
    const owner = media.owners?.find(
      (o) => o.ownerType === MediaOwnerType.CATEGORY
    );
    if (!owner) return null;
    return this.mediaService.resolveOwner({
      ownerType: MediaOwnerType.CATEGORY,
      ownerId: owner.ownerId,
    });
  }

  @ResolveField(() => Collection, { nullable: true })
  async collection(@Parent() media: Media): Promise<Collection | null> {
    const owner = media.owners?.find(
      (o) => o.ownerType === MediaOwnerType.COLLECTION
    );
    if (!owner) return null;
    return this.mediaService.resolveOwner({
      ownerType: MediaOwnerType.COLLECTION,
      ownerId: owner.ownerId,
    });
  }

  @ResolveField(() => Store, { nullable: true })
  async storeProfile(@Parent() media: Media): Promise<Store | null> {
    const owner = media.owners?.find(
      (o) => o.ownerType === MediaOwnerType.STORE_PROFILE
    );
    if (!owner) return null;
    return this.mediaService.resolveOwner({
      ownerType: MediaOwnerType.STORE_PROFILE,
      ownerId: owner.ownerId,
    });
  }

  @ResolveField(() => User, { nullable: true })
  async userProfile(@Parent() media: Media): Promise<User | null> {
    const owner = media.owners?.find(
      (o) => o.ownerType === MediaOwnerType.USER_PROFILE
    );
    if (!owner) return null;
    return this.mediaService.resolveOwner({
      ownerType: MediaOwnerType.USER_PROFILE,
      ownerId: owner.ownerId,
    });
  }

  @ResolveField(() => [MediaUsage])
  async usedIn(@Parent() media: Media): Promise<MediaUsage[]> {
    return this.mediaService.findMediaUsage(media.id);
  }
}
