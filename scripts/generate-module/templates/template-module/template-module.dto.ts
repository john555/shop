import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@InputType()
export class TemplateModuleCreateInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  @IsOptional()
  id?: string;
}

@InputType()
export class TemplateModuleUpdateInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  id: string;
}
