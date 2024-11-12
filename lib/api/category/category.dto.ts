import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Matches,
  MinLength,
} from 'class-validator';

@ArgsType()
export class CategoryGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ArgsType()
export class GetCategoryBySlugArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  slug!: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  storeId!: string;
}

@InputType()
export class CategoryCreateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
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

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  parentId?: string;
}

@InputType()
export class CategoryUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => ID, { nullable: true })
  @IsString()
  @IsOptional()
  parentId?: string;
}
