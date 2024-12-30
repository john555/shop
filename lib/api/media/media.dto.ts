import { InputType, Field, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsInt,
  Min,
  IsArray,
  ArrayMinSize,
  ValidateNested,
} from 'class-validator';
import { MediaType, MediaOwnerType, MediaPurpose } from '@prisma/client';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';
import { PaginationArgs } from '@/api/pagination/pagination.args';
import { Type } from 'class-transformer';

@InputType()
export class MediaSearchInput extends PaginationArgs {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  id?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @Field(() => MediaOwnerType, { nullable: true })
  @IsEnum(MediaOwnerType)
  @IsOptional()
  ownerType?: MediaOwnerType;

  @Field(() => MediaType, { nullable: true })
  @IsEnum(MediaType)
  @IsOptional()
  type?: MediaType;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  storeId?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  search?: string;
}

@InputType()
export class MediaCreateInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  alt?: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @Field(() => MediaPurpose)
  @IsEnum(MediaPurpose)
  @IsOptional()
  purpose: MediaPurpose;

  @Field(() => [MediaOwnerInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaOwnerInput)
  owners?: MediaOwnerInput[];

  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}

@InputType()
export class MediaUpdateInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  id: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  alt?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  fileName?: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  thumbnail?: string;

  @Field(() => [MediaOwnerInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaOwnerInput)
  addOwners?: MediaOwnerInput[];

  @Field(() => [MediaOwnerInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => MediaOwnerInput)
  removeOwners?: MediaOwnerInput[];
}

@InputType()
export class MediaOwnerInput {
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
export class MediaReorderInput {
  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @Field(() => MediaOwnerType)
  @IsEnum(MediaOwnerType)
  @IsNotEmpty()
  ownerType: MediaOwnerType;

  @Field(() => [String])
  @IsArray()
  @IsString({ each: true })
  @ArrayMinSize(1)
  mediaIds: string[];
}
