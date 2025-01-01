import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, MaxLength, Matches, IsBoolean, IsArray, ValidateNested } from 'class-validator';

@ArgsType()
export class CollectionGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@InputType()
export class CollectionCreateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  name!: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  storeId!: string;

  @Field(() => Boolean, { defaultValue: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsOptional()
  productIds?: string[];
}

@InputType()
export class CollectionUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @Field(() => [ID], { nullable: true })
  @IsArray()
  @IsOptional()
  productIds?: string[];

  // Slug is read-only after creation
  slug?: never;
}
@InputType()
export class BulkCollectionDeleteInput {
  @Field(() => [String])
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  collectionIds!: string[];

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  storeId!: string;
}

@InputType()
export class CollectionBulkUpdateData {
  @Field(() => Boolean, { nullable: true })
  @IsOptional()
  isActive?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;
}

@InputType()
export class BulkCollectionUpdateInput {
  @Field(() => [String])
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  collectionIds!: string[];

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  storeId!: string;

  @Field(() => CollectionBulkUpdateData)
  @ValidateNested()
  @Type(() => CollectionBulkUpdateData)
  data!: CollectionBulkUpdateData;
}
