import { Field, ID, InputType, ArgsType } from '@nestjs/graphql';
import { AddressType, AddressOwnerType } from '@prisma/client';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsEnum,
  IsBoolean,
} from 'class-validator';

@InputType()
export class AddressInput {
  @Field(() => String, { description: 'Country name or ISO code' })
  @IsNotEmpty()
  @IsString()
  country!: string;

  @Field(() => String, { description: 'State/province/region', nullable: true })
  @IsString()
  @IsOptional()
  state?: string;

  @Field(() => String, {
    description: 'City/town/municipality',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  city?: string;

  @Field(() => String, {
    description: 'Street address, building number',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  line1?: string;

  @Field(() => String, {
    description: 'Suite, apartment, unit number',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  line2?: string;

  @Field(() => String, { description: 'Postal/ZIP code', nullable: true })
  @IsString()
  @IsOptional()
  @Length(1, 20)
  zipCode?: string;
}

@ArgsType()
export class GetAddressesArgs {
  @Field(() => ID, { description: 'ID of the entity that owns the addresses' })
  @IsNotEmpty()
  @IsString()
  ownerId!: string;

  @Field(() => AddressOwnerType, {
    description: 'Type of entity that owns the addresses',
  })
  @IsEnum(AddressOwnerType)
  @IsNotEmpty()
  ownerType!: AddressOwnerType;
}

@ArgsType()
export class GetAddressArgs {
  @Field(() => ID, { description: 'ID of the entity that owns the address' })
  @IsNotEmpty()
  @IsString()
  ownerId!: string;

  @Field(() => AddressOwnerType, {
    description: 'Type of entity that owns the address',
  })
  @IsEnum(AddressOwnerType)
  @IsNotEmpty()
  ownerType!: AddressOwnerType;

  @Field(() => AddressType, { description: 'Type of address to fetch' })
  @IsEnum(AddressType)
  @IsNotEmpty()
  type!: AddressType;
}

@InputType()
export class UpdateAddressInput {
  @Field(() => ID, { description: 'ID of the entity that owns the address' })
  @IsNotEmpty()
  @IsString()
  ownerId!: string;

  @Field(() => AddressOwnerType, {
    description: 'Type of entity that owns the address',
  })
  @IsEnum(AddressOwnerType)
  @IsNotEmpty()
  ownerType!: AddressOwnerType;

  @Field(() => AddressType, { description: 'Type of address' })
  @IsEnum(AddressType)
  @IsNotEmpty()
  type!: AddressType;

  @Field(() => Boolean, {
    description: 'Whether this is the default address of this type',
    nullable: true,
    defaultValue: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @Field(() => AddressInput, { description: 'Address details' })
  @IsNotEmpty()
  address!: AddressInput;
}
