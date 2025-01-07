import {
  ObjectType,
  Field,
  ID,
  registerEnumType,
  Float,
  Int,
} from '@nestjs/graphql';
import { Product as PrismaProduct } from '@prisma/client';
import { ProductVariant } from './product-variant.entity';

@ObjectType({ description: 'Product model' })
export class Product implements Partial<PrismaProduct> {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  description!: string | null;

  @Field(() => String)
  slug!: string;

  @Field(() => String, { nullable: true })
  seoTitle!: string | null;

  @Field(() => String, { nullable: true })
  seoDescription!: string | null;

  @Field(() => String, { nullable: true })
  categoryId!: string | null;

  @Field(() => String)
  storeId!: string;

  @Field(() => Date)
  createdAt!: Date;

  @Field(() => Date)
  updatedAt!: Date;

  // Relations that will be resolved
  @Field(() => [ProductVariant])
  variants?: ProductVariant[];

  // Computed fields that will be resolved
  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => Float, { nullable: true })
  compareAtPrice?: number | null;

  @Field(() => String, { nullable: true })
  sku?: string | null;

  @Field(() => Int)
  available?: number;
}
