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

export enum ActivityType {
  PRODUCT_ADDED = 'PRODUCT_ADDED',
  PRODUCT_UPDATED = 'PRODUCT_UPDATED',
  COLLECTION_CREATED = 'COLLECTION_CREATED',
  ORDER_RECEIVED = 'ORDER_RECEIVED',
  CUSTOMER_REGISTERED = 'CUSTOMER_REGISTERED',
}

registerEnumType(ActivityType, {
  name: 'ActivityType',
  description: 'Type of activity in the system',
});

@ObjectType()
class ActivityUser {
  @Field(() => String)
  name: string;

  @Field(() => String)
  avatar: string;
}

@ObjectType()
export class RecentActivity {
  @Field(() => String)
  id: string;

  @Field(() => ActivityType)
  type: ActivityType;

  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;

  @Field(() => Date)
  timestamp: Date;

  @Field(() => ActivityUser, { nullable: true })
  user?: ActivityUser;
}

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
