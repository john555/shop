import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Int,
} from '@nestjs/graphql';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import {
  CollectionGetArgs,
  CollectionCreateInput,
  CollectionUpdateInput,
  BulkCollectionDeleteInput,
  BulkCollectionUpdateInput,
} from './collection.dto';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';
import { AuthContext } from '../../common/backend/utils/auth';
import { Store } from '@/lib/admin-api/store/store.entity';
import {
  AuthBulkCollections,
  AuthBulkProducts,
  AuthCollection,
  AuthStore,
} from '@/common/backend/authorization/decorators/auth.decorator';
import { Product } from '../product/entities/product.entity';

@Resolver(() => Collection)
export class CollectionResolver {
  private readonly logger = new Logger(CollectionResolver.name);

  constructor(private readonly collectionService: CollectionService) {}

  @AuthCollection()
  @Query(() => Collection)
  async collection(
    @Args() args: CollectionGetArgs,
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      const collection = await this.collectionService.getCollectionById(
        args.id
      );
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${args.id} not found`);
      }
      return collection;
    } catch (error) {
      this.logger.error(`Failed to fetch collection:`, error);
      throw error;
    }
  }

  @AuthStore()
  @Query(() => [Collection])
  async storeCollections(
    @Args('storeId') storeId: string,
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Collection[]> {
    try {
      return this.collectionService.getCollectionsByStoreId(storeId, args);
    } catch (error) {
      this.logger.error(`Failed to fetch store collections:`, error);
      throw error;
    }
  }

  @AuthStore()
  @Mutation(() => Collection)
  async createCollection(
    @Args('input') input: CollectionCreateInput,
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      return this.collectionService.create(input);
    } catch (error) {
      this.logger.error('Failed to create collection:', error);
      throw error;
    }
  }

  @AuthCollection()
  @Mutation(() => Collection)
  async updateCollection(
    @Args('input') input: CollectionUpdateInput,
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      return this.collectionService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update collection:`, error);
      throw error;
    }
  }

  @AuthCollection()
  @Mutation(() => Boolean)
  async deleteCollection(@Args('id') id: string): Promise<boolean> {
    try {
      await this.collectionService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete collection:`, error);
      throw error;
    }
  }

  @AuthStore()
  @Mutation(() => Int)
  async bulkDeleteCollections(
    @Args('input') input: BulkCollectionDeleteInput
  ): Promise<number> {
    try {
      // Validate that all collections belong to the store
      const hasOwnership =
        await this.collectionService.validateCollectionsOwnership(
          input.collectionIds,
          input.storeId
        );

      if (!hasOwnership) {
        throw new UnauthorizedException(
          'Some collections do not belong to the specified store'
        );
      }

      return this.collectionService.bulkDelete(input.collectionIds);
    } catch (error) {
      this.logger.error('Failed to bulk delete collections:', error);
      throw error;
    }
  }

  @AuthBulkCollections()
  @Mutation(() => Int)
  async bulkUpdateCollections(
    @Args('input') input: BulkCollectionUpdateInput
  ): Promise<number> {
    try {
      // Validate that all collections belong to the store
      const hasOwnership =
        await this.collectionService.validateCollectionsOwnership(
          input.collectionIds,
          input.storeId
        );

      if (!hasOwnership) {
        throw new UnauthorizedException(
          'Some collections do not belong to the specified store'
        );
      }

      return this.collectionService.bulkUpdate(input.collectionIds, input.data);
    } catch (error) {
      this.logger.error('Failed to bulk update collections:', error);
      throw error;
    }
  }

  @AuthCollection()
  @AuthBulkProducts()
  @Mutation(() => Collection)
  async addProductsToCollection(
    @Args('collectionId') collectionId: string,
    @Args('productIds', { type: () => [String] }) productIds: string[],
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      return this.collectionService.addProductsToCollection(
        collectionId,
        productIds
      );
    } catch (error) {
      this.logger.error('Failed to add products to collection:', error);
      throw error;
    }
  }

  @AuthCollection()
  @AuthBulkProducts()
  @Mutation(() => Collection)
  async removeProductsFromCollection(
    @Args('collectionId') collectionId: string,
    @Args('productIds', { type: () => [String] }) productIds: string[],
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      return this.collectionService.removeProductsFromCollection(
        collectionId,
        productIds
      );
    } catch (error) {
      this.logger.error('Failed to remove products from collection:', error);
      throw error;
    }
  }

  @ResolveField(() => Store)
  async store(@Parent() collection: Collection): Promise<Store> {
    try {
      return this.collectionService.findCollectionStore(collection.id);
    } catch (error) {
      this.logger.error(`Failed to resolve store for collection:`, error);
      throw error;
    }
  }

  @ResolveField(() => [Product])
  async products(@Parent() collection: Collection): Promise<Product[]> {
    try {
      return this.collectionService.findCollectionProducts(collection.id);
    } catch (error) {
      this.logger.error(`Failed to resolve store for collection:`, error);
      throw error;
    }
  }
}
