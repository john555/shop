import { Field, InputType, Float, Int, ArgsType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  Min,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { ProductStatus, SalesChannel } from '@prisma/client';
import { PaginationArgs } from '@/lib/common/backend/pagination/pagination.args';

@ArgsType()
export class ProductGetArgs {
  @Field(() => String)
  @IsString()
  id: string;
}

@ArgsType()
export class ProductGetBySlugArgs {
  @Field(() => String)
  @IsString()
  slug: string;

  @Field(() => String)
  @IsString()
  storeId: string;
}

@ArgsType()
export class GetMyStoreProductsArgs {
  @Field(() => String)
  @IsString()
  storeId: string;
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
  @Field(() => [ProductStatus], { nullable: true })
  @IsOptional()
  @IsEnum(ProductStatus, { each: true })
  status?: ProductStatus[];

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

@InputType()
export class ProductCreateInput {
  @Field(() => String)
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  @MaxLength(100)
  slug?: string;

  @Field(() => ProductStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  seoDescription?: string;

  // Default variant fields
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

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @Field(() => [SalesChannel], { nullable: true })
  @IsOptional()
  @IsEnum(SalesChannel, { each: true })
  salesChannels?: SalesChannel[];

  @Field(() => String)
  @IsString()
  storeId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collectionIds?: string[];

  @Field(() => [ProductOptionInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionInput)
  options?: ProductOptionInput[];

  @Field(() => [ProductVariantInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInput)
  variants?: ProductVariantInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaIds?: string[];
}

@InputType()
export class ProductUpdateInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  @MaxLength(100)
  slug?: string;

  @Field(() => ProductStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  seoDescription?: string;

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;

  @Field(() => [SalesChannel], { nullable: true })
  @IsOptional()
  @IsEnum(SalesChannel, { each: true })
  salesChannels?: SalesChannel[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  collectionIds?: string[];

  // Default variant fields
  @Field(() => Float, {
    nullable: true,
    description: 'Price for the default variant',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @Field(() => Float, {
    nullable: true,
    description: 'Compare at price for the default variant',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number | null;

  @Field(() => String, {
    nullable: true,
    description: 'SKU for the default variant',
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sku?: string;

  @Field(() => Int, {
    nullable: true,
    description: 'Available quantity for the default variant',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  available?: number;

  // Options and variants
  @Field(() => [ProductOptionInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductOptionInput)
  options?: ProductOptionInput[];

  @Field(() => [ProductVariantInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ProductVariantInput)
  variants?: ProductVariantInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  mediaIds?: string[];
}

@InputType()
export class BulkProductUpdateData {
  @Field(() => ProductStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  categoryId?: string | null;

  @Field(() => [SalesChannel], { nullable: true })
  @IsOptional()
  @IsEnum(SalesChannel, { each: true })
  salesChannels?: SalesChannel[];

  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  @IsBoolean()
  trackInventory?: boolean;
}

@InputType()
export class BulkProductUpdateInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  productIds: string[];

  @Field(() => String)
  @IsString()
  storeId: string;

  @Field(() => BulkProductUpdateData)
  @ValidateNested()
  @Type(() => BulkProductUpdateData)
  data: BulkProductUpdateData;
}

@InputType()
export class BulkProductDeleteInput {
  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  productIds: string[];

  @Field(() => String)
  @IsString()
  storeId: string;
}
