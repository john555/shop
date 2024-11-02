import { ArgsType, Field, ID, InputType, registerEnumType } from '@nestjs/graphql';
import { StoreCurrency, StoreType } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PaginationArgs } from '../pagination/pagination.args';

registerEnumType(StoreType, {
  name: 'StoreType',
  description: 'The type of store',
});

registerEnumType(StoreCurrency, {
  name: 'StoreCurrency',
  description: 'The currency of store',
})

@InputType()
export class StoreCreateInput {
  @Field({ description: 'Email of the Store' })
  @IsNotEmpty()
  name!: string;

  @Field({ description: 'Slug of the Store' })
  @IsNotEmpty()
  @IsString()
  slug: string;

  @Field(() => String, {
    description: 'Description of the Store',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description: string;

  @Field({ description: 'Contact email of the Store', nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => StoreType, { description: 'Type of the Store' })
  @IsNotEmpty()
  type: StoreType;

  @Field(() => StoreCurrency, { description: 'Currency of the Store' })
  @IsNotEmpty()
  currency: StoreCurrency;
}

@InputType()
export class StoreUpdateInput {
  @Field(() => ID, { description: 'ID of the Store' })
  @IsString()
  @IsNotEmpty()
  id!: string;

  @Field({ description: 'Email of the Store', nullable: true })
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @Field({ description: 'Slug of the Store', nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  slug?: string;

  @Field(() => String, {
    description: 'Description of the Store',
    nullable: true,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @Field({ description: 'Contact email of the Store', nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  email?: string;

  @Field(() => StoreType, { description: 'Type of the Store', nullable: true })
  @IsNotEmpty()
  @IsOptional()
  type?: StoreType;
}

@ArgsType()
export class StoreGetArgs {
  @Field(() => ID, { description: 'ID of the Store' })
  @IsString()
  @IsNotEmpty()
  id!: string;
}

@ArgsType()
export class GetMyStoresArgs extends PaginationArgs {
  @Field(() => ID, { description: 'ID of the Store' })
  @IsString()
  @IsNotEmpty()
  ownerId: string;
}