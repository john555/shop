import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsBoolean,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { AddressOwnerType, AddressType } from '@prisma/client';

@InputType()
export class AddressInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  country!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  state?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  city?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  line1?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  line2?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  zipCode?: string;
}

@ArgsType()
export class AddressOnOwnerGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ArgsType()
export class GetOwnerAddressesArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @Field(() => AddressOwnerType)
  @IsEnum(AddressOwnerType)
  @IsNotEmpty()
  ownerType!: AddressOwnerType;
}

@InputType()
export class AddressOnOwnerCreateInput {
  @Field(() => AddressOwnerType)
  @IsEnum(AddressOwnerType)
  @IsNotEmpty()
  ownerType!: AddressOwnerType;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @Field(() => AddressType)
  @IsEnum(AddressType)
  @IsNotEmpty()
  type!: AddressType;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @Field(() => AddressInput)
  @IsNotEmpty()
  address!: AddressInput;
}

@InputType()
export class AddressOnOwnerUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => AddressType, { nullable: true })
  @IsEnum(AddressType)
  @IsOptional()
  type?: AddressType;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @Field(() => AddressInput, { nullable: true })
  @IsOptional()
  address?: AddressInput;
}
