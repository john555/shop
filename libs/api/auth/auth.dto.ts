import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

export class TokenPayload {
  id: string;
  refreshToken?: string;
}

@InputType()
export class AuthSigninInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  email: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  password: string;
}

@InputType()
export class AuthSignoutInput {}
