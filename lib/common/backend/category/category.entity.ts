import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Category as CategoryModel, StoreType } from '@prisma/client';
import { Store } from '@/common/backend/store/store.entity';

@ObjectType({ description: 'Category model' })
export class Category implements Omit<CategoryModel, 'store'> {
  @Field(() => ID, { description: 'Unique identifier of the category' })
  id: string;

  @Field(() => String, { description: 'Name of the category' })
  name: string;

  @Field(() => String, { description: 'URL-friendly slug of the category' })
  slug: string;

  @Field(() => String, {
    description: 'Description of the category',
    nullable: true,
  })
  description: string | null;

  @Field(() => ID, {
    description: 'ID of the parent category',
    nullable: true,
  })
  parentId: string | null;

  @Field(() => StoreType, { description: 'Type of the store' })
  storeType: StoreType;

  @Field(() => [Category], {
    description: 'Child categories',
    nullable: true,
  })
  children?: Category[];

  @Field(() => Category, {
    description: 'Parent category',
    nullable: true,
  })
  parent?: Category;

  @Field(() => Date, { description: 'When the category was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the category was last updated' })
  updatedAt: Date;
}
