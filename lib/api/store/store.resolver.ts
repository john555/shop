import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import {
  StoreGetArgs,
  StoreCreateInput,
  StoreUpdateInput,
  GetStoreBySlugArgs,
} from './store.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthContext } from '../utils/auth';
import { StoreCurrency, CurrencyPosition } from '@prisma/client';
import { StoreWithRelations, DEFAULT_STORE_INCLUDE } from './store.types';

@Resolver(() => Store)
export class StoreResolver {
  private readonly logger = new Logger(StoreResolver.name);

  constructor(private readonly storeService: StoreService) {}

  private async validateStoreOwnership(
    storeId: string,
    userId: string
  ): Promise<StoreWithRelations> {
    const store = await this.storeService.getStoreById(storeId);

    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    if (store.ownerId !== userId) {
      throw new UnauthorizedException(
        'You do not have permission to access this store'
      );
    }

    return store;
  }

  // Query Methods
  @UseGuards(JwtAuthGuard)
  @Query(() => Store)
  async store(
    @Args() args: StoreGetArgs,
    @Context() context: AuthContext
  ): Promise<StoreWithRelations> {
    await this.validateStoreOwnership(args.id, context.req.user.id);

    const store = await this.storeService.getStoreById(
      args.id,
      DEFAULT_STORE_INCLUDE
    );
    if (!store) {
      throw new NotFoundException(`Store with ID ${args.id} not found`);
    }

    return store;
  }

  @Query(() => Store, { nullable: true })
  async storeBySlug(
    @Args() args: GetStoreBySlugArgs
  ): Promise<StoreWithRelations | null> {
    return this.storeService.getStoreBySlug(args.slug, DEFAULT_STORE_INCLUDE);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Store])
  async myStores(
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<StoreWithRelations[]> {
    return this.storeService.getStoresByOwnerId(
      context.req.user.id,
      args,
      DEFAULT_STORE_INCLUDE
    );
  }

  // Mutation Methods
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async createStore(
    @Args('input') input: StoreCreateInput,
    @Context() context: AuthContext
  ): Promise<StoreWithRelations> {
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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async updateStore(
    @Args('input') input: StoreUpdateInput,
    @Context() context: AuthContext
  ): Promise<StoreWithRelations> {
    try {
      await this.validateStoreOwnership(input.id, context.req.user.id);

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

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Boolean)
  async deleteStore(
    @Args('id') id: string,
    @Context() context: AuthContext
  ): Promise<boolean> {
    try {
      await this.validateStoreOwnership(id, context.req.user.id);
      await this.storeService.delete(id);
      return true;
    } catch (error) {
      this.logger.error(`Failed to delete store ${id}:`, error);
      throw error;
    }
  }
}
