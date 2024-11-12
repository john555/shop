import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Logger, NotFoundException, UnauthorizedException, UseGuards, BadRequestException } from '@nestjs/common';
import { Collection } from './collection.entity';
import { CollectionService } from './collection.service';
import { StoreService } from '../store/store.service';
import { CollectionGetArgs, CollectionCreateInput, CollectionUpdateInput } from './collection.dto';
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
    const store = await this.storeService.getStoreById(storeId);
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }
    if (store.ownerId !== userId) {
      throw new UnauthorizedException('You do not have permission to access this store');
    }
    return store;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => Collection)
  async collection(
    @Args() args: CollectionGetArgs,
    @Context() context: AuthContext
  ): Promise<Partial<Collection>> {
    const collection = await this.collectionService.getCollectionById(args.id);
    if (!collection) {
      throw new NotFoundException(`Collection with ID ${args.id} not found`);
    }

    await this.validateStoreOwnership(collection.storeId, context.req.user.id);
    return collection;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Collection])
  async storeCollections(
    @Args('storeId') storeId: string,
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Partial<Collection>[]> {
    await this.validateStoreOwnership(storeId, context.req.user.id);
    return this.collectionService.getCollectionsByStoreId(storeId, args);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Collection)
  async createCollection(
    @Args('input') input: CollectionCreateInput,
    @Context() context: AuthContext
  ): Promise<Partial<Collection>> {
    try {
      await this.validateStoreOwnership(input.storeId, context.req.user.id);

      const isSlugUnique = await this.collectionService.isSlugUnique(input.slug, input.storeId);
      if (!isSlugUnique) {
        throw new BadRequestException('Collection slug is already taken in this store');
      }

      return await this.collectionService.create(input);
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
  ): Promise<Partial<Collection>> {
    try {
      const collection = await this.collectionService.getCollectionById(input.id);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${input.id} not found`);
      }

      await this.validateStoreOwnership(collection.storeId, context.req.user.id);

      return await this.collectionService.update(input.id, input);
    } catch (error) {
      this.logger.error(`Failed to update collection ${input.id}:`, error);
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
      const collection = await this.collectionService.getCollectionById(id);
      if (!collection) {
        throw new NotFoundException(`Collection with ID ${id} not found`);
      }

      await this.validateStoreOwnership(collection.storeId, context.req.user.id);
      await this.collectionService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete collection ${id}:`, error);
      throw error;
    }
  }

  @ResolveField(() => Store)
  async store(@Parent() collection: Collection): Promise<Store> {
    return this.collectionService.findCollectionStore(collection.id);
  }

  @ResolveField(() => [Product])
  async products(@Parent() collection: Collection): Promise<Product[]> {
    return this.collectionService.findCollectionProducts(collection.id);
  }
}
