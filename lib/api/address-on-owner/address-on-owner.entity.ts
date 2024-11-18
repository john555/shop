import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import {
  AddressOnOwner as AddressOnOwnerModel,
  AddressOwnerType,
  AddressType,
} from '@prisma/client';

registerEnumType(AddressOwnerType, {
  name: 'AddressOwnerType',
  description:
    'Type of entity that owns the address (STORE, CUSTOMER, ORDER, etc.)',
});

registerEnumType(AddressType, {
  name: 'AddressType',
  description: 'Type of address (BILLING, SHIPPING, PICKUP, etc.)',
});

@ObjectType({ description: 'Address information' })
export class Address {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  country: string;

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

@ObjectType({ description: 'Address association with an owner entity' })
export class AddressOnOwner implements Omit<AddressOnOwnerModel, 'addressId'> {
  @Field(() => ID)
  id: string;

  @Field(() => AddressOwnerType)
  ownerType: AddressOwnerType;

  @Field(() => String)
  ownerId: string;

  @Field(() => AddressType)
  type: AddressType;

  @Field(() => Boolean)
  isDefault: boolean;

  @Field(() => Address, { nullable: true })
  address?: Address;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
