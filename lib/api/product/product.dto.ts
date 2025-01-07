import { Field, InputType, Float, Int, ArgsType } from '@nestjs/graphql';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  ArrayMinSize,
  Min,
  MaxLength,
  MinLength,
} from 'class-validator';
import { PaginationArgs } from '@/common/backend/pagination/pagination.args';

@ArgsType()
export class GetProductArgs {
  @Field(() => String)
  @IsString()
  idOrSlug: string;
}


@ArgsType()
export class GetProductsArgs {
  @Field(() => String)
  @IsString()
  storeIdOrSlug: string;
}

@InputType()
export class ProductOptionInput {
  @Field(() => String)
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  values: string[];
}

@InputType()
export class ProductVariantInput {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  id?: string;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  optionCombination: string[];

  @Field(() => Float)
  @IsNumber()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @Field(() => Int, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  available?: number;
}

@InputType()
export class ProductFiltersInput extends PaginationArgs {
  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  searchQuery?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  inStock?: boolean;
}
