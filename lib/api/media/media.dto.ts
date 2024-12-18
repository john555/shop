import { InputType, Field, Int, ArgsType, ID } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  IsUrl,
  Min,
  IsInt,
} from 'class-validator';
import { MediaType, MediaOwnerType, MediaPurpose } from '@prisma/client';
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts';

@InputType()
export class MediaSearchInput {
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

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  storeId: string;

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

  @Field(() => MediaPurpose, { nullable: true })
  @IsEnum(MediaPurpose)
  @IsOptional()
  purpose?: MediaPurpose;
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

@InputType()
export class MediaUploadInput {
  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  alt?: string;

  @Field(() => MediaOwnerType)
  @IsEnum(MediaOwnerType)
  @IsNotEmpty()
  ownerType: MediaOwnerType;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  ownerId: string;

  @Field(() => String)
  @IsString()
  @IsNotEmpty()
  storeId: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  path?: string;

  @Field(() => MediaPurpose, { nullable: true })
  @IsEnum(MediaPurpose)
  @IsOptional()
  purpose?: MediaPurpose;

  // This will be populated from the file upload
  @Field(() => GraphQLUpload)
  file: Promise<FileUpload>;
}
