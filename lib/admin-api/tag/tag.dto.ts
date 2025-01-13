import { ArgsType, Field, ID, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Matches, MinLength } from 'class-validator';

@ArgsType()
export class TagGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@InputType()
export class TagCreateInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name!: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @Matches(/^[a-z0-9-]+$/, {
    message: 'Slug can only contain lowercase letters, numbers, and hyphens',
  })
  slug!: string;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  storeId!: string;
}

@InputType()
export class TagUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(2)
  name?: string;
}
