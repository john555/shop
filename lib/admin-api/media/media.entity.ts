// media.entity.ts
import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import {
  Media as MediaModel,
  MediaType,
  MediaOwnerType,
  MediaPurpose,
  MediaOwnership as MediaOwnershipModel,
} from '@prisma/client';

import { Category } from '@/lib/admin-api/category/category.entity';
import { Collection } from '@/lib/admin-api/collection/collection.entity';
import { Store } from '@/lib/admin-api/store/store.entity';
import { User } from '../../common/backend/user/user.entity';

registerEnumType(MediaType, {
  name: 'MediaType',
  description: 'Type of media (PHOTO, VIDEO, MODEL_3D)',
});

registerEnumType(MediaOwnerType, {
  name: 'MediaOwnerType',
  description: 'Type of entity that owns the media',
});

registerEnumType(MediaPurpose, {
  name: 'MediaPurpose',
  description: 'Purpose of the media',
});

@ObjectType()
export class MediaOwnership implements Partial<MediaOwnershipModel> {
  @Field(() => ID)
  id: string;

  @Field(() => String)
  ownerId: string;

  @Field(() => MediaOwnerType)
  ownerType: MediaOwnerType;

  @Field(() => Int)
  position: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class MediaUsage {
  @Field(() => MediaOwnerType)
  ownerType: MediaOwnerType;

  @Field(() => String)
  ownerId: string;

  @Field(() => String)
  ownerTitle: string;
}

@ObjectType({ description: 'Media model' })
export class Media implements Omit<MediaModel, 'owners'> {
  @Field(() => ID)
  id: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  alt: string | null;

  @Field(() => String, { nullable: true })
  fileName: string | null;

  @Field(() => String, { nullable: true })
  mimeType: string | null;

  @Field(() => Int, { nullable: true })
  fileSize: number | null;

  @Field(() => Int, { nullable: true })
  width: number | null;

  @Field(() => Int, { nullable: true })
  height: number | null;

  @Field(() => Int, { nullable: true })
  duration: number | null;

  @Field(() => String, { nullable: true })
  thumbnail: string | null;

  @Field(() => String, { nullable: true })
  modelFormat: string | null;

  @Field(() => String, { nullable: true })
  blurHash: string | null;

  @Field(() => String, { nullable: true })
  placeholder: string | null;

  @Field(() => Boolean)
  isArchived: boolean;

  @Field(() => MediaPurpose)
  purpose: MediaPurpose;

  @Field(() => String, { nullable: true })
  storeId: string | null;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field(() => Date, { nullable: true })
  archivedAt: Date | null;

  // Resolved owner fields
  @Field(() => [MediaOwnership, { nullable: true }])
  owners?: MediaOwnership[];

  @Field(() => Category, { nullable: true })
  category?: Category;

  @Field(() => Collection, { nullable: true })
  collection?: Collection;

  @Field(() => Store, { nullable: true })
  storeProfile?: Store;

  @Field(() => User, { nullable: true })
  userProfile?: User;

  @Field(() => [MediaUsage])
  usedIn?: MediaUsage[];
}
