import { ObjectType, Field, ID, Float, Int } from '@nestjs/graphql';
import { ProductVariant as ProductVariantModel } from '@prisma/client';
import { Media } from '../../media/media.entity';
import { Product } from './product.entity';
import { Decimal } from '@prisma/client/runtime/library';

@ObjectType({ description: 'Product variant model' })
export class ProductVariant
  implements
    Omit<
      ProductVariantModel,
      'product' | 'price' | 'compareAtPrice' | 'isArchived' | 'archivedAt'
    >
{
  @Field(() => ID, { description: 'Unique identifier' })
  id: string;

  @Field(() => [String], {
    description: 'Combination of option values that define this variant',
  })
  optionCombination: string[];

  // Pricing
  @Field(() => Float, { description: 'Current selling price' })
  price: Decimal;

  @Field(() => Float, {
    description: 'Original or compare-at price',
    nullable: true,
  })
  compareAtPrice: Decimal | null;

  // Inventory
  @Field(() => String, {
    description: 'Stock keeping unit',
    nullable: true,
  })
  sku: string | null;

  @Field(() => Int, {
    description: 'Number of items in stock',
    defaultValue: 0,
  })
  available: number;

  // Relations
  @Field(() => String, { description: 'ID of the parent product' })
  productId: string;

  @Field(() => Product, { description: 'Parent product' })
  product?: Product;

  @Field(() => [Media], {
    description: 'Media attached to this variant',
    defaultValue: [],
  })
  media?: Media[];

  // Timestamps
  @Field(() => Date, { description: 'When the variant was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the variant was last updated' })
  updatedAt: Date;

  // @Field(() => Boolean, { description: 'Whether the variant is archived' })
  // isArchived: boolean;

  // @Field(() => Date, { description: 'When the variant was archived' })
  // archivedAt: Date;
}
