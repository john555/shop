import {
  Field,
  ObjectType,
  ID,
  Float,
  registerEnumType,
  InputType,
  Int,
} from '@nestjs/graphql';
import { CartStatus, StoreCurrency, DiscountType } from '@prisma/client';

registerEnumType(CartStatus, {
  name: 'CartStatus',
});

registerEnumType(StoreCurrency, {
  name: 'StoreCurrency',
});

registerEnumType(DiscountType, {
  name: 'DiscountType',
});

@ObjectType()
export class Cart {
  @Field(() => ID)
  id: string;

  @Field(() => CartStatus)
  status: CartStatus;

  @Field(() => Float)
  subtotalAmount: number;

  @Field(() => Float)
  taxAmount: number;

  @Field(() => Float)
  shippingAmount: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => StoreCurrency)
  currency: StoreCurrency;

  @Field()
  currencySymbol: string;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phoneNumber: string | null;

  @Field(() => String, { nullable: true })
  notes: string | null;

  @Field(() => ID)
  storeId: string;

  @Field(() => ID, { nullable: true })
  customerId: string | null;

  @Field(() => [CartItem])
  items: CartItem[];

  @Field(() => [CartDiscount])
  discounts: CartDiscount[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date)
  lastActivityAt: Date;

  @Field(() => Date, { nullable: true })
  checkoutStartedAt: Date | null;

  @Field(() => Date, { nullable: true })
  convertedAt: Date | null;

  @Field(() => Date, { nullable: true })
  expiresAt: Date | null;
}

@ObjectType()
export class CartItem {
  @Field(() => ID)
  id: string;

  @Field()
  productId: string;

  @Field(() => String, { nullable: true })
  variantId: string | null;

  @Field()
  title: string;

  @Field(() => String, { nullable: true })
  variantName: string | null;

  @Field(() => String, { nullable: true })
  previewImageUrl: string | null;

  @Field(() => String, { nullable: true })
  sku: string | null;

  @Field(() => Float)
  unitPrice: number;

  @Field(() => Int)
  quantity: number;

  @Field(() => Float)
  subtotal: number;

  @Field(() => Float)
  taxAmount: number;

  @Field(() => Float)
  discountAmount: number;

  @Field(() => Float)
  totalAmount: number;

  @Field(() => ID)
  cartId: string;
}

@ObjectType()
export class CartDiscount {
  @Field(() => ID)
  id: string;

  @Field()
  code: string;

  @Field(() => DiscountType)
  type: DiscountType;

  @Field(() => Float)
  amount: number;

  @Field()
  applied: boolean;

  @Field(() => ID)
  cartId: string;
}
