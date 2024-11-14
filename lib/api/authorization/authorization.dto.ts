import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class AuthorizationCreateInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  id?: string;
}

@InputType()
export class AuthorizationUpdateInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
