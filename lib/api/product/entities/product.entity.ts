import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  Float,
  Int,
} from '@nestjs/graphql';
import { ProductStatus, SalesChannel } from '@prisma/client';
import { Store } from '../../store/store.entity';
import { Category } from '../../category/category.entity';
import { Decimal } from '@prisma/client/runtime/library';

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
  description: 'Status of the product (DRAFT, ACTIVE, ARCHIVED)',
});

registerEnumType(SalesChannel, {
  name: 'SalesChannel',
  description: 'Sales channel for the product (ONLINE, IN_STORE)',
});

@ObjectType({ description: 'Product model' })
export class Product {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  title: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => String)
  slug: string;

  @Field(() => ProductStatus)
  status: ProductStatus;

  @Field(() => String, { nullable: true })
  seoTitle: string | null;

  @Field(() => String, { nullable: true })
  seoDescription: string | null;

  @Field(() => Float)
  price: Decimal;

  @Field(() => Float, { nullable: true })
  compareAtPrice: Decimal | null;

  @Field(() => String, { nullable: true })
  sku: string | null;

  @Field(() => Int)
  available: number;

  @Field(() => Boolean)
  trackInventory: boolean;

  @Field(() => [SalesChannel])
  salesChannels: SalesChannel[];

  @Field(() => String, { nullable: true })
  categoryId: string | null;

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => Store, { nullable: true })
  store?: Store;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
