import { Field, InputType, Float, Int, ArgsType } from '@nestjs/graphql';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
  ValidateNested,
  ArrayMinSize,
  Min,
} from 'class-validator';
import { PaginationArgs } from '../pagination/pagination.args';
import { OrderStatus, PaymentStatus, ShipmentStatus } from '@prisma/client';

@InputType()
export class OrderItemInput {
  @Field(() => String)
  @IsString()
  productId: string;

  @Field(() => String)
  @IsString()
  variantId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}

@InputType()
export class OrderCreateInput {
  @Field(() => String)
  @IsString()
  storeId: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerId?: string;

  @Field(() => [OrderItemInput])
  @IsArray()
  @ValidateNested({ each: true })
  @ArrayMinSize(1)
  @Type(() => OrderItemInput)
  items: OrderItemInput[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerNotes?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  privateNotes?: string;
}

@ArgsType()
export class OrderGetArgs {
  @Field(() => String)
  @IsString()
  id: string;
}

@InputType()
export class OrderFiltersInput extends PaginationArgs {
  @Field(() => [OrderStatus], { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus, { each: true })
  status?: OrderStatus[];

  @Field(() => [PaymentStatus], { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus, { each: true })
  paymentStatus?: PaymentStatus[];

  @Field(() => [ShipmentStatus], { nullable: true })
  @IsOptional()
  @IsEnum(ShipmentStatus, { each: true })
  shipmentStatus?: ShipmentStatus[];

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  searchQuery?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerId?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  startDate?: Date;

  @Field(() => Date, { nullable: true })
  @IsOptional()
  @Type(() => Date)
  endDate?: Date;
}

@ArgsType()
export class GetMyStoreOrdersArgs {
  @Field(() => String)
  @IsString()
  storeId: string;
}

@InputType()
export class OrderItemUpdateInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}

@InputType()
export class OrderItemCreateInput {
  @Field(() => String)
  @IsString()
  productId: string;

  @Field(() => String)
  @IsString()
  variantId: string;

  @Field(() => Int)
  @IsNumber()
  @Min(1)
  quantity: number;
}

@InputType()
export class OrderUpdateInput {
  @Field(() => String)
  @IsString()
  id: string;

  @Field(() => OrderStatus, { nullable: true })
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @Field(() => PaymentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(PaymentStatus)
  paymentStatus?: PaymentStatus;

  @Field(() => ShipmentStatus, { nullable: true })
  @IsOptional()
  @IsEnum(ShipmentStatus)
  shipmentStatus?: ShipmentStatus;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerId?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  customerNotes?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  privateNotes?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @Field(() => [OrderItemUpdateInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemUpdateInput)
  updateItems?: OrderItemUpdateInput[];

  @Field(() => [String], { nullable: true })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  removeItems?: string[];

  @Field(() => [OrderItemCreateInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => OrderItemCreateInput)
  addItems?: OrderItemCreateInput[];
}
