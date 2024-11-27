import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Logger, NotFoundException } from '@nestjs/common';
import { Order, OrderStats } from './order.entity';
import { OrderService } from './order.service';
import { Store } from '../store/store.entity';
import { Customer } from '../customer/customer.entity';
import { OrderItem } from './order.entity';
import { GetMyStoreOrdersArgs, OrderCreateInput, OrderFiltersInput, OrderGetArgs } from './order.dto';
import { AuthStore } from '../authorization/decorators/auth.decorator';
import { AuthContext } from '../utils/auth';
import { PaginationArgs } from '../pagination/pagination.args';

@Resolver(() => Order)
export class OrderResolver {
  private readonly logger = new Logger(OrderResolver.name);

  constructor(private readonly orderService: OrderService) {}

  @AuthStore()
  @Query(() => [Order])
  async myStoreOrders(
    @Args() args: GetMyStoreOrdersArgs,
    @Args() pagination: PaginationArgs,
    @Context() ctx: AuthContext,
    @Args('filters', { nullable: true }) filters?: OrderFiltersInput
  ): Promise<Order[]> {
    return this.orderService.findByStore(args.storeId, pagination, filters);
  }

  @AuthStore()
  @Query(() => OrderStats)
  async myStoreOrderStats(
    @Args() args: GetMyStoreOrdersArgs,
    @Context() ctx: AuthContext
  ): Promise<OrderStats> {
    return this.orderService.getStoreOrderStats(args.storeId);
  }
  
  @AuthStore()
  @Query(() => Order, { nullable: true })
  async order(@Args() args: OrderGetArgs): Promise<Order | null> {
    return this.orderService.findById(args.id);
  }

  @AuthStore()
  @Mutation(() => Order)
  async createDraftOrder(
    @Args('input') input: OrderCreateInput,
    @Context() ctx: AuthContext
  ): Promise<Order> {
    try {
      return await this.orderService.createDraftOrder(input);
    } catch (error) {
      this.logger.error('Failed to create draft order:', error);
      throw error;
    }
  }

  @ResolveField(() => Store)
  async store(@Parent() order: Order): Promise<Store> {
    return this.orderService.findOrderStore(order.id);
  }

  @ResolveField(() => Customer, { nullable: true })
  async customer(@Parent() order: Order): Promise<Customer | null> {
    return this.orderService.findOrderCustomer(order.id);
  }

  @ResolveField(() => [OrderItem])
  async items(@Parent() order: Order): Promise<OrderItem[]> {
    return this.orderService.findOrderItems(order.id);
  }

  @ResolveField(() => String)
  async formattedOrderNumber(@Parent() order: Order): Promise<string> {
    const store = await this.orderService.findOrderStore(order.id);
    return this.orderService.getFormattedOrderNumber(order, store);
  }
}
