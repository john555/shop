import {
  ArgsType,
  Field,
  ID,
  InputType,
} from '@nestjs/graphql';
import { Language } from '@prisma/client';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsBoolean,
  MinLength,
  IsEnum,
} from 'class-validator';

@ArgsType()
export class CustomerGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@InputType()
export class CustomerCreateInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(1, { message: 'First name is required' })
  @IsOptional()
  firstName!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @MinLength(1, { message: 'Last name is required' })
  @IsOptional()
  lastName!: string | null;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsEmail({}, { message: 'Invalid email address' })
  email!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  marketingEmails?: boolean;

  @Field(() => Boolean, { defaultValue: false })
  @IsBoolean()
  @IsOptional()
  marketingSMS?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field(() => Language, { defaultValue: Language.EN })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  storeId!: string;
}

@InputType()
export class CustomerUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'First name is required' })
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @MinLength(1, { message: 'Last name is required' })
  lastName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address' })
  email?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  marketingEmails?: boolean;

  @Field(() => Boolean, { nullable: true })
  @IsBoolean()
  @IsOptional()
  marketingSMS?: boolean;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field(() => Language, { defaultValue: Language.EN })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;
}
