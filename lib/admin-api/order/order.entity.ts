import {
  ObjectType,
  Field,
  ID,
  Float,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import {
  Order as PrismaOrder,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
  StoreCurrency,
} from '@prisma/client';
import { Customer } from '../customer/customer.entity';
import { Store } from '@/common/backend/store/store.entity';
import { Decimal } from '@prisma/client/runtime/library';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
  description: 'Status of the order',
});

registerEnumType(PaymentStatus, {
  name: 'PaymentStatus',
  description: 'Status of the payment',
});

registerEnumType(ShipmentStatus, {
  name: 'ShipmentStatus',
  description: 'Status of the shipment',
});

@ObjectType({ description: 'Order item model' })
export class OrderItem {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  productId: string;

  @Field(() => String)
  variantId: string;

  @Field(() => String)
  title: string;

  @Field(() => String)
  variantName: string;

  @Field(() => String, { nullable: true })
  sku: string | null;

  @Field(() => Float)
  unitPrice: Decimal;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  subtotal: Decimal;

  @Field(() => Float)
  taxAmount: Decimal;

  @Field(() => Float)
  discountAmount: Decimal;

  @Field(() => Float)
  totalAmount: Decimal;
}

@ObjectType({ description: 'Order model' })
export class Order implements Partial<PrismaOrder> {
  @Field(() => ID)
  id: string;

  @Field(() => String, { description: 'Raw order number without prefix/suffix' })
  orderNumber: string;

  @Field(() => String, { description: 'Formatted order number with prefix/suffix' })
  formattedOrderNumber?: string;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => PaymentStatus)
  paymentStatus: PaymentStatus;

  @Field(() => ShipmentStatus)
  shipmentStatus: ShipmentStatus;

  @Field(() => Float)
  subtotalAmount: Decimal;

  @Field(() => Float)
  taxAmount: Decimal;

  @Field(() => Float)
  shippingAmount: Decimal;

  @Field(() => Float)
  discountAmount: Decimal;

  @Field(() => Float)
  totalAmount: Decimal;

  @Field(() => String, { description: 'Formatted total amount with currency symbol' })
  formattedTotalAmount?: string;

  @Field(() => StoreCurrency)
  currency: StoreCurrency;

  @Field(() => String)
  currencySymbol: string;

  @Field(() => String, { nullable: true })
  customerNotes?: string | null;

  @Field(() => String, { nullable: true })
  privateNotes?: string | null;

  @Field(() => String, { nullable: true })
  trackingNumber?: string | null;

  @Field(() => String, { nullable: true })
  trackingUrl?: string | null;

  @Field(() => String)
  storeId: string;

  @Field(() => String, { nullable: true })
  customerId?: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  paidAt?: Date | null;

  @Field(() => Date, { nullable: true })
  shippedAt?: Date | null;

  @Field(() => Date, { nullable: true })
  deliveredAt?: Date | null;

  @Field(() => Date, { nullable: true })
  cancelledAt?: Date | null;

  // Relations that will be resolved
  @Field(() => Store)
  store?: Store;

  @Field(() => Customer, { nullable: true })
  customer?: Customer | null;

  @Field(() => [OrderItem])
  items?: OrderItem[];
}

@ObjectType()
export class OrderCounts {
  @Field(() => Int)
  total: number;

  @Field(() => Int)
  draft: number;

  @Field(() => Int)
  pending: number;

  @Field(() => Int)
  processing: number;

  @Field(() => Int)
  shipped: number;

  @Field(() => Int)
  delivered: number;

  @Field(() => Int)
  cancelled: number;
}

@ObjectType()
export class OrderTotals {
  @Field(() => Float)
  orders: number;

  @Field(() => Float)
  tax: number;

  @Field(() => Float)
  shipping: number;

  @Field(() => Float)
  discounts: number;
}

@ObjectType()
export class OrderStats {
  @Field(() => OrderCounts)
  counts: OrderCounts;

  @Field(() => OrderTotals)
  totals: OrderTotals;
}
