import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Customer as CustomerModel, Language } from '@prisma/client';
import { AddressOnOwner } from '../../common/backend/address-on-owner/address-on-owner.entity';

registerEnumType(Language, {
  name: 'Language',
  description: 'The language of the customer',
});

@ObjectType({ description: 'Customer model' })
export class Customer implements CustomerModel {
  @Field(() => ID, { description: 'Unique identifier of the customer' })
  id: string;

  @Field(() => String, {
    nullable: true,
    description: 'First name of the customer',
  })
  firstName: string | null;

  @Field(() => String, {
    nullable: true,
    description: 'Last name of the customer',
  })
  lastName: string | null;

  @Field(() => Language, { description: 'Preferred language of the customer' })
  language: Language;

  @Field(() => String, { description: 'Email address of the customer' })
  email: string;

  @Field(() => String, {
    description: 'Phone number of the customer',
    nullable: true,
  })
  phoneNumber: string | null;

  @Field(() => Boolean, {
    description: 'Whether the customer has opted into marketing emails',
  })
  marketingEmails: boolean;

  @Field(() => Boolean, {
    description: 'Whether the customer has opted into marketing SMS',
  })
  marketingSMS: boolean;

  @Field(() => String, {
    description: 'Additional notes about the customer',
    nullable: true,
  })
  notes: string | null;

  @Field(() => Date, { description: 'When the customer was created' })
  createdAt: Date;

  @Field(() => Date, { description: 'When the customer was last updated' })
  updatedAt: Date;

  // Store relationship
  @Field(() => String, {
    description: 'ID of the store this customer belongs to',
  })
  storeId: string;

  @Field(() => AddressOnOwner, { nullable: true })
  billingAddress?: AddressOnOwner | null;
}
