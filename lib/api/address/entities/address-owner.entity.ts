import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  Address as AddressModel,
  AddressType,
  AddressOwnerType,
} from '@prisma/client';

registerEnumType(AddressType, {
  name: 'AddressType',
  description: 'Type of address (billing, shipping, etc.)',
});

registerEnumType(AddressOwnerType, {
  name: 'AddressOwnerType',
  description: 'Type of entity that owns the address',
});

@ObjectType({ description: 'Address' })
export class Address implements AddressModel {
  @Field(() => ID)
  id: string;

  @Field(() => String, { nullable: true })
  country: string | null;

  @Field(() => String, { nullable: true })
  state: string | null;

  @Field(() => String, { nullable: true })
  city: string | null;

  @Field(() => String, { nullable: true })
  line1: string | null;

  @Field(() => String, { nullable: true })
  line2: string | null;

  @Field(() => String, { nullable: true })
  zipCode: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType({ description: 'Address relationship with owner' })
export class AddressOnOwner {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  addressId: string;

  @Field(() => Address)
  address: Address;

  @Field(() => String)
  ownerId: string;

  @Field(() => AddressType)
  type: AddressType;

  @Field(() => AddressOwnerType)
  ownerType: AddressOwnerType;

  @Field(() => Boolean)
  isDefault: boolean;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
