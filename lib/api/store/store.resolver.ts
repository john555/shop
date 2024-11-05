import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger, NotFoundException, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import {
  StoreGetArgs,
  StoreCreateInput,
  StoreUpdateInput,
  GetMyStoresArgs,
} from './store.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';
import { AuthContext } from '../utils/auth';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  private async validateStoreOwnership(storeId: string, userId: string): Promise<Store> {
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
  @Query(() => Store)
  async store(
    @Args() args: StoreGetArgs,
    @Context() context: AuthContext
  ): Promise<Store> {
    // Validate ownership and get store in one step
    return this.validateStoreOwnership(args.id, context.req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Store!])
  async myStores(
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Store[]> {
    return this.storeService.getStoresByOwnerId(context.req.user.id, args);
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async createStore(
    @Args('input') input: StoreCreateInput,
    @Context() context: AuthContext
  ): Promise<Store> {
    try {
      const myStores = await this.storeService.getStoresByOwnerId(
        context.req.user.id
      );

      if (myStores.length > 0) {
        throw new Error('You can only have one store');
      }

      return this.storeService.create({
        ...input,
        email: context.req.user.email,
        ownerId: context.req.user.id,
      });
    } catch (error) {
      Logger.error(`Failed to create store: ${error.message}`, error.stack);
      throw error;
    }
  }

  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async updateStore(
    @Args('input') input: StoreUpdateInput,
    @Context() context: AuthContext
  ): Promise<Store> {
    try {
      // Validate ownership before update
      await this.validateStoreOwnership(input.id, context.req.user.id);

      return await this.storeService.update(input.id, input);
    } catch (error) {
      Logger.error(`Failed to update store: ${error.message}`, error.stack);
      
      // Re-throw specific errors
      if (error instanceof NotFoundException || error instanceof UnauthorizedException) {
        throw error;
      }
      
      // Generic error for other cases
      throw new Error('Failed to update store');
    }
  }
}