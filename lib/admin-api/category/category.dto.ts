import { Field, InputType, ArgsType } from '@nestjs/graphql';
import { StoreType } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsEnum,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';

@ArgsType()
export class CategoryGetArgs {
  @Field(() => String)
  @IsString()
  id: string;
}

@InputType()
export class CategoryCreateInput {
  @Field(() => String)
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name: string;

  @Field(() => String)
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  @MaxLength(100)
  slug: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;

  @Field(() => StoreType)
  @IsEnum(StoreType)
  storeType: StoreType;
}

@InputType()
export class CategoryUpdateInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  @MaxLength(100)
  slug?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  parentId?: string;
}

@ArgsType()
export class GetCategoriesByStoreTypeArgs {
  @Field(() => StoreType)
  @IsEnum(StoreType)
  storeType: StoreType;
}
