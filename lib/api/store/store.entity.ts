import {
  Store as StoreBase,
  StoreType,
  StoreCurrency,
  CurrencyPosition,
  UnitSystem,
  WeightUnit,
} from '@prisma/client';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: 'store' })
export class Store implements StoreBase {
  @Field(() => ID, { description: 'ID of the Store' })
  id: string;

  @Field(() => String, { description: 'Name of the Store' })
  name: string;

  @Field(() => String, { description: 'Slug of the Store' })
  slug: string;

  @Field(() => String, { description: 'Email of the Store' })
  email: string;

  @Field(() => String, {
    description: 'Phone number of the Store',
    nullable: true,
  })
  phone: string | null;

  @Field(() => String, {
    description: 'WhatsApp number of the Store',
    nullable: true,
  })
  whatsApp: string | null;

  @Field(() => String, {
    description: 'Facebook page of the Store',
    nullable: true,
  })
  facebook: string | null;

  @Field(() => String, {
    description: 'Instagram handle of the Store',
    nullable: true,
  })
  instagram: string | null;

  @Field(() => StoreType, { description: 'Type of the Store' })
  type: StoreType;

  @Field(() => StoreCurrency, { description: 'Currency of the Store' })
  currency: StoreCurrency;

  @Field(() => String, { description: 'Custom currency symbol', nullable: true })
  currencySymbol: string | null;

  @Field(() => CurrencyPosition, { description: 'Position of currency symbol' })
  currencyPosition: CurrencyPosition;

  @Field(() => Boolean, { description: 'Whether to show currency code' })
  showCurrencyCode: boolean;

  @Field(() => UnitSystem, { description: 'Measurement system' })
  unitSystem: UnitSystem;

  @Field(() => WeightUnit, { description: 'Weight unit' })
  weightUnit: WeightUnit;

  @Field(() => String, { description: 'Timezone of the Store' })
  timeZone: string;

  @Field(() => String, { description: 'Order number prefix', nullable: true })
  orderPrefix: string | null;

  @Field(() => String, { description: 'Order number suffix', nullable: true })
  orderSuffix: string | null;

  @Field(() => String, { description: 'ID of the User who owns the store' })
  ownerId: string;

  @Field(() => Date, { description: 'Date the Store was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'Date the Store was last updated' })
  updatedAt: Date;
}
