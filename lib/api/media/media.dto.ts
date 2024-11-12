import { InputType, Field, Int, ArgsType, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';
import { MediaType, MediaOwnerType } from '@prisma/client';

@ArgsType()
export class MediaGetArgs {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;
}

@ArgsType()
export class GetMediaByOwnerArgs {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @Field(() => MediaOwnerType)
  @IsEnum(MediaOwnerType)
  @IsNotEmpty()
  ownerType: MediaOwnerType;
}

@InputType()
export class MediaCreateInput {
  @Field(() => MediaType)
  @IsEnum(MediaType)
  @IsNotEmpty()
  type: MediaType;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  @IsUrl()
  url: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  alt?: string;

  @Field(() => Int)
  @IsInt()
  @Min(0)
  position: number;

  @Field(() => MediaOwnerType)
  @IsEnum(MediaOwnerType)
  @IsNotEmpty()
  ownerType: MediaOwnerType;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  // Optional metadata fields
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fileName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  fileSize?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  width?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  height?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  duration?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  modelFormat?: string;
}

@InputType()
export class MediaUpdateInput {
  @Field(() => ID)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => MediaType, { nullable: true })
  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @IsUrl()
  url?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  alt?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @Min(0)
  @IsOptional()
  position?: number;

  // Optional metadata fields
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fileName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  mimeType?: string;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  fileSize?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  width?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  height?: number;

  @Field(() => Int, { nullable: true })
  @IsInt()
  @IsOptional()
  duration?: number;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  modelFormat?: string;
}
