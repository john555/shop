import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import {
  Prisma,
  StoreCurrency,
  StoreType,
  CurrencyPosition,
  UnitSystem,
  WeightUnit,
} from '@prisma/client';

import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsBoolean,
  IsEnum,
  MaxLength,
  Matches,
} from 'class-validator';
import { AddressOnOwner } from '../address/entities/address-owner.entity';
import { User } from '../user/user.entity';

@ArgsType()
export class StoreGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ArgsType()
export class GetStoreBySlugArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  slug!: string;
}

@InputType()
export class StoreCreateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  name!: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug!: string;

  @Field(() => StoreType)
  @IsNotEmpty()
  @IsEnum(StoreType)
  type!: StoreType;

  @Field(() => StoreCurrency)
  @IsNotEmpty()
  @IsEnum(StoreCurrency)
  currency!: StoreCurrency;
}

@InputType()
export class StoreUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  phone?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  whatsApp?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  facebook?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  instagram?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  currencySymbol?: string;

  @Field(() => CurrencyPosition, { nullable: true })
  @IsEnum(CurrencyPosition)
  @IsOptional()
  currencyPosition?: CurrencyPosition;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  showCurrencyCode?: boolean;

  @Field(() => UnitSystem, { nullable: true })
  @IsEnum(UnitSystem)
  @IsOptional()
  unitSystem?: UnitSystem;

  @Field(() => WeightUnit, { nullable: true })
  @IsEnum(WeightUnit)
  @IsOptional()
  weightUnit?: WeightUnit;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  timeZone?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  orderPrefix?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  orderSuffix?: string;

  // READ-ONLY fields
  slug?: string;
  type?: StoreType;
  currency?: StoreCurrency;
}
