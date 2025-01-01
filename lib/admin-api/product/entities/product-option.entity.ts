import { ObjectType, Field, ID } from '@nestjs/graphql';
import { ProductOption as ProductOptionModel } from '@prisma/client';
import { Product } from './product.entity';

@ObjectType({ description: 'Product option model (e.g., Size, Color)' })
export class ProductOption implements Omit<ProductOptionModel, 'productId'> {
  @Field(() => ID, { description: 'Unique identifier' })
  id: string;

  @Field(() => String, { description: 'Option name (e.g., "Size", "Color")' })
  name: string;

  @Field(() => [String], {
    description: 'Possible values for this option (e.g., ["S", "M", "L"])',
  })
  values: string[];

  @Field(() => Product, { description: 'Product this option belongs to' })
  product?: Product;

  @Field(() => Date, { description: 'When the option was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the option was last updated' })
  updatedAt: Date;
}

@ObjectType()
export class ProductOptionValue {
  @Field(() => String, { description: 'Option name' })
  name: string;

  @Field(() => String, { description: 'Selected value' })
  value: string;
}

@ObjectType()
export class ProductOptionValueCombination {
  @Field(() => ID, {
    description: 'Variant ID associated with this combination',
  })
  variantId: string;

  @Field(() => [ProductOptionValue], {
    description: 'List of option value pairs',
  })
  values: ProductOptionValue[];
}
