import { Store as StoreBase, StoreType, StoreCurrency } from '@prisma/client';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'store' })
export class Store implements StoreBase {
  @Field(() => ID, { description: 'ID of the Store' })
  id: string;

  @Field(() => String, { description: 'Email of the Store' })
  email: string;

  @Field(() => String, { description: 'Name of the Store' })
  name: string;

  @Field(() => String, { description: 'Slug of the Store' })
  slug: string;

  @Field(() => StoreType, { description: 'Type of the Store' })
  type: StoreType;

  @Field(() => String, { description: 'Currency of the Store', nullable: true })
  description: string | null;

  @Field(() => StoreCurrency, { description: 'Currency of the Store' })
  currency: StoreCurrency;

  @Field(() => String, { description: 'ID of the User who owns the store' })
  ownerId: string;

  @Field(() => Date, {
    description: 'Date the Store was last updated',
  })
  updatedAt: Date;

  @Field(() => Date, { description: 'Date the Store was created' })
  createdAt: Date;
}
