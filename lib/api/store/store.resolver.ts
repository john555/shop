import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Logger, NotFoundException, UseGuards } from '@nestjs/common';
import { Store } from './store.entity';
import { StoreService } from './store.service';
import { StoreCreateInput, StoreUpdateInput } from './store.dto';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@Resolver(() => Store)
export class StoreResolver {
  constructor(private readonly storeService: StoreService) {}

  @Query(() => Store!)
  async store(@Args('id') id: string): Promise<Store> {
    const store = await this.storeService.getStoreById(id);
    if (!store) {
      throw new NotFoundException('Store not found');
    }
    return store;
  }

  @Query(() => [Store!])
  async stores(@Args() args: PaginationArgs): Promise<Store[]> {
    return this.storeService.getStores(args);
  }

  // This mutation is protected by the JwtAuthGuard
  // TODO: Add a role guard to this mutation.
  // We may want to check if the user is subscribed to a plan
  @UseGuards(JwtAuthGuard)
  @Mutation(() => Store)
  async createStore(
    @Args('input') input: StoreCreateInput,
    @Context() context: {req: {user: {email: string; id: string}}}
  ): Promise<Store> {
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
