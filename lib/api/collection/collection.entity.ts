import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Collection as CollectionModel } from '@prisma/client';
import { Store } from '../store/store.entity';
import { Product } from '../product/entities/product.entity';

@ObjectType({ description: 'Collection model' })
export class Collection implements Partial<CollectionModel> {
  @Field(() => ID, { description: 'Unique identifier' })
  id: string;

  @Field(() => String, { description: 'Collection name' })
  name: string;

  @Field(() => String, { description: 'URL-friendly slug' })
  slug: string;

  @Field(() => String, { 
    description: 'Collection description',
    nullable: true 
  })
  description: string | null;

  @Field(() => Store, { description: 'Store this collection belongs to' })
  store?: Store;

  @Field(() => [Product], { description: 'Products in this collection' })
  products?: Product[];

  @Field(() => Date, { description: 'When the collection was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the collection was last updated' })
  updatedAt: Date;

  @Field(() => Boolean, { description: 'Is the collection active' })
  isActive: boolean;

  @Field(() => String, { description: 'SEO title', nullable: true })
  seoTitle: string | null;

  @Field(() => String, { description: 'SEO description', nullable: true })
  seoDescription: string | null;

  // Internal fields (not exposed in GraphQL)
  storeId: string;
}
