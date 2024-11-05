import { ArgsType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { 
  StoreCurrency, 
  StoreType, 
  CurrencyPosition, 
  UnitSystem, 
  WeightUnit 
} from '@prisma/client';
import { 
  IsNotEmpty, 
  IsOptional, 
  IsString, 
  IsBoolean, 
  IsEnum, 
  MaxLength,
  IsUrl,
  IsPhoneNumber,
  IsTimeZone
} from 'class-validator';
import { PaginationArgs } from '../pagination/pagination.args';

// Register all enums
registerEnumType(StoreType, {
  name: 'StoreType',
  description: 'The type of store',
});

registerEnumType(StoreCurrency, {
  name: 'StoreCurrency',
  description: 'The currency of store',
});

registerEnumType(CurrencyPosition, {
  name: 'CurrencyPosition',
  description: 'Position of currency symbol',
});

registerEnumType(UnitSystem, {
  name: 'UnitSystem',
  description: 'Measurement system used by the store',
});

registerEnumType(WeightUnit, {
  name: 'WeightUnit',
  description: 'Weight unit used by the store',
});

@InputType()
export class StoreCreateInput {
  @Field({ description: 'Name of the Store' })
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Field({ description: 'Slug of the Store' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  // Contact Information
  @Field(() => String, { description: 'Phone number of the Store', nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Field(() => String, { description: 'WhatsApp business number', nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  whatsApp?: string;

  // Social Media
  @Field(() => String, { description: 'Facebook page username/handle', nullable: true })
  @IsString()
  @IsOptional()
  facebook?: string;

  @Field(() => String, { description: 'Instagram handle (without @)', nullable: true })
  @IsString()
  @IsOptional()
  instagram?: string;

  @Field(() => StoreType, { description: 'Type of the Store' })
  @IsNotEmpty()
  @IsEnum(StoreType)
  type: StoreType;

  // Currency Settings
  @Field(() => StoreCurrency, { description: 'Currency of the Store' })
  @IsNotEmpty()
  @IsEnum(StoreCurrency)
  currency: StoreCurrency;

  @Field(() => String, { 
    description: 'Custom currency symbol. If not provided, defaults will be used based on currency.',
    nullable: true 
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currencySymbol?: string | null;

  @Field(() => CurrencyPosition, { 
    description: 'Position of currency symbol',
    nullable: true,
    defaultValue: CurrencyPosition.BEFORE_AMOUNT
  })
  @IsEnum(CurrencyPosition)
  @IsOptional()
  currencyPosition?: CurrencyPosition;

  @Field(() => Boolean, { 
    description: 'Whether to show currency code',
    nullable: true,
    defaultValue: false
  })
  @IsBoolean()
  @IsOptional()
  showCurrencyCode?: boolean;

  // Measurement Settings
  @Field(() => UnitSystem, { 
    description: 'Unit system for measurements',
    nullable: true,
    defaultValue: UnitSystem.METRIC
  })
  @IsEnum(UnitSystem)
  @IsOptional()
  unitSystem?: UnitSystem;

  @Field(() => WeightUnit, { 
    description: 'Weight unit for products',
    nullable: true,
    defaultValue: WeightUnit.KILOGRAM
  })
  @IsEnum(WeightUnit)
  @IsOptional()
  weightUnit?: WeightUnit;

  @Field(() => String, {
    description: 'Timezone for the store',
    nullable: true,
    defaultValue: 'Africa/Nairobi'
  })
  @IsTimeZone()
  @IsOptional()
  timeZone?: string;

  // Order Configuration
  @Field(() => String, {
    description: 'Prefix for order numbers',
    nullable: true,
    defaultValue: '#'
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  orderPrefix?: string;

  @Field(() => String, {
    description: 'Suffix for order numbers',
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  orderSuffix?: string;
}

@InputType()
export class StoreUpdateInput {
  @Field(() => ID, { description: 'ID of the Store' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field({ description: 'Name of the Store', nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field({ description: 'Slug of the Store', nullable: true })
  @IsString()
  @IsOptional()
  slug?: string;

  // Contact Information
  @Field(() => String, { description: 'Phone number of the Store', nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  phone?: string;

  @Field(() => String, { description: 'WhatsApp business number', nullable: true })
  @IsPhoneNumber()
  @IsOptional()
  whatsApp?: string;

  // Social Media
  @Field(() => String, { description: 'Facebook page username/handle', nullable: true })
  @IsString()
  @IsOptional()
  facebook?: string;

  @Field(() => String, { description: 'Instagram handle (without @)', nullable: true })
  @IsString()
  @IsOptional()
  instagram?: string;

  @Field(() => String, { 
    description: 'Custom currency symbol. Set to null to use currency defaults.',
    nullable: true 
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  currencySymbol?: string | null;

  @Field(() => CurrencyPosition, { 
    description: 'Position of currency symbol', 
    nullable: true 
  })
  @IsEnum(CurrencyPosition)
  @IsOptional()
  currencyPosition?: CurrencyPosition;

  @Field(() => Boolean, { 
    description: 'Whether to show currency code', 
    nullable: true 
  })
  @IsBoolean()
  @IsOptional()
  showCurrencyCode?: boolean;

  // Measurement Settings
  @Field(() => UnitSystem, { 
    description: 'Unit system for measurements',
    nullable: true
  })
  @IsEnum(UnitSystem)
  @IsOptional()
  unitSystem?: UnitSystem;

  @Field(() => WeightUnit, { 
    description: 'Weight unit for products',
    nullable: true
  })
  @IsEnum(WeightUnit)
  @IsOptional()
  weightUnit?: WeightUnit;

  @Field(() => String, {
    description: 'Timezone for the store',
    nullable: true
  })
  @IsTimeZone()
  @IsOptional()
  timeZone?: string;

  // Order Configuration
  @Field(() => String, {
    description: 'Prefix for order numbers',
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  orderPrefix?: string;

  @Field(() => String, {
    description: 'Suffix for order numbers',
    nullable: true
  })
  @IsString()
  @IsOptional()
  @MaxLength(10)
  orderSuffix?: string;
}

@ArgsType()
export class StoreGetArgs {
  @Field(() => ID, { description: 'ID of the Store' })
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ArgsType()
export class GetMyStoresArgs extends PaginationArgs {
  @Field(() => ID, { description: 'ID of the Store' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}