import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Address as AddressModel } from '@prisma/client';

@ObjectType({ description: 'Address' })
export class Address implements AddressModel {
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
