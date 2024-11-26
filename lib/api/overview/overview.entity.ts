import {
  ObjectType,
  Field,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from '@prisma/client';

// temp enum
registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Order Status',
});

@ObjectType()
export class RecentOrder {
  @Field(() => String)
  id: string;

  @Field(() => String)
  customerName: string;

  @Field(() => Float)
  total: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => Boolean)
  isNew: boolean;
}

@ObjectType()
export class RecentActivity {
  @Field(() => String)
  type: string;

  @Field(() => String)
  message: string;

  @Field(() => String)
  userId: string;

  @Field(() => String)
  userName: string;

  @Field(() => String, { nullable: true })
  details?: string;

  @Field(() => Date)
  timestamp: Date;
}

@ObjectType()
export class StoreOverview {
  @Field(() => Int)
  totalProducts: number;

  @Field(() => String)
  productsSubtext: string;

  @Field(() => Int)
  collections: number;

  @Field(() => String)
  collectionsSubtext: string;

  @Field(() => Int)
  customers: number;

  @Field(() => String)
  customersSubtext: string;

  @Field(() => Int)
  totalOrders: number;

  @Field(() => String)
  ordersSubtext: string;

  @Field(() => Float)
  revenue: number;

  @Field(() => Float)
  revenueGrowth: number;

  @Field(() => Float)
  averageOrderValue: number;

  @Field(() => Float)
  orderValueGrowth: number;

  @Field(() => Float)
  conversionRate: number;

  @Field(() => Float)
  conversionRateGrowth: number;

  @Field(() => [RecentOrder])
  recentOrders: RecentOrder[];

  @Field(() => [RecentActivity])
  recentActivities: RecentActivity[];
}
