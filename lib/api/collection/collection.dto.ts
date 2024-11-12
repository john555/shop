import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength, Matches } from 'class-validator';

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

  // Slug is read-only after creation
  slug?: never;
}