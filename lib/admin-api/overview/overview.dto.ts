import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class OverviewCreateInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  id?: string;
}

@InputType()
export class OverviewUpdateInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
