import { InputType, Field, ID, Float, Int, ArgsType } from '@nestjs/graphql';
import { 
  ProductStatus, 
  SalesChannel 
} from '@prisma/client';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
  Min,
  MaxLength,
  MinLength,
  Matches,
  ArrayMinSize,
  ValidateNested,
  IsUUID,
} from 'class-validator';
import { Type } from 'class-transformer';

@ArgsType()
export class ProductGetArgs {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id!: string;
}

@ArgsType()
export class GetProductBySlugArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug!: string;
}

@InputType()
export class ProductCreateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(200)
  title: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @Field(() => ProductStatus)
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus = ProductStatus.DRAFT;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  seoDescription?: string;

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  @Min(0)
  available?: number = 0;

  @Field(() => Boolean)
  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean = false;

  @Field(() => [SalesChannel])
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SalesChannel, { each: true })
  salesChannels: SalesChannel[];

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  collectionIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  tagIds?: string[];
}

@InputType()
export class ProductUpdateInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(3)
  @MaxLength(200)
  title?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(5000)
  description?: string;

  @Field(() => ProductStatus, { nullable: true })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(1000)
  seoDescription?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  price?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @Field(() => Int, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  available?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  trackInventory?: boolean;

  @Field(() => [SalesChannel], { nullable: true })
  @IsArray()
  @ArrayMinSize(1)
  @IsEnum(SalesChannel, { each: true })
  @IsOptional()
  salesChannels?: SalesChannel[];

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  collectionIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  tagIds?: string[];
}

@InputType()
export class ProductFiltersInput {
  @Field(() => [ProductStatus], { nullable: true })
  @IsArray()
  @IsEnum(ProductStatus, { each: true })
  @IsOptional()
  status?: ProductStatus[];

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  collectionId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  searchQuery?: string;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  minPrice?: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  maxPrice?: number;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  inStock?: boolean;

  @Field(() => [SalesChannel], { nullable: true })
  @IsArray()
  @IsEnum(SalesChannel, { each: true })
  @IsOptional()
  salesChannels?: SalesChannel[];
}

@InputType()
export class BulkProductUpdateData {
  @Field(() => ProductStatus, { nullable: true })
  @IsEnum(ProductStatus)
  @IsOptional()
  status?: ProductStatus;

  @Field(() => ID, { nullable: true })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  collectionIds?: string[];

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsUUID("all", { each: true })
  @IsOptional()
  tagIds?: string[];

  @Field(() => [SalesChannel], { nullable: true })
  @IsArray()
  @IsEnum(SalesChannel, { each: true })
  @IsOptional()
  salesChannels?: SalesChannel[];
}

@InputType()
export class BulkProductUpdateInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("all", { each: true })
  productIds: string[];

  @Field(() => BulkProductUpdateData)
  @ValidateNested()
  @Type(() => BulkProductUpdateData)
  data: BulkProductUpdateData;
}

@InputType()
export class BulkProductDeleteInput {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  storeId: string;

  @Field(() => [ID])
  @IsArray()
  @ArrayMinSize(1)
  @IsUUID("all", { each: true })
  productIds: string[];
}

@InputType()
export class ProductOptionInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @MinLength(1)
  @MaxLength(50)
  name: string;

  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  @MaxLength(50, { each: true })
  values: string[];
}

@InputType()
export class ProductVariantInput {
  @Field(() => [String])
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  optionCombination: string[];

  @Field(() => Float)
  @IsNumber()
  @IsNotEmpty()
  @Min(0)
  price: number;

  @Field(() => Float, { nullable: true })
  @IsNumber()
  @IsOptional()
  @Min(0)
  compareAtPrice?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  sku?: string;

  @Field(() => Int)
  @IsNumber()
  @IsOptional()
  @Min(0)
  available?: number = 0;
}
