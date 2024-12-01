import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { StoreGetArgs, StoreCreateInput, StoreUpdateInput } from './store.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { AuthContext } from '../utils/auth';
import { AddressOwnerType } from '@prisma/client';

import { User } from '../user/user.entity';
import { Category } from '../category/category.entity';
import { Collection } from '../collection/collection.entity';
import { Tag } from '../tag/tag.entity';
import { Product } from '../product/entities/product.entity';
import { Auth, AuthStore } from '../authorization/decorators/auth.decorator';
import { AddressOnOwnerService } from '../address-on-owner/address-on-owner.service';
import { AddressOnOwner } from '../address-on-owner/address-on-owner.entity';

@Resolver(() => Store)
export class StoreResolver {
  private readonly logger = new Logger(StoreResolver.name);

  constructor(
    private readonly storeService: StoreService,
    private readonly addressOnOwnerService: AddressOnOwnerService
  ) {}

  // Query Methods
  @AuthStore()
  @Query(() => Store)
  async store(@Args() args: StoreGetArgs): Promise<Store> {
    const store = await this.storeService.getStoreById(args.id);
    if (!store) {
      throw new NotFoundException(`Store with ID ${args.id} not found`);
    }

    return store;
  }

  @Auth()
  @Query(() => [Store])
  async myStores(
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Store[]> {
    return this.storeService.getStoresByOwnerId(context.req.user.id, args);
  }

  // Mutation Methods
  @Auth()
  @Mutation(() => Store)
  async createStore(
    @Args('input') input: StoreCreateInput,
    @Context() context: AuthContext
  ): Promise<Store> {
    try {
      // Check if user already has a store
      const myStores = await this.storeService.getStoresByOwnerId(
        context.req.user.id
      );
      if (myStores.length > 0) {
        throw new BadRequestException('You can only have one store');
      }

      // Validate slug uniqueness
      const isSlugUnique = await this.storeService.isSlugUnique(input.slug);
      if (!isSlugUnique) {
        throw new BadRequestException('Store slug is already taken');
      }

      return await this.storeService.create({
        ...input,
        email: context.req.user.email,
        ownerId: context.req.user.id,
      });
    } catch (error) {
      this.logger.error('Failed to create store:', error);
      throw error;
    }
  }

  @AuthStore()
  @Mutation(() => Store)
  async updateStore(@Args('input') input: StoreUpdateInput): Promise<Store> {
    try {
      if (input.slug) {
        const isSlugUnique = await this.storeService.isSlugUnique(
          input.slug,
          input.id
        );
        if (!isSlugUnique) {
          throw new BadRequestException('Store slug is already taken');
        }
      }

      return await this.storeService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update store ${input.id}:`, error);
      throw error;
    }
  }

  // Field Resolvers
  @ResolveField(() => User)
  async owner(@Parent() store: Store): Promise<User> {
    return this.storeService.findOwner(store.id);
  }

  @ResolveField(() => [AddressOnOwner])
  async addresses(@Parent() store: Store): Promise<AddressOnOwner[]> {
    return this.addressOnOwnerService.findOwnerAddresses(
      store.id,
      AddressOwnerType.STORE
    );
  }

  @ResolveField(() => [Product])
  async products(@Parent() store: Store): Promise<Product[]> {
    return this.storeService.findProducts(store.id);
  }

  // @ResolveField(() => [PropertyListing])
  // async propertyListings(@Parent() store: Store): Promise<PropertyListing[]> {
  //   return this.storeService.findPropertyListings(store.id);
  // }

  // @ResolveField(() => [VehicleListing])
  // async vehicleListings(@Parent() store: Store): Promise<VehicleListing[]> {
  //   return this.storeService.findVehicleListings(store.id);
  // }

  @ResolveField(() => [Category])
  async categories(
    @Parent() store: Store,
    @Args() args: PaginationArgs
  ): Promise<Category[]> {
    return this.storeService.findCategories(store.type, args);
  }

  @ResolveField(() => [Collection])
  async collections(@Parent() store: Store): Promise<Collection[]> {
    return this.storeService.findCollections(store.id);
  }

  @ResolveField(() => [Tag])
  async tags(@Parent() store: Store): Promise<Tag[]> {
    return this.storeService.findTags(store.id);
  }
}
