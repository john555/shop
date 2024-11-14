import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { UseGuards, Logger } from '@nestjs/common';
import { Media } from './media.entity';
import { MediaService } from './media.service';
import {
  MediaGetArgs,
  MediaCreateInput,
  MediaUpdateInput,
  GetMediaByOwnerArgs,
} from './media.dto';
import { JwtAuthGuard } from '../authentication/guard/jwt-auth.guard';
import { AuthContext } from '../utils/auth';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { Product } from '../product/entities/product.entity';
import { ProductVariant } from '../product/entities/product-variant.entity';
import { Category } from '../category/category.entity';
// import { Collection } from '../collection/collection.entity';
import { Store } from '../store/store.entity';
import { User } from '../user/user.entity';
// import { PropertyListing } from '../property/property-listing.entity';
// import { VehicleListing } from '../vehicle/vehicle-listing.entity';
import { MediaOwnerType } from '@prisma/client';

@Resolver(() => Media)
export class MediaResolver {
  private readonly logger = new Logger(MediaResolver.name);

  constructor(private readonly mediaService: MediaService) {}

  @Query(() => Media, { nullable: true })
  async media(@Args() args: MediaGetArgs): Promise<Media | null> {
    return this.mediaService.getMediaById(args.id);
  }

  @Query(() => [Media])
  async mediaByOwner(
    @Args() args: GetMediaByOwnerArgs,
    @Args() paginationArgs: PaginationArgs
  ): Promise<Media[]> {
    return this.mediaService.getMediaByOwner(
      args.ownerId,
      args.ownerType,
      paginationArgs
    );
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Media)
  async createMedia(
    @Args('input') input: MediaCreateInput,
    @Context() context: AuthContext
  ): Promise<Media> {
    try {
      // TODO: Add ownership validation based on ownerType and ownerId
      return await this.mediaService.create(input);
    } catch (error) {
      this.logger.error('Failed to create media:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Media)
  async updateMedia(
    @Args('input') input: MediaUpdateInput,
    @Context() context: AuthContext
  ): Promise<Media> {
    try {
      // TODO: Add ownership validation based on ownerType and ownerId
      return await this.mediaService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update media ${input.id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteMedia(
    @Args('id') id: string,
    @Context() context: AuthContext
  ): Promise<boolean> {
    try {
      // TODO: Add ownership validation based on ownerType and ownerId
      await this.mediaService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete media ${id}:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => [Media])
  async reorderMedia(
    @Args('ownerId') ownerId: string,
    @Args({ name: 'ownerType', type: () => MediaOwnerType })
    ownerType: MediaOwnerType,
    @Args({ name: 'orderedIds', type: () => [String] }) orderedIds: string[],
    @Context() context: AuthContext
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

  // Resolve Fields
  @ResolveField(() => Product, { nullable: true })
  async product(@Parent() media: Media): Promise<Product | null> {
    if (media.ownerType !== MediaOwnerType.PRODUCT) return null;
    return this.mediaService.getOwner(media);
  }

  @ResolveField(() => ProductVariant, { nullable: true })
  async productVariant(@Parent() media: Media): Promise<ProductVariant | null> {
    if (media.ownerType !== MediaOwnerType.PRODUCT_VARIANT) return null;
    return this.mediaService.getOwner(media);
  }

  @ResolveField(() => Category, { nullable: true })
  async category(@Parent() media: Media): Promise<Category | null> {
    if (media.ownerType !== MediaOwnerType.CATEGORY) return null;
    return this.mediaService.getOwner(media);
  }

  // @ResolveField(() => Collection, { nullable: true })
  // async collection(@Parent() media: Media): Promise<Collection | null> {
  //   if (media.ownerType !== MediaOwnerType.COLLECTION) return null;
  //   return this.mediaService.getOwner(media);
  // }

  @ResolveField(() => Store, { nullable: true })
  async store(@Parent() media: Media): Promise<Store | null> {
    if (media.ownerType !== MediaOwnerType.STORE) return null;
    return this.mediaService.getOwner(media);
  }

  @ResolveField(() => User, { nullable: true })
  async userProfile(@Parent() media: Media): Promise<User | null> {
    if (media.ownerType !== MediaOwnerType.USER_PROFILE) return null;
    return this.mediaService.getOwner(media);
  }

  // @ResolveField(() => PropertyListing, { nullable: true })
  // async property(@Parent() media: Media): Promise<PropertyListing | null> {
  //   if (media.ownerType !== MediaOwnerType.PROPERTY) return null;
  //   return this.mediaService.getOwner(media);
  // }

  // @ResolveField(() => VehicleListing, { nullable: true })
  // async vehicle(@Parent() media: Media): Promise<VehicleListing | null> {
  //   if (media.ownerType !== MediaOwnerType.VEHICLE) return null;
  //   return this.mediaService.getOwner(media);
  // }
}
