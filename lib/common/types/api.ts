import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

/** Address information */
export type Address = {
  __typename?: 'Address';
  city?: Maybe<Scalars['String']['output']>;
  country: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  line1?: Maybe<Scalars['String']['output']>;
  line2?: Maybe<Scalars['String']['output']>;
  state?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type AddressInput = {
  city?: InputMaybe<Scalars['String']['input']>;
  country: Scalars['String']['input'];
  line1?: InputMaybe<Scalars['String']['input']>;
  line2?: InputMaybe<Scalars['String']['input']>;
  state?: InputMaybe<Scalars['String']['input']>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

/** Address association with an owner entity */
export type AddressOnOwner = {
  __typename?: 'AddressOnOwner';
  address?: Maybe<Address>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  ownerId: Scalars['String']['output'];
  ownerType: AddressOwnerType;
  type: AddressType;
  updatedAt: Scalars['DateTime']['output'];
};

export type AddressOnOwnerCreateInput = {
  address: AddressInput;
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  ownerId: Scalars['String']['input'];
  ownerType: AddressOwnerType;
  type: AddressType;
};

export type AddressOnOwnerUpdateInput = {
  address?: InputMaybe<AddressInput>;
  id: Scalars['ID']['input'];
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<AddressType>;
};

/** Type of entity that owns the address (STORE, CUSTOMER, ORDER, etc.) */
export enum AddressOwnerType {
  Customer = 'CUSTOMER',
  Order = 'ORDER',
  Property = 'PROPERTY',
  Store = 'STORE',
  Vehicle = 'VEHICLE'
}

/** Type of address (BILLING, SHIPPING, PICKUP, etc.) */
export enum AddressType {
  Billing = 'BILLING',
  Pickup = 'PICKUP',
  Registered = 'REGISTERED',
  Shipping = 'SHIPPING',
  Warehouse = 'WAREHOUSE'
}

/** AuthSignin */
export type AuthSignin = {
  __typename?: 'AuthSignin';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type AuthSigninInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

/** AuthSignout */
export type AuthSignout = {
  __typename?: 'AuthSignout';
  success: Scalars['Boolean']['output'];
};

/** AuthSignup */
export type AuthSignup = {
  __typename?: 'AuthSignup';
  accessToken: Scalars['String']['output'];
  refreshToken: Scalars['String']['output'];
};

export type AuthSignupInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
};

export type BulkCollectionDeleteInput = {
  collectionIds: Array<Scalars['String']['input']>;
  storeId: Scalars['String']['input'];
};

export type BulkCollectionUpdateInput = {
  collectionIds: Array<Scalars['String']['input']>;
  data: CollectionBulkUpdateData;
  storeId: Scalars['String']['input'];
};

export type BulkProductDeleteInput = {
  productIds: Array<Scalars['String']['input']>;
  storeId: Scalars['String']['input'];
};

export type BulkProductUpdateData = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  salesChannels?: InputMaybe<Array<SalesChannel>>;
  status?: InputMaybe<ProductStatus>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BulkProductUpdateInput = {
  data: BulkProductUpdateData;
  productIds: Array<Scalars['String']['input']>;
  storeId: Scalars['String']['input'];
};

/** Category model */
export type Category = {
  __typename?: 'Category';
  /** Child categories */
  children?: Maybe<Array<Category>>;
  /** When the category was created */
  createdAt: Scalars['DateTime']['output'];
  /** Description of the category */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier of the category */
  id: Scalars['ID']['output'];
  /** Name of the category */
  name: Scalars['String']['output'];
  /** Parent category */
  parent?: Maybe<Category>;
  /** ID of the parent category */
  parentId?: Maybe<Scalars['ID']['output']>;
  /** URL-friendly slug of the category */
  slug: Scalars['String']['output'];
  /** Store this category belongs to */
  store?: Maybe<Store>;
  /** ID of the store this category belongs to */
  storeId: Scalars['ID']['output'];
  /** When the category was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type CategoryCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  parentId?: InputMaybe<Scalars['ID']['input']>;
  slug: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};

export type CategoryUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  parentId?: InputMaybe<Scalars['ID']['input']>;
};

/** Collection model */
export type Collection = {
  __typename?: 'Collection';
  /** When the collection was created */
  createdAt: Scalars['DateTime']['output'];
  /** Collection description */
  description?: Maybe<Scalars['String']['output']>;
  /** Unique identifier */
  id: Scalars['ID']['output'];
  /** Is the collection active */
  isActive: Scalars['Boolean']['output'];
  /** Collection name */
  name: Scalars['String']['output'];
  /** Products in this collection */
  products: Array<Product>;
  /** SEO description */
  seoDescription?: Maybe<Scalars['String']['output']>;
  /** SEO title */
  seoTitle?: Maybe<Scalars['String']['output']>;
  /** URL-friendly slug */
  slug: Scalars['String']['output'];
  /** Store this collection belongs to */
  store: Store;
  /** When the collection was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type CollectionBulkUpdateData = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CollectionCreateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  isActive?: Scalars['Boolean']['input'];
  name: Scalars['String']['input'];
  productIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  seoDescription?: InputMaybe<Scalars['String']['input']>;
  seoTitle?: InputMaybe<Scalars['String']['input']>;
  slug: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};

export type CollectionUpdateInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  productIds?: InputMaybe<Array<Scalars['ID']['input']>>;
  seoDescription?: InputMaybe<Scalars['String']['input']>;
  seoTitle?: InputMaybe<Scalars['String']['input']>;
};

/** Position of currency symbol (BEFORE_AMOUNT, AFTER_AMOUNT) */
export enum CurrencyPosition {
  AfterAmount = 'AFTER_AMOUNT',
  BeforeAmount = 'BEFORE_AMOUNT'
}

/** Customer model */
export type Customer = {
  __typename?: 'Customer';
  billingAddress?: Maybe<AddressOnOwner>;
  /** When the customer was created */
  createdAt: Scalars['DateTime']['output'];
  /** Email address of the customer */
  email: Scalars['String']['output'];
  /** First name of the customer */
  firstName?: Maybe<Scalars['String']['output']>;
  /** Unique identifier of the customer */
  id: Scalars['ID']['output'];
  /** Preferred language of the customer */
  language: Language;
  /** Last name of the customer */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Whether the customer has opted into marketing emails */
  marketingEmails: Scalars['Boolean']['output'];
  /** Whether the customer has opted into marketing SMS */
  marketingSMS: Scalars['Boolean']['output'];
  /** Additional notes about the customer */
  notes?: Maybe<Scalars['String']['output']>;
  /** Phone number of the customer */
  phoneNumber?: Maybe<Scalars['String']['output']>;
  /** ID of the store this customer belongs to */
  storeId: Scalars['String']['output'];
  /** When the customer was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type CustomerCreateInput = {
  email: Scalars['String']['input'];
  firstName?: InputMaybe<Scalars['String']['input']>;
  language?: Language;
  lastName?: InputMaybe<Scalars['String']['input']>;
  marketingEmails?: Scalars['Boolean']['input'];
  marketingSMS?: Scalars['Boolean']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
  storeId: Scalars['ID']['input'];
};

export type CustomerUpdateInput = {
  email?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  language?: Language;
  lastName?: InputMaybe<Scalars['String']['input']>;
  marketingEmails?: InputMaybe<Scalars['Boolean']['input']>;
  marketingSMS?: InputMaybe<Scalars['Boolean']['input']>;
  notes?: InputMaybe<Scalars['String']['input']>;
  phoneNumber?: InputMaybe<Scalars['String']['input']>;
};

/** The language of the customer */
export enum Language {
  Ar = 'AR',
  En = 'EN',
  Fr = 'FR',
  Lg = 'LG',
  Rw = 'RW',
  Sw = 'SW'
}

/** Media model */
export type Media = {
  __typename?: 'Media';
  alt?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  createdAt: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Int']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  modelFormat?: Maybe<Scalars['String']['output']>;
  ownerId: Scalars['String']['output'];
  ownerType: MediaOwnerType;
  position: Scalars['Int']['output'];
  product?: Maybe<Product>;
  productVariant?: Maybe<ProductVariant>;
  store?: Maybe<Store>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: MediaType;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  userProfile?: Maybe<User>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type MediaCreateInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  mimeType?: InputMaybe<Scalars['String']['input']>;
  modelFormat?: InputMaybe<Scalars['String']['input']>;
  ownerId: Scalars['String']['input'];
  ownerType: MediaOwnerType;
  position: Scalars['Int']['input'];
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type: MediaType;
  url: Scalars['String']['input'];
  width?: InputMaybe<Scalars['Int']['input']>;
};

/** Type of entity that owns the media */
export enum MediaOwnerType {
  Category = 'CATEGORY',
  Collection = 'COLLECTION',
  Product = 'PRODUCT',
  ProductVariant = 'PRODUCT_VARIANT',
  Property = 'PROPERTY',
  Store = 'STORE',
  UserProfile = 'USER_PROFILE',
  Vehicle = 'VEHICLE'
}

/** Type of media (PHOTO, VIDEO, MODEL_3D) */
export enum MediaType {
  Model_3D = 'MODEL_3D',
  Photo = 'PHOTO',
  Video = 'VIDEO'
}

export type MediaUpdateInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['Int']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  fileSize?: InputMaybe<Scalars['Int']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  id: Scalars['ID']['input'];
  mimeType?: InputMaybe<Scalars['String']['input']>;
  modelFormat?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<Scalars['Int']['input']>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MediaType>;
  url?: InputMaybe<Scalars['String']['input']>;
  width?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addProductsToCollection: Collection;
  bulkDeleteCollections: Scalars['Int']['output'];
  bulkDeleteProducts: Scalars['Int']['output'];
  bulkUpdateCollections: Scalars['Int']['output'];
  bulkUpdateProducts: Scalars['Int']['output'];
  createAddressOnOwner: AddressOnOwner;
  createCategory: Category;
  createCollection: Collection;
  createCustomer: Customer;
  createMedia: Media;
  createProduct: Product;
  createStore: Store;
  createTag: Tag;
  deleteAddressOnOwner: Scalars['Boolean']['output'];
  deleteCategory: Scalars['Boolean']['output'];
  deleteCollection: Scalars['Boolean']['output'];
  deleteCustomer: Scalars['Boolean']['output'];
  deleteMedia: Scalars['Boolean']['output'];
  deleteProduct: Scalars['Boolean']['output'];
  deleteTag: Scalars['Boolean']['output'];
  /** Refresh auth token */
  refresh: AuthSignin;
  removeProductsFromCollection: Collection;
  reorderMedia: Array<Media>;
  /** Sign in */
  signin: AuthSignin;
  /** Sign out */
  signout: AuthSignout;
  /** Sign up new user */
  signup: AuthSignup;
  updateAddressOnOwner: AddressOnOwner;
  updateCategory: Category;
  updateCollection: Collection;
  updateCustomer: Customer;
  updateMedia: Media;
  updatePassword: User;
  updateProduct: Product;
  updateStore: Store;
  updateTag: Tag;
  updateUser: User;
};


export type MutationAddProductsToCollectionArgs = {
  collectionId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};


export type MutationBulkDeleteCollectionsArgs = {
  input: BulkCollectionDeleteInput;
};


export type MutationBulkDeleteProductsArgs = {
  input: BulkProductDeleteInput;
};


export type MutationBulkUpdateCollectionsArgs = {
  input: BulkCollectionUpdateInput;
};


export type MutationBulkUpdateProductsArgs = {
  input: BulkProductUpdateInput;
};


export type MutationCreateAddressOnOwnerArgs = {
  input: AddressOnOwnerCreateInput;
};


export type MutationCreateCategoryArgs = {
  input: CategoryCreateInput;
};


export type MutationCreateCollectionArgs = {
  input: CollectionCreateInput;
};


export type MutationCreateCustomerArgs = {
  input: CustomerCreateInput;
};


export type MutationCreateMediaArgs = {
  input: MediaCreateInput;
};


export type MutationCreateProductArgs = {
  input: ProductCreateInput;
};


export type MutationCreateStoreArgs = {
  input: StoreCreateInput;
};


export type MutationCreateTagArgs = {
  input: TagCreateInput;
};


export type MutationDeleteAddressOnOwnerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCategoryArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteCustomerArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteMediaArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteProductArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTagArgs = {
  id: Scalars['String']['input'];
};


export type MutationRemoveProductsFromCollectionArgs = {
  collectionId: Scalars['String']['input'];
  productIds: Array<Scalars['String']['input']>;
};


export type MutationReorderMediaArgs = {
  orderedIds: Array<Scalars['String']['input']>;
  ownerId: Scalars['String']['input'];
  ownerType: MediaOwnerType;
};


export type MutationSigninArgs = {
  input: AuthSigninInput;
};


export type MutationSignupArgs = {
  input: AuthSignupInput;
};


export type MutationUpdateAddressOnOwnerArgs = {
  input: AddressOnOwnerUpdateInput;
};


export type MutationUpdateCategoryArgs = {
  input: CategoryUpdateInput;
};


export type MutationUpdateCollectionArgs = {
  input: CollectionUpdateInput;
};


export type MutationUpdateCustomerArgs = {
  input: CustomerUpdateInput;
};


export type MutationUpdateMediaArgs = {
  input: MediaUpdateInput;
};


export type MutationUpdatePasswordArgs = {
  input: UserPasswordUpdateInput;
};


export type MutationUpdateProductArgs = {
  input: ProductUpdateInput;
};


export type MutationUpdateStoreArgs = {
  input: StoreUpdateInput;
};


export type MutationUpdateTagArgs = {
  input: TagUpdateInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

/** Product model */
export type Product = {
  __typename?: 'Product';
  available: Scalars['Int']['output'];
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['String']['output']>;
  collections: Array<Collection>;
  compareAtPrice?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  media: Array<Media>;
  options: Array<ProductOption>;
  price?: Maybe<Scalars['Float']['output']>;
  salesChannels: Array<SalesChannel>;
  seoDescription?: Maybe<Scalars['String']['output']>;
  seoTitle?: Maybe<Scalars['String']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  slug: Scalars['String']['output'];
  status: ProductStatus;
  store: Store;
  storeId: Scalars['String']['output'];
  tags: Array<Tag>;
  title: Scalars['String']['output'];
  trackInventory: Scalars['Boolean']['output'];
  updatedAt: Scalars['DateTime']['output'];
  variants: Array<ProductVariant>;
};

export type ProductCreateInput = {
  available?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  collectionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  options?: InputMaybe<Array<ProductOptionInput>>;
  price?: InputMaybe<Scalars['Float']['input']>;
  salesChannels?: InputMaybe<Array<SalesChannel>>;
  seoDescription?: InputMaybe<Scalars['String']['input']>;
  seoTitle?: InputMaybe<Scalars['String']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProductStatus>;
  storeId: Scalars['String']['input'];
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  variants?: InputMaybe<Array<ProductVariantInput>>;
};

export type ProductFiltersInput = {
  categoryId?: InputMaybe<Scalars['String']['input']>;
  inStock?: InputMaybe<Scalars['Boolean']['input']>;
  maxPrice?: InputMaybe<Scalars['Float']['input']>;
  minPrice?: InputMaybe<Scalars['Float']['input']>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<ProductStatus>>;
};

/** Product option model (e.g., Size, Color) */
export type ProductOption = {
  __typename?: 'ProductOption';
  /** When the option was created */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier */
  id: Scalars['ID']['output'];
  /** Option name (e.g., "Size", "Color") */
  name: Scalars['String']['output'];
  /** Product this option belongs to */
  product: Product;
  /** When the option was last updated */
  updatedAt: Scalars['DateTime']['output'];
  /** Possible values for this option (e.g., ["S", "M", "L"]) */
  values: Array<Scalars['String']['output']>;
};

export type ProductOptionInput = {
  name: Scalars['String']['input'];
  values: Array<Scalars['String']['input']>;
};

export type ProductOptionValue = {
  __typename?: 'ProductOptionValue';
  /** Option name */
  name: Scalars['String']['output'];
  /** Selected value */
  value: Scalars['String']['output'];
};

/** Status of the product (DRAFT, ACTIVE, ARCHIVED) */
export enum ProductStatus {
  Active = 'ACTIVE',
  Archived = 'ARCHIVED',
  Draft = 'DRAFT'
}

export type ProductUpdateInput = {
  /** Available quantity for the default variant */
  available?: InputMaybe<Scalars['Int']['input']>;
  categoryId?: InputMaybe<Scalars['String']['input']>;
  collectionIds?: InputMaybe<Array<Scalars['String']['input']>>;
  /** Compare at price for the default variant */
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  options?: InputMaybe<Array<ProductOptionInput>>;
  /** Price for the default variant */
  price?: InputMaybe<Scalars['Float']['input']>;
  salesChannels?: InputMaybe<Array<SalesChannel>>;
  seoDescription?: InputMaybe<Scalars['String']['input']>;
  seoTitle?: InputMaybe<Scalars['String']['input']>;
  /** SKU for the default variant */
  sku?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<ProductStatus>;
  tagIds?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  trackInventory?: InputMaybe<Scalars['Boolean']['input']>;
  variants?: InputMaybe<Array<ProductVariantInput>>;
};

/** Product variant model */
export type ProductVariant = {
  __typename?: 'ProductVariant';
  /** Number of items in stock */
  available: Scalars['Int']['output'];
  /** Original or compare-at price */
  compareAtPrice?: Maybe<Scalars['Float']['output']>;
  /** When the variant was created */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier */
  id: Scalars['ID']['output'];
  /** Media attached to this variant */
  media: Array<Media>;
  /** Combination of option values that define this variant */
  optionCombination: Array<Scalars['String']['output']>;
  /** Current selling price */
  price: Scalars['Float']['output'];
  /** Parent product */
  product: Product;
  /** ID of the parent product */
  productId: Scalars['String']['output'];
  /** Stock keeping unit */
  sku?: Maybe<Scalars['String']['output']>;
  /** When the variant was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type ProductVariantInput = {
  available?: InputMaybe<Scalars['Int']['input']>;
  compareAtPrice?: InputMaybe<Scalars['Float']['input']>;
  optionCombination: Array<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  sku?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  addressOnOwner: AddressOnOwner;
  categoryBySlug?: Maybe<Category>;
  collection: Collection;
  customer: Customer;
  /** Get current user */
  me: User;
  media?: Maybe<Media>;
  mediaByOwner: Array<Media>;
  myStoreProducts: Array<Product>;
  myStores: Array<Store>;
  ownerAddresses: Array<AddressOnOwner>;
  product?: Maybe<Product>;
  productBySlug?: Maybe<Product>;
  store: Store;
  storeCategories: Array<Category>;
  storeCollections: Array<Collection>;
  storeCustomers: Array<Customer>;
  storeTags: Array<Tag>;
  tag: Tag;
  user: User;
};


export type QueryAddressOnOwnerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoryBySlugArgs = {
  slug: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};


export type QueryCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMediaArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMediaByOwnerArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  ownerId: Scalars['String']['input'];
  ownerType: MediaOwnerType;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  take?: Scalars['Int']['input'];
};


export type QueryMyStoreProductsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<ProductFiltersInput>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  storeId: Scalars['String']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryMyStoresArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  take?: Scalars['Int']['input'];
};


export type QueryOwnerAddressesArgs = {
  ownerId: Scalars['String']['input'];
  ownerType: AddressOwnerType;
};


export type QueryProductArgs = {
  id: Scalars['String']['input'];
};


export type QueryProductBySlugArgs = {
  slug: Scalars['String']['input'];
  storeId: Scalars['String']['input'];
};


export type QueryStoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoreCategoriesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  storeId: Scalars['String']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryStoreCollectionsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  storeId: Scalars['String']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryStoreCustomersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  storeId: Scalars['String']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryStoreTagsArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  storeId: Scalars['String']['input'];
  take?: Scalars['Int']['input'];
};


export type QueryTagArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};

/** Sales channel for the product (ONLINE, IN_STORE) */
export enum SalesChannel {
  InStore = 'IN_STORE',
  Online = 'ONLINE'
}

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Store model */
export type Store = {
  __typename?: 'Store';
  /** Addresses associated with the store */
  addresses?: Maybe<Array<AddressOnOwner>>;
  categories: Array<Category>;
  collections: Array<Collection>;
  /** When the store was created */
  createdAt: Scalars['DateTime']['output'];
  /** Primary currency of the store */
  currency: StoreCurrency;
  /** Position of the currency symbol relative to the amount */
  currencyPosition: CurrencyPosition;
  /** Custom symbol for the currency (e.g., KSh, USh) */
  currencySymbol?: Maybe<Scalars['String']['output']>;
  /** Email address of the store */
  email: Scalars['String']['output'];
  /** Facebook page username/handle */
  facebook?: Maybe<Scalars['String']['output']>;
  /** Unique identifier of the store */
  id: Scalars['ID']['output'];
  /** Instagram handle (without @) */
  instagram?: Maybe<Scalars['String']['output']>;
  /** Name of the store */
  name: Scalars['String']['output'];
  /** Prefix for order numbers */
  orderPrefix?: Maybe<Scalars['String']['output']>;
  /** Suffix for order numbers */
  orderSuffix?: Maybe<Scalars['String']['output']>;
  /** Owner of the store */
  owner?: Maybe<User>;
  /** ID of the store owner */
  ownerId: Scalars['String']['output'];
  /** Phone number of the store */
  phone?: Maybe<Scalars['String']['output']>;
  products: Array<Product>;
  /** Whether to show currency code alongside amounts */
  showCurrencyCode: Scalars['Boolean']['output'];
  /** URL-friendly slug of the store */
  slug: Scalars['String']['output'];
  tags: Array<Tag>;
  /** Timezone of the store (e.g., Africa/Nairobi) */
  timeZone: Scalars['String']['output'];
  /** Type of store */
  type: StoreType;
  /** Measurement system used by the store */
  unitSystem: UnitSystem;
  /** When the store was last updated */
  updatedAt: Scalars['DateTime']['output'];
  /** Weight unit used for products */
  weightUnit: WeightUnit;
  /** WhatsApp business number */
  whatsApp?: Maybe<Scalars['String']['output']>;
};

export type StoreCreateInput = {
  currency: StoreCurrency;
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  type: StoreType;
};

/** The currency used by the store (KES, UGX, TZS, etc.) */
export enum StoreCurrency {
  Bif = 'BIF',
  Kes = 'KES',
  Rwf = 'RWF',
  Ssp = 'SSP',
  Tzs = 'TZS',
  Ugx = 'UGX'
}

/** The type of store (PHYSICAL_GOODS, REAL_ESTATE, VEHICLES) */
export enum StoreType {
  PhysicalGoods = 'PHYSICAL_GOODS',
  RealEstate = 'REAL_ESTATE',
  Vehicles = 'VEHICLES'
}

export type StoreUpdateInput = {
  currencyPosition?: InputMaybe<CurrencyPosition>;
  currencySymbol?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  facebook?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  instagram?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  orderPrefix?: InputMaybe<Scalars['String']['input']>;
  orderSuffix?: InputMaybe<Scalars['String']['input']>;
  phone?: InputMaybe<Scalars['String']['input']>;
  showCurrencyCode?: InputMaybe<Scalars['Boolean']['input']>;
  timeZone?: InputMaybe<Scalars['String']['input']>;
  unitSystem?: InputMaybe<UnitSystem>;
  weightUnit?: InputMaybe<WeightUnit>;
  whatsApp?: InputMaybe<Scalars['String']['input']>;
};

/** Tag model */
export type Tag = {
  __typename?: 'Tag';
  /** When the tag was created */
  createdAt: Scalars['DateTime']['output'];
  /** Unique identifier of the tag */
  id: Scalars['ID']['output'];
  /** Name of the tag */
  name: Scalars['String']['output'];
  /** Products associated with this tag */
  products?: Maybe<Array<Product>>;
  /** URL-friendly slug of the tag */
  slug: Scalars['String']['output'];
  /** Store this tag belongs to */
  store?: Maybe<Store>;
  /** ID of the store this tag belongs to */
  storeId: Scalars['String']['output'];
  /** When the tag was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type TagCreateInput = {
  name: Scalars['String']['input'];
  slug: Scalars['String']['input'];
  storeId: Scalars['ID']['input'];
};

export type TagUpdateInput = {
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
};

/** Available user interface themes */
export enum Theme {
  Dark = 'DARK',
  Light = 'LIGHT',
  System = 'SYSTEM'
}

/** Measurement system used by the store (METRIC, IMPERIAL) */
export enum UnitSystem {
  Imperial = 'IMPERIAL',
  Metric = 'METRIC'
}

/** user */
export type User = {
  __typename?: 'User';
  /** Date the User was created */
  createdAt: Scalars['DateTime']['output'];
  /** Email of the User */
  email: Scalars['String']['output'];
  /** Whether the User email is verified */
  emailVerified: Scalars['Boolean']['output'];
  /** First name of the User */
  firstName?: Maybe<Scalars['String']['output']>;
  /** ID of the User */
  id: Scalars['ID']['output'];
  /** Preferred language for the user interface */
  language: Language;
  /** Last name of the User */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Stores owned by the User */
  stores: Array<Store>;
  /** Preferred theme for the user interface */
  theme: Theme;
  /** Preferred timezone */
  timeZone: Scalars['String']['output'];
  /** Date the User was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type UserPasswordUpdateInput = {
  /** ID of the User */
  id: Scalars['String']['input'];
  /** New password of the User */
  newPassword?: InputMaybe<Scalars['String']['input']>;
  /** Old password of the User */
  oldPassword?: InputMaybe<Scalars['String']['input']>;
};

export type UserUpdateInput = {
  /** First name of the User */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** ID of the User */
  id: Scalars['String']['input'];
  /** Preferred language for the user interface */
  language?: InputMaybe<Language>;
  /** Last name of the User */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Preferred theme for the user interface */
  theme?: InputMaybe<Theme>;
  /** Preferred timezone (e.g., "Africa/Nairobi") */
  timeZone?: InputMaybe<Scalars['String']['input']>;
};

/** Weight unit used by the store (KILOGRAM, POUND, etc.) */
export enum WeightUnit {
  Gram = 'GRAM',
  Kilogram = 'KILOGRAM',
  Ounce = 'OUNCE',
  Pound = 'POUND'
}



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Address: ResolverTypeWrapper<Address>;
  AddressInput: AddressInput;
  AddressOnOwner: ResolverTypeWrapper<AddressOnOwner>;
  AddressOnOwnerCreateInput: AddressOnOwnerCreateInput;
  AddressOnOwnerUpdateInput: AddressOnOwnerUpdateInput;
  AddressOwnerType: AddressOwnerType;
  AddressType: AddressType;
  AuthSignin: ResolverTypeWrapper<AuthSignin>;
  AuthSigninInput: AuthSigninInput;
  AuthSignout: ResolverTypeWrapper<AuthSignout>;
  AuthSignup: ResolverTypeWrapper<AuthSignup>;
  AuthSignupInput: AuthSignupInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  BulkCollectionDeleteInput: BulkCollectionDeleteInput;
  BulkCollectionUpdateInput: BulkCollectionUpdateInput;
  BulkProductDeleteInput: BulkProductDeleteInput;
  BulkProductUpdateData: BulkProductUpdateData;
  BulkProductUpdateInput: BulkProductUpdateInput;
  Category: ResolverTypeWrapper<Category>;
  CategoryCreateInput: CategoryCreateInput;
  CategoryUpdateInput: CategoryUpdateInput;
  Collection: ResolverTypeWrapper<Collection>;
  CollectionBulkUpdateData: CollectionBulkUpdateData;
  CollectionCreateInput: CollectionCreateInput;
  CollectionUpdateInput: CollectionUpdateInput;
  CurrencyPosition: CurrencyPosition;
  Customer: ResolverTypeWrapper<Customer>;
  CustomerCreateInput: CustomerCreateInput;
  CustomerUpdateInput: CustomerUpdateInput;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Language: Language;
  Media: ResolverTypeWrapper<Media>;
  MediaCreateInput: MediaCreateInput;
  MediaOwnerType: MediaOwnerType;
  MediaType: MediaType;
  MediaUpdateInput: MediaUpdateInput;
  Mutation: ResolverTypeWrapper<{}>;
  Product: ResolverTypeWrapper<Product>;
  ProductCreateInput: ProductCreateInput;
  ProductFiltersInput: ProductFiltersInput;
  ProductOption: ResolverTypeWrapper<ProductOption>;
  ProductOptionInput: ProductOptionInput;
  ProductOptionValue: ResolverTypeWrapper<ProductOptionValue>;
  ProductStatus: ProductStatus;
  ProductUpdateInput: ProductUpdateInput;
  ProductVariant: ResolverTypeWrapper<ProductVariant>;
  ProductVariantInput: ProductVariantInput;
  Query: ResolverTypeWrapper<{}>;
  SalesChannel: SalesChannel;
  SortOrder: SortOrder;
  Store: ResolverTypeWrapper<Store>;
  StoreCreateInput: StoreCreateInput;
  StoreCurrency: StoreCurrency;
  StoreType: StoreType;
  StoreUpdateInput: StoreUpdateInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tag: ResolverTypeWrapper<Tag>;
  TagCreateInput: TagCreateInput;
  TagUpdateInput: TagUpdateInput;
  Theme: Theme;
  UnitSystem: UnitSystem;
  User: ResolverTypeWrapper<User>;
  UserPasswordUpdateInput: UserPasswordUpdateInput;
  UserUpdateInput: UserUpdateInput;
  WeightUnit: WeightUnit;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  AddressInput: AddressInput;
  AddressOnOwner: AddressOnOwner;
  AddressOnOwnerCreateInput: AddressOnOwnerCreateInput;
  AddressOnOwnerUpdateInput: AddressOnOwnerUpdateInput;
  AuthSignin: AuthSignin;
  AuthSigninInput: AuthSigninInput;
  AuthSignout: AuthSignout;
  AuthSignup: AuthSignup;
  AuthSignupInput: AuthSignupInput;
  Boolean: Scalars['Boolean']['output'];
  BulkCollectionDeleteInput: BulkCollectionDeleteInput;
  BulkCollectionUpdateInput: BulkCollectionUpdateInput;
  BulkProductDeleteInput: BulkProductDeleteInput;
  BulkProductUpdateData: BulkProductUpdateData;
  BulkProductUpdateInput: BulkProductUpdateInput;
  Category: Category;
  CategoryCreateInput: CategoryCreateInput;
  CategoryUpdateInput: CategoryUpdateInput;
  Collection: Collection;
  CollectionBulkUpdateData: CollectionBulkUpdateData;
  CollectionCreateInput: CollectionCreateInput;
  CollectionUpdateInput: CollectionUpdateInput;
  Customer: Customer;
  CustomerCreateInput: CustomerCreateInput;
  CustomerUpdateInput: CustomerUpdateInput;
  DateTime: Scalars['DateTime']['output'];
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Media: Media;
  MediaCreateInput: MediaCreateInput;
  MediaUpdateInput: MediaUpdateInput;
  Mutation: {};
  Product: Product;
  ProductCreateInput: ProductCreateInput;
  ProductFiltersInput: ProductFiltersInput;
  ProductOption: ProductOption;
  ProductOptionInput: ProductOptionInput;
  ProductOptionValue: ProductOptionValue;
  ProductUpdateInput: ProductUpdateInput;
  ProductVariant: ProductVariant;
  ProductVariantInput: ProductVariantInput;
  Query: {};
  Store: Store;
  StoreCreateInput: StoreCreateInput;
  StoreUpdateInput: StoreUpdateInput;
  String: Scalars['String']['output'];
  Tag: Tag;
  TagCreateInput: TagCreateInput;
  TagUpdateInput: TagUpdateInput;
  User: User;
  UserPasswordUpdateInput: UserPasswordUpdateInput;
  UserUpdateInput: UserUpdateInput;
};

export type AddressResolvers<ContextType = any, ParentType extends ResolversParentTypes['Address'] = ResolversParentTypes['Address']> = {
  city?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  country?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  line1?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  line2?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  state?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  zipCode?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AddressOnOwnerResolvers<ContextType = any, ParentType extends ResolversParentTypes['AddressOnOwner'] = ResolversParentTypes['AddressOnOwner']> = {
  address?: Resolver<Maybe<ResolversTypes['Address']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isDefault?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerType?: Resolver<ResolversTypes['AddressOwnerType'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['AddressType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthSigninResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthSignin'] = ResolversParentTypes['AuthSignin']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthSignoutResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthSignout'] = ResolversParentTypes['AuthSignout']> = {
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type AuthSignupResolvers<ContextType = any, ParentType extends ResolversParentTypes['AuthSignup'] = ResolversParentTypes['AuthSignup']> = {
  accessToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  refreshToken?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CategoryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Category'] = ResolversParentTypes['Category']> = {
  children?: Resolver<Maybe<Array<ResolversTypes['Category']>>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  parent?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  parentId?: Resolver<Maybe<ResolversTypes['ID']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CollectionResolvers<ContextType = any, ParentType extends ResolversParentTypes['Collection'] = ResolversParentTypes['Collection']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isActive?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  seoDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seoTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CustomerResolvers<ContextType = any, ParentType extends ResolversParentTypes['Customer'] = ResolversParentTypes['Customer']> = {
  billingAddress?: Resolver<Maybe<ResolversTypes['AddressOnOwner']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  marketingEmails?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  marketingSMS?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  phoneNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MediaResolvers<ContextType = any, ParentType extends ResolversParentTypes['Media'] = ResolversParentTypes['Media']> = {
  alt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  fileName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modelFormat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerType?: Resolver<ResolversTypes['MediaOwnerType'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType>;
  productVariant?: Resolver<Maybe<ResolversTypes['ProductVariant']>, ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['MediaType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userProfile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addProductsToCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationAddProductsToCollectionArgs, 'collectionId' | 'productIds'>>;
  bulkDeleteCollections?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkDeleteCollectionsArgs, 'input'>>;
  bulkDeleteProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkDeleteProductsArgs, 'input'>>;
  bulkUpdateCollections?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkUpdateCollectionsArgs, 'input'>>;
  bulkUpdateProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkUpdateProductsArgs, 'input'>>;
  createAddressOnOwner?: Resolver<ResolversTypes['AddressOnOwner'], ParentType, ContextType, RequireFields<MutationCreateAddressOnOwnerArgs, 'input'>>;
  createCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationCreateCategoryArgs, 'input'>>;
  createCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'input'>>;
  createMedia?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<MutationCreateMediaArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationCreateStoreArgs, 'input'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  deleteAddressOnOwner?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAddressOnOwnerArgs, 'id'>>;
  deleteCategory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCategoryArgs, 'id'>>;
  deleteCollection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'id'>>;
  deleteCustomer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'id'>>;
  deleteMedia?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMediaArgs, 'id'>>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  refresh?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType>;
  removeProductsFromCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationRemoveProductsFromCollectionArgs, 'collectionId' | 'productIds'>>;
  reorderMedia?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<MutationReorderMediaArgs, 'orderedIds' | 'ownerId' | 'ownerType'>>;
  signin?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType, RequireFields<MutationSigninArgs, 'input'>>;
  signout?: Resolver<ResolversTypes['AuthSignout'], ParentType, ContextType>;
  signup?: Resolver<ResolversTypes['AuthSignup'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  updateAddressOnOwner?: Resolver<ResolversTypes['AddressOnOwner'], ParentType, ContextType, RequireFields<MutationUpdateAddressOnOwnerArgs, 'input'>>;
  updateCategory?: Resolver<ResolversTypes['Category'], ParentType, ContextType, RequireFields<MutationUpdateCategoryArgs, 'input'>>;
  updateCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'input'>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'input'>>;
  updateMedia?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<MutationUpdateMediaArgs, 'input'>>;
  updatePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdatePasswordArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'input'>>;
  updateStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationUpdateStoreArgs, 'input'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type ProductResolvers<ContextType = any, ParentType extends ResolversParentTypes['Product'] = ResolversParentTypes['Product']> = {
  available?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  categoryId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  collections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
  compareAtPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  media?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType>;
  options?: Resolver<Array<ResolversTypes['ProductOption']>, ParentType, ContextType>;
  price?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  salesChannels?: Resolver<Array<ResolversTypes['SalesChannel']>, ParentType, ContextType>;
  seoDescription?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  seoTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['ProductStatus'], ParentType, ContextType>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  trackInventory?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  variants?: Resolver<Array<ResolversTypes['ProductVariant']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOption'] = ResolversParentTypes['ProductOption']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  values?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductOptionValueResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductOptionValue'] = ResolversParentTypes['ProductOptionValue']> = {
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  value?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type ProductVariantResolvers<ContextType = any, ParentType extends ResolversParentTypes['ProductVariant'] = ResolversParentTypes['ProductVariant']> = {
  available?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  compareAtPrice?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  media?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType>;
  optionCombination?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  price?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  product?: Resolver<ResolversTypes['Product'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  addressOnOwner?: Resolver<ResolversTypes['AddressOnOwner'], ParentType, ContextType, RequireFields<QueryAddressOnOwnerArgs, 'id'>>;
  categoryBySlug?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryBySlugArgs, 'slug' | 'storeId'>>;
  collection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<QueryCollectionArgs, 'id'>>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  media?: Resolver<Maybe<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<QueryMediaArgs, 'id'>>;
  mediaByOwner?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<QueryMediaByOwnerArgs, 'ownerId' | 'ownerType' | 'skip' | 'take'>>;
  myStoreProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryMyStoreProductsArgs, 'skip' | 'storeId' | 'take'>>;
  myStores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType, RequireFields<QueryMyStoresArgs, 'skip' | 'take'>>;
  ownerAddresses?: Resolver<Array<ResolversTypes['AddressOnOwner']>, ParentType, ContextType, RequireFields<QueryOwnerAddressesArgs, 'ownerId' | 'ownerType'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  productBySlug?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductBySlugArgs, 'slug' | 'storeId'>>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<QueryStoreArgs, 'id'>>;
  storeCategories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryStoreCategoriesArgs, 'skip' | 'storeId' | 'take'>>;
  storeCollections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<QueryStoreCollectionsArgs, 'skip' | 'storeId' | 'take'>>;
  storeCustomers?: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryStoreCustomersArgs, 'skip' | 'storeId' | 'take'>>;
  storeTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryStoreTagsArgs, 'skip' | 'storeId' | 'take'>>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type StoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['AddressOnOwner']>>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType>;
  collections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['StoreCurrency'], ParentType, ContextType>;
  currencyPosition?: Resolver<ResolversTypes['CurrencyPosition'], ParentType, ContextType>;
  currencySymbol?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  facebook?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  instagram?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderPrefix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  orderSuffix?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owner?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  phone?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  products?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType>;
  showCurrencyCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  tags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType>;
  timeZone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StoreType'], ParentType, ContextType>;
  unitSystem?: Resolver<ResolversTypes['UnitSystem'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  weightUnit?: Resolver<ResolversTypes['WeightUnit'], ParentType, ContextType>;
  whatsApp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  products?: Resolver<Maybe<Array<ResolversTypes['Product']>>, ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  emailVerified?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  firstName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['Language'], ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType>;
  theme?: Resolver<ResolversTypes['Theme'], ParentType, ContextType>;
  timeZone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  Address?: AddressResolvers<ContextType>;
  AddressOnOwner?: AddressOnOwnerResolvers<ContextType>;
  AuthSignin?: AuthSigninResolvers<ContextType>;
  AuthSignout?: AuthSignoutResolvers<ContextType>;
  AuthSignup?: AuthSignupResolvers<ContextType>;
  Category?: CategoryResolvers<ContextType>;
  Collection?: CollectionResolvers<ContextType>;
  Customer?: CustomerResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Media?: MediaResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductOption?: ProductOptionResolvers<ContextType>;
  ProductOptionValue?: ProductOptionValueResolvers<ContextType>;
  ProductVariant?: ProductVariantResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

