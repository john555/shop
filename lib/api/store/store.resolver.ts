import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Query(() => Store!)
  async store(@Args() args: StoreGetArgs): Promise<Store> {
    const store = await this.storeService.getStoreById(args.id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  @UseGuards(JwtAuthGuard)
  @Query(() => [Store!])
  async myStores(
    @Args() args: PaginationArgs,
    @Context() context: AuthContext
  ): Promise<Store[]> {
    return this.storeService.getStoresByOwnerId(context.req.user.id, args);
  }

  // This mutation is protected by the JwtAuthGuard
  // TODO: Add a role guard to this mutation.
  // We may want to check if the user is subscribed to a plan
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async createStore(
    @Args('input') input: StoreCreateInput,
    @Context() context: AuthContext
  ): Promise<Store> {
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
  }

  // This mutation is protected by the JwtAuthGuard
  // TODO: Add a role guard to this mutation as well.
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async updateStore(
    @Args('input') input: StoreUpdateInput
  ): Promise<Store | null> {
    let store: Store;
    try {
      store = await this.storeService.update(input.id, input);
      return store;
    } catch (e) {
      Logger.error(e);
      return null;
    }
  }
}
