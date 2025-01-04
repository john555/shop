import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class TokenPayload {
  id!: string;
  refreshToken?: string;
}

@InputType()
export class AuthSigninInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password!: string;
}

@InputType()
export class AuthSignupInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email!: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password!: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;
}

@InputType()
export class AuthSignoutInput {}
