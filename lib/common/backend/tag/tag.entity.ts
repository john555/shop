import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Tag as TagModel } from '@prisma/client';
import { Store } from '@/common/backend/store/store.entity';
import { Product } from '../../../admin-api/product/entities/product.entity';

@ObjectType({ description: 'Tag model' })
export class Tag implements Omit<TagModel, 'store' | 'products'> {
  @Field(() => ID, { description: 'Unique identifier of the tag' })
  id: string;

  @Field(() => String, { description: 'Name of the tag' })
  name: string;

  @Field(() => String, { description: 'URL-friendly slug of the tag' })
  slug: string;

  @Field(() => Store, { 
    description: 'Store this tag belongs to',
    nullable: true 
  })
  store?: Store;

  @Field(() => String, { description: 'ID of the store this tag belongs to' })
  storeId: string;

  @Field(() => [Product], { 
    description: 'Products associated with this tag',
    nullable: true 
  })
  products?: Product[];

  @Field(() => Date, { description: 'When the tag was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the tag was last updated' })
  updatedAt: Date;
}
