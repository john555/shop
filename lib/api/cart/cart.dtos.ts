import {
  Field,
  InputType,
} from '@nestjs/graphql';

@InputType()
export class CreateCartInput {
  @Field()
  storeId: string;

  @Field(() => String, { nullable: true })
  customerId: string | null;

  @Field(() => String, { nullable: true })
  email: string | null;

  @Field(() => String, { nullable: true })
  phoneNumber: string | null;

  @Field(() => String, { nullable: true })
  notes: string | null;
}

@InputType()
export class AddCartItemInput {
  @Field()
  cartId: string;

  @Field()
  productId: string;

  @Field(() => String, { nullable: true })
  variantId: string | null;

  @Field()
  quantity: number;
}

@InputType()
export class UpdateCartItemInput {
  @Field()
  cartItemId: string;

  @Field()
  quantity: number;
}

@InputType()
export class ApplyDiscountInput {
  @Field()
  cartId: string;

  @Field()
  code: string;
}
