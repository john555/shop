import { Field, InputType } from '@nestjs/graphql';
import { Language, Theme } from '@prisma/client';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

@InputType()
export class UserCreateInput {
  @Field({ description: 'Email of the User' })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Field({ nullable: true, description: 'Password of the User' })
  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @Field({ nullable: true, description: 'First name of the User' })
  @IsNotEmpty()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true, description: 'Last name of the User' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true, description: 'URL of the User image' })
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  imageUrl?: string;

  @Field(() => Language, {
    nullable: true,
    description: 'Preferred language for the user interface',
  })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @Field(() => Theme, {
    nullable: true,
    description: 'Preferred theme for the user interface',
  })
  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;

  @Field({
    nullable: true,
    description: 'Preferred timezone (e.g., "Africa/Nairobi")',
  })
  @IsString()
  @IsOptional()
  timeZone?: string;
}

@InputType()
export class UserUpdateInput {
  @Field({ description: 'ID of the User' })
  @IsString()
  id!: string;

  @Field({ nullable: true, description: 'First name of the User' })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true, description: 'Last name of the User' })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true, description: 'URL of the User image' })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Field(() => Language, {
    nullable: true,
    description: 'Preferred language for the user interface',
  })
  @IsEnum(Language)
  @IsOptional()
  language?: Language;

  @Field(() => Theme, {
    nullable: true,
    description: 'Preferred theme for the user interface',
  })
  @IsEnum(Theme)
  @IsOptional()
  theme?: Theme;

  @Field({
    nullable: true,
    description: 'Preferred timezone (e.g., "Africa/Nairobi")',
  })
  @IsString()
  @IsOptional()
  timeZone?: string;
}

@InputType()
export class UserPasswordUpdateInput {
  @Field({ description: 'ID of the User' })
  @IsString()
  id!: string;

  @Field({ nullable: true, description: 'Old password of the User' })
  @IsString()
  @MinLength(8)
  oldPassword: string;

  @Field({ nullable: true, description: 'New password of the User' })
  @IsString()
  @MinLength(8)
  newPassword: string;
}
