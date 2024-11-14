import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver, Int } from '@nestjs/graphql';
import { Logger, NotFoundException, UnauthorizedException, UseGuards, BadRequestException } from '@nestjs/common';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { StoreService } from '../store/store.service';
import {
  CollectionGetArgs,
  CollectionCreateInput,
  CollectionUpdateInput,
  BulkCollectionDeleteInput,
  BulkCollectionUpdateInput
} from './collection.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthContext } from '../utils/auth';
import { Store } from '../store/store.entity';
import { Product } from '../product/entities/product.entity';

@Resolver(() => Collection)
export class CollectionResolver {
  private readonly logger = new Logger(CollectionResolver.name);

  constructor(
    private readonly collectionService: CollectionService,
    private readonly storeService: StoreService,
  ) {}

  private async validateStoreOwnership(
    storeId: string,
    userId: string
  ): Promise<Store> {
    try {
      const store = await this.storeService.getStoreById(storeId);
      
      if (!store) {
        throw new NotFoundException(`Store with ID ${storeId} not found`);
      }

      if (store.ownerId !== userId) {
        throw new UnauthorizedException('You do not have permission to access this store');
      }

      return store;
    } catch (error) {
      this.logger.error(`Failed to validate store ownership:`, error);
      throw error;
    }
  }

  private async validateCollectionOwnership(
    collectionId: string,
    userId: string
  ): Promise<Collection> {
    try {
      const collection = await this.collectionService.getCollectionById(collectionId);
      
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${collectionId} not found`);
      }

      const store = await this.storeService.getStoreById(collection.storeId);
      
      if (!store) {
        throw new NotFoundException(`Store for collection ${collectionId} not found`);
      }

      if (store.ownerId !== userId) {
        throw new UnauthorizedException(
          'You do not have permission to access this collection'
        );
      }

      return collection;
    } catch (error) {
      this.logger.error(`Failed to validate collection ownership:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Collection)
  async collection(
    @Args() args: CollectionGetArgs,
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      await this.validateCollectionOwnership(args.id, context.req.user.id);
      return this.collectionService.getCollectionById(args.id);
    } catch (error) {
      this.logger.error(`Failed to fetch collection:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Collection])
  async storeCollections(
    @Args('storeId') storeId: string,
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Collection[]> {
    try {
      await this.validateStoreOwnership(storeId, context.req.user.id);
      return this.collectionService.getCollectionsByStoreId(storeId, args);
    } catch (error) {
      this.logger.error(`Failed to fetch store collections:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Collection)
  async createCollection(
    @Args('input') input: CollectionCreateInput,
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      await this.validateStoreOwnership(input.storeId, context.req.user.id);

      const isSlugUnique = await this.collectionService.isSlugUnique(input.slug, input.storeId);
      if (!isSlugUnique) {
        throw new BadRequestException('Collection slug is already taken in this store');
      }

      return this.collectionService.create(input);
    } catch (error) {
      this.logger.error('Failed to create collection:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Collection)
  async updateCollection(
    @Args('input') input: CollectionUpdateInput,
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      const collection = await this.validateCollectionOwnership(
        input.id,
        context.req.user.id
      );

      return this.collectionService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update collection:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteCollection(
    @Args('id') id: string,
    @Context() context: AuthContext
  ): Promise<boolean> {
    try {
      await this.validateCollectionOwnership(id, context.req.user.id);
      await this.collectionService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete collection:`, error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async bulkDeleteCollections(
    @Args('input') input: BulkCollectionDeleteInput,
    @Context() context: AuthContext
  ): Promise<number> {
    try {
      // Validate store ownership
      await this.validateStoreOwnership(input.storeId, context.req.user.id);

      // Validate that all collections belong to the store
      const hasOwnership = await this.collectionService.validateCollectionsOwnership(
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Int)
  async bulkUpdateCollections(
    @Args('input') input: BulkCollectionUpdateInput,
    @Context() context: AuthContext
  ): Promise<number> {
    try {
      // Validate store ownership
      await this.validateStoreOwnership(input.storeId, context.req.user.id);

      // Validate that all collections belong to the store
      const hasOwnership = await this.collectionService.validateCollectionsOwnership(
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Collection)
  async addProductsToCollection(
    @Args('collectionId') collectionId: string,
    @Args('productIds', { type: () => [String] }) productIds: string[],
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      await this.validateCollectionOwnership(collectionId, context.req.user.id);
      return this.collectionService.addProductsToCollection(collectionId, productIds);
    } catch (error) {
      this.logger.error('Failed to add products to collection:', error);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Collection)
  async removeProductsFromCollection(
    @Args('collectionId') collectionId: string,
    @Args('productIds', { type: () => [String] }) productIds: string[],
    @Context() context: AuthContext
  ): Promise<Collection> {
    try {
      await this.validateCollectionOwnership(collectionId, context.req.user.id);
      return this.collectionService.removeProductsFromCollection(collectionId, productIds);
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
      this.logger.error(`Failed to resolve products for collection:`, error);
      throw error;
    }
  }
}
