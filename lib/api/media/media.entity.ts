import { ObjectType, Field, ID, Int, registerEnumType } from '@nestjs/graphql';
import { Media as MediaModel, MediaType, MediaOwnerType } from '@prisma/client';
import { Product } from '../product/entities/product.entity';
import { ProductVariant } from '../product/entities/product-variant.entity';
import { Category } from '../category/category.entity';
// import { Collection } from '../collection/collection.entity';
import { Store } from '../store/store.entity';
import { User } from '../user/user.entity';
// import { PropertyListing } from '../property/property-listing.entity';
// import { VehicleListing } from '../vehicle/vehicle-listing.entity';

registerEnumType(MediaType, {
  name: 'MediaType',
  description: 'Type of media (PHOTO, VIDEO, MODEL_3D)',
});

registerEnumType(MediaOwnerType, {
  name: 'MediaOwnerType',
  description: 'Type of entity that owns the media',
});

@ObjectType({ description: 'Media model' })
export class Media implements Omit<MediaModel, 'owner'> {
  @Field(() => ID)
  id: string;

  @Field(() => MediaType)
  type: MediaType;

  @Field(() => String)
  url: string;

  @Field(() => String, { nullable: true })
  alt: string | null;

  @Field(() => Int)
  position: number;

  // File metadata
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

  // Video specific
  @Field(() => Int, { nullable: true })
  duration: number | null;

  @Field(() => String, { nullable: true })
  thumbnail: string | null;

  // 3D model specific
  @Field(() => String, { nullable: true })
  modelFormat: string | null;

  // Polymorphic relation
  @Field(() => MediaOwnerType)
  ownerType: MediaOwnerType;

  @Field(() => String)
  ownerId: string;

  // Resolved owner fields
  @Field(() => Product, { nullable: true })
  product?: Product;

  @Field(() => ProductVariant, { nullable: true })
  productVariant?: ProductVariant;

  @Field(() => Category, { nullable: true })
  category?: Category;

  // @Field(() => Collection, { nullable: true })
  // collection?: Collection;

  @Field(() => Store, { nullable: true })
  store?: Store;

  @Field(() => User, { nullable: true })
  userProfile?: User;

  // @Field(() => PropertyListing, { nullable: true })
  // property?: PropertyListing;

  // @Field(() => VehicleListing, { nullable: true })
  // vehicle?: VehicleListing;

  // Timestamps
  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
