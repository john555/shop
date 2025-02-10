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
  /** The `Upload` scalar type represents a file upload. */
  Upload: { input: any; output: any; }
};

/** Type of activity in the system */
export enum ActivityType {
  CollectionCreated = 'COLLECTION_CREATED',
  CustomerRegistered = 'CUSTOMER_REGISTERED',
  OrderReceived = 'ORDER_RECEIVED',
  ProductAdded = 'PRODUCT_ADDED',
  ProductUpdated = 'PRODUCT_UPDATED'
}

export type ActivityUser = {
  __typename?: 'ActivityUser';
  avatar: Scalars['String']['output'];
  name: Scalars['String']['output'];
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
  /** Type of the store */
  storeType: StoreType;
  /** When the category was last updated */
  updatedAt: Scalars['DateTime']['output'];
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
  archivedAt?: Maybe<Scalars['DateTime']['output']>;
  blurHash?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Category>;
  collection?: Maybe<Collection>;
  createdAt: Scalars['DateTime']['output'];
  duration?: Maybe<Scalars['Int']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  fileSize?: Maybe<Scalars['Int']['output']>;
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  isArchived: Scalars['Boolean']['output'];
  mimeType?: Maybe<Scalars['String']['output']>;
  modelFormat?: Maybe<Scalars['String']['output']>;
  owners: Array<MediaOwnership>;
  placeholder?: Maybe<Scalars['String']['output']>;
  purpose: MediaPurpose;
  storeId?: Maybe<Scalars['String']['output']>;
  storeProfile?: Maybe<Store>;
  thumbnail?: Maybe<Scalars['String']['output']>;
  type: MediaType;
  updatedAt: Scalars['DateTime']['output'];
  url: Scalars['String']['output'];
  usedIn: Array<MediaUsage>;
  userProfile?: Maybe<User>;
  width?: Maybe<Scalars['Int']['output']>;
};

export type MediaCreateInput = {
  alt?: InputMaybe<Scalars['String']['input']>;
  file: Scalars['Upload']['input'];
  owners?: InputMaybe<Array<MediaOwnerInput>>;
  purpose: MediaPurpose;
  storeId: Scalars['String']['input'];
};

export type MediaOwnerInput = {
  ownerId: Scalars['String']['input'];
  ownerType: MediaOwnerType;
};

/** Type of entity that owns the media */
export enum MediaOwnerType {
  Category = 'CATEGORY',
  Collection = 'COLLECTION',
  Product = 'PRODUCT',
  ProductVariant = 'PRODUCT_VARIANT',
  Property = 'PROPERTY',
  StoreProfile = 'STORE_PROFILE',
  UserProfile = 'USER_PROFILE',
  Vehicle = 'VEHICLE'
}

export type MediaOwnership = {
  __typename?: 'MediaOwnership';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  ownerId: Scalars['String']['output'];
  ownerType: MediaOwnerType;
  position: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

/** Purpose of the media */
export enum MediaPurpose {
  Avatar = 'AVATAR',
  Banner = 'BANNER',
  Document = 'DOCUMENT',
  Gallery = 'GALLERY',
  Logo = 'LOGO',
  Other = 'OTHER'
}

export type MediaReorderInput = {
  mediaIds: Array<Scalars['String']['input']>;
  ownerId: Scalars['String']['input'];
  ownerType: MediaOwnerType;
};

export type MediaSearchInput = {
  id?: InputMaybe<Scalars['String']['input']>;
  ownerId?: InputMaybe<Scalars['String']['input']>;
  ownerType?: InputMaybe<MediaOwnerType>;
  search?: InputMaybe<Scalars['String']['input']>;
  storeId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<MediaType>;
};

/** Type of media (PHOTO, VIDEO, MODEL_3D) */
export enum MediaType {
  Model_3D = 'MODEL_3D',
  Photo = 'PHOTO',
  Video = 'VIDEO'
}

export type MediaUpdateInput = {
  addOwners?: InputMaybe<Array<MediaOwnerInput>>;
  alt?: InputMaybe<Scalars['String']['input']>;
  fileName?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  removeOwners?: InputMaybe<Array<MediaOwnerInput>>;
  thumbnail?: InputMaybe<Scalars['String']['input']>;
};

export type MediaUsage = {
  __typename?: 'MediaUsage';
  ownerId: Scalars['String']['output'];
  ownerTitle: Scalars['String']['output'];
  ownerType: MediaOwnerType;
};

export type Mutation = {
  __typename?: 'Mutation';
  addProductsToCollection: Collection;
  bulkDeleteCollections: Scalars['Int']['output'];
  bulkDeleteProducts: Scalars['Int']['output'];
  bulkUpdateCollections: Scalars['Int']['output'];
  bulkUpdateProducts: Scalars['Int']['output'];
  createAddressOnOwner: AddressOnOwner;
  createCollection: Collection;
  createCustomer: Customer;
  createDraftOrder: Order;
  createMedia: Media;
  createProduct: Product;
  createStore: Store;
  createTag: Tag;
  deleteAddressOnOwner: Scalars['Boolean']['output'];
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
  updateCollection: Collection;
  updateCustomer: Customer;
  updateMedia: Media;
  updateOrder: Order;
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


export type MutationCreateCollectionArgs = {
  input: CollectionCreateInput;
};


export type MutationCreateCustomerArgs = {
  input: CustomerCreateInput;
};


export type MutationCreateDraftOrderArgs = {
  input: OrderCreateInput;
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
  input: MediaReorderInput;
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


export type MutationUpdateCollectionArgs = {
  input: CollectionUpdateInput;
};


export type MutationUpdateCustomerArgs = {
  input: CustomerUpdateInput;
};


export type MutationUpdateMediaArgs = {
  input: MediaUpdateInput;
};


export type MutationUpdateOrderArgs = {
  input: OrderUpdateInput;
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

/** Order model */
export type Order = {
  __typename?: 'Order';
  cancelledAt?: Maybe<Scalars['DateTime']['output']>;
  createdAt: Scalars['DateTime']['output'];
  currency: StoreCurrency;
  currencySymbol: Scalars['String']['output'];
  customer?: Maybe<Customer>;
  customerId?: Maybe<Scalars['String']['output']>;
  customerNotes?: Maybe<Scalars['String']['output']>;
  deliveredAt?: Maybe<Scalars['DateTime']['output']>;
  discountAmount: Scalars['Float']['output'];
  /** Formatted order number with prefix/suffix */
  formattedOrderNumber: Scalars['String']['output'];
  /** Formatted total amount with currency symbol */
  formattedTotalAmount: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  items: Array<OrderItem>;
  /** Raw order number without prefix/suffix */
  orderNumber: Scalars['String']['output'];
  paidAt?: Maybe<Scalars['DateTime']['output']>;
  paymentStatus: PaymentStatus;
  privateNotes?: Maybe<Scalars['String']['output']>;
  shipmentStatus: ShipmentStatus;
  shippedAt?: Maybe<Scalars['DateTime']['output']>;
  shippingAmount: Scalars['Float']['output'];
  status: OrderStatus;
  store: Store;
  storeId: Scalars['String']['output'];
  subtotalAmount: Scalars['Float']['output'];
  taxAmount: Scalars['Float']['output'];
  totalAmount: Scalars['Float']['output'];
  trackingNumber?: Maybe<Scalars['String']['output']>;
  trackingUrl?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
};

export type OrderCounts = {
  __typename?: 'OrderCounts';
  cancelled: Scalars['Int']['output'];
  delivered: Scalars['Int']['output'];
  draft: Scalars['Int']['output'];
  pending: Scalars['Int']['output'];
  processing: Scalars['Int']['output'];
  shipped: Scalars['Int']['output'];
  total: Scalars['Int']['output'];
};

export type OrderCreateInput = {
  customerId?: InputMaybe<Scalars['String']['input']>;
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  items: Array<OrderItemInput>;
  privateNotes?: InputMaybe<Scalars['String']['input']>;
  storeId: Scalars['String']['input'];
};

export type OrderFiltersInput = {
  customerId?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['DateTime']['input']>;
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  paymentStatus?: InputMaybe<Array<PaymentStatus>>;
  searchQuery?: InputMaybe<Scalars['String']['input']>;
  shipmentStatus?: InputMaybe<Array<ShipmentStatus>>;
  startDate?: InputMaybe<Scalars['DateTime']['input']>;
  status?: InputMaybe<Array<OrderStatus>>;
};

/** Order item model */
export type OrderItem = {
  __typename?: 'OrderItem';
  discountAmount: Scalars['Float']['output'];
  id: Scalars['ID']['output'];
  productId: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  sku?: Maybe<Scalars['String']['output']>;
  subtotal: Scalars['Float']['output'];
  taxAmount: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  totalAmount: Scalars['Float']['output'];
  unitPrice: Scalars['Float']['output'];
  variantId: Scalars['String']['output'];
  variantName: Scalars['String']['output'];
};

export type OrderItemCreateInput = {
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  variantId: Scalars['String']['input'];
};

export type OrderItemInput = {
  productId: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
  variantId: Scalars['String']['input'];
};

export type OrderItemUpdateInput = {
  id: Scalars['String']['input'];
  quantity: Scalars['Int']['input'];
};

export type OrderStats = {
  __typename?: 'OrderStats';
  counts: OrderCounts;
  totals: OrderTotals;
};

/** Status of the order */
export enum OrderStatus {
  Cancelled = 'CANCELLED',
  Delivered = 'DELIVERED',
  Draft = 'DRAFT',
  Fulfilled = 'FULFILLED',
  Paid = 'PAID',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Refunded = 'REFUNDED',
  Shipped = 'SHIPPED'
}

export type OrderTotals = {
  __typename?: 'OrderTotals';
  discounts: Scalars['Float']['output'];
  orders: Scalars['Float']['output'];
  shipping: Scalars['Float']['output'];
  tax: Scalars['Float']['output'];
};

export type OrderUpdateInput = {
  addItems?: InputMaybe<Array<OrderItemCreateInput>>;
  customerId?: InputMaybe<Scalars['String']['input']>;
  customerNotes?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  paymentStatus?: InputMaybe<PaymentStatus>;
  privateNotes?: InputMaybe<Scalars['String']['input']>;
  removeItems?: InputMaybe<Array<Scalars['String']['input']>>;
  shipmentStatus?: InputMaybe<ShipmentStatus>;
  status?: InputMaybe<OrderStatus>;
  trackingNumber?: InputMaybe<Scalars['String']['input']>;
  trackingUrl?: InputMaybe<Scalars['String']['input']>;
  updateItems?: InputMaybe<Array<OrderItemUpdateInput>>;
};

/** Status of the payment */
export enum PaymentStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Refunded = 'REFUNDED'
}

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
  mediaIds?: InputMaybe<Array<Scalars['String']['input']>>;
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
  mediaIds?: InputMaybe<Array<Scalars['String']['input']>>;
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
  id?: InputMaybe<Scalars['String']['input']>;
  optionCombination: Array<Scalars['String']['input']>;
  price: Scalars['Float']['input'];
  sku?: InputMaybe<Scalars['String']['input']>;
};

export type Query = {
  __typename?: 'Query';
  addressOnOwner: AddressOnOwner;
  categoriesByStoreType: Array<Category>;
  category?: Maybe<Category>;
  collection: Collection;
  customer: Customer;
  /** Get current user */
  me: User;
  media: Array<Media>;
  mediaById: Media;
  myStoreOrderStats: OrderStats;
  myStoreOrders: Array<Order>;
  myStoreProducts: Array<Product>;
  myStores: Array<Store>;
  order?: Maybe<Order>;
  ownerAddresses: Array<AddressOnOwner>;
  product?: Maybe<Product>;
  productBySlug?: Maybe<Product>;
  store: Store;
  storeCollections: Array<Collection>;
  storeCustomers: Array<Customer>;
  storeOverview: StoreOverview;
  storeTags: Array<Tag>;
  tag: Tag;
  user: User;
};


export type QueryAddressOnOwnerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCategoriesByStoreTypeArgs = {
  storeType: StoreType;
};


export type QueryCategoryArgs = {
  id: Scalars['String']['input'];
};


export type QueryCollectionArgs = {
  id: Scalars['ID']['input'];
};


export type QueryCustomerArgs = {
  id: Scalars['ID']['input'];
};


export type QueryMediaArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  input: MediaSearchInput;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  take?: Scalars['Int']['input'];
};


export type QueryMediaByIdArgs = {
  id: Scalars['String']['input'];
};


export type QueryMyStoreOrderStatsArgs = {
  storeId: Scalars['String']['input'];
};


export type QueryMyStoreOrdersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  filters?: InputMaybe<OrderFiltersInput>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  storeId: Scalars['String']['input'];
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


export type QueryOrderArgs = {
  id: Scalars['String']['input'];
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
  idOrSlug: Scalars['String']['input'];
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


export type QueryStoreOverviewArgs = {
  storeId: Scalars['String']['input'];
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

export type RecentActivity = {
  __typename?: 'RecentActivity';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  title: Scalars['String']['output'];
  type: ActivityType;
  user?: Maybe<ActivityUser>;
};

export type RecentOrder = {
  __typename?: 'RecentOrder';
  customerName: Scalars['String']['output'];
  id: Scalars['String']['output'];
  isNew: Scalars['Boolean']['output'];
  status: OrderStatus;
  total: Scalars['Float']['output'];
};

/** Sales channel for the product (ONLINE, IN_STORE) */
export enum SalesChannel {
  InStore = 'IN_STORE',
  Online = 'ONLINE'
}

/** Status of the shipment */
export enum ShipmentStatus {
  Delivered = 'DELIVERED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING',
  Shipped = 'SHIPPED'
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
  /** Whether to show currency code alongside amounts */
  showCurrencyCode: Scalars['Boolean']['output'];
  /** Slogan or tagline of the store */
  slogan?: Maybe<Scalars['String']['output']>;
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


/** Store model */
export type StoreCategoriesArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  take?: Scalars['Int']['input'];
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

export type StoreOverview = {
  __typename?: 'StoreOverview';
  averageOrderValue: Scalars['Float']['output'];
  collections: Scalars['Int']['output'];
  collectionsSubtext: Scalars['String']['output'];
  conversionRate: Scalars['Float']['output'];
  conversionRateGrowth: Scalars['Float']['output'];
  customers: Scalars['Int']['output'];
  customersSubtext: Scalars['String']['output'];
  orderValueGrowth: Scalars['Float']['output'];
  ordersSubtext: Scalars['String']['output'];
  productsSubtext: Scalars['String']['output'];
  recentActivities: Array<RecentActivity>;
  recentOrders: Array<RecentOrder>;
  revenue: Scalars['Float']['output'];
  revenueGrowth: Scalars['Float']['output'];
  totalOrders: Scalars['Int']['output'];
  totalProducts: Scalars['Int']['output'];
};

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
  ActivityType: ActivityType;
  ActivityUser: ResolverTypeWrapper<ActivityUser>;
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
  MediaOwnerInput: MediaOwnerInput;
  MediaOwnerType: MediaOwnerType;
  MediaOwnership: ResolverTypeWrapper<MediaOwnership>;
  MediaPurpose: MediaPurpose;
  MediaReorderInput: MediaReorderInput;
  MediaSearchInput: MediaSearchInput;
  MediaType: MediaType;
  MediaUpdateInput: MediaUpdateInput;
  MediaUsage: ResolverTypeWrapper<MediaUsage>;
  Mutation: ResolverTypeWrapper<{}>;
  Order: ResolverTypeWrapper<Order>;
  OrderCounts: ResolverTypeWrapper<OrderCounts>;
  OrderCreateInput: OrderCreateInput;
  OrderFiltersInput: OrderFiltersInput;
  OrderItem: ResolverTypeWrapper<OrderItem>;
  OrderItemCreateInput: OrderItemCreateInput;
  OrderItemInput: OrderItemInput;
  OrderItemUpdateInput: OrderItemUpdateInput;
  OrderStats: ResolverTypeWrapper<OrderStats>;
  OrderStatus: OrderStatus;
  OrderTotals: ResolverTypeWrapper<OrderTotals>;
  OrderUpdateInput: OrderUpdateInput;
  PaymentStatus: PaymentStatus;
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
  RecentActivity: ResolverTypeWrapper<RecentActivity>;
  RecentOrder: ResolverTypeWrapper<RecentOrder>;
  SalesChannel: SalesChannel;
  ShipmentStatus: ShipmentStatus;
  SortOrder: SortOrder;
  Store: ResolverTypeWrapper<Store>;
  StoreCreateInput: StoreCreateInput;
  StoreCurrency: StoreCurrency;
  StoreOverview: ResolverTypeWrapper<StoreOverview>;
  StoreType: StoreType;
  StoreUpdateInput: StoreUpdateInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Tag: ResolverTypeWrapper<Tag>;
  TagCreateInput: TagCreateInput;
  TagUpdateInput: TagUpdateInput;
  Theme: Theme;
  UnitSystem: UnitSystem;
  Upload: ResolverTypeWrapper<Scalars['Upload']['output']>;
  User: ResolverTypeWrapper<User>;
  UserPasswordUpdateInput: UserPasswordUpdateInput;
  UserUpdateInput: UserUpdateInput;
  WeightUnit: WeightUnit;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  ActivityUser: ActivityUser;
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
  MediaOwnerInput: MediaOwnerInput;
  MediaOwnership: MediaOwnership;
  MediaReorderInput: MediaReorderInput;
  MediaSearchInput: MediaSearchInput;
  MediaUpdateInput: MediaUpdateInput;
  MediaUsage: MediaUsage;
  Mutation: {};
  Order: Order;
  OrderCounts: OrderCounts;
  OrderCreateInput: OrderCreateInput;
  OrderFiltersInput: OrderFiltersInput;
  OrderItem: OrderItem;
  OrderItemCreateInput: OrderItemCreateInput;
  OrderItemInput: OrderItemInput;
  OrderItemUpdateInput: OrderItemUpdateInput;
  OrderStats: OrderStats;
  OrderTotals: OrderTotals;
  OrderUpdateInput: OrderUpdateInput;
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
  RecentActivity: RecentActivity;
  RecentOrder: RecentOrder;
  Store: Store;
  StoreCreateInput: StoreCreateInput;
  StoreOverview: StoreOverview;
  StoreUpdateInput: StoreUpdateInput;
  String: Scalars['String']['output'];
  Tag: Tag;
  TagCreateInput: TagCreateInput;
  TagUpdateInput: TagUpdateInput;
  Upload: Scalars['Upload']['output'];
  User: User;
  UserPasswordUpdateInput: UserPasswordUpdateInput;
  UserUpdateInput: UserUpdateInput;
};

export type ActivityUserResolvers<ContextType = any, ParentType extends ResolversParentTypes['ActivityUser'] = ResolversParentTypes['ActivityUser']> = {
  avatar?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  storeType?: Resolver<ResolversTypes['StoreType'], ParentType, ContextType>;
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
  archivedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  blurHash?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType>;
  collection?: Resolver<Maybe<ResolversTypes['Collection']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  fileName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  fileSize?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  height?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  isArchived?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  mimeType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  modelFormat?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  owners?: Resolver<Array<ResolversTypes['MediaOwnership']>, ParentType, ContextType>;
  placeholder?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  purpose?: Resolver<ResolversTypes['MediaPurpose'], ParentType, ContextType>;
  storeId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  storeProfile?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  thumbnail?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['MediaType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  usedIn?: Resolver<Array<ResolversTypes['MediaUsage']>, ParentType, ContextType>;
  userProfile?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType>;
  width?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaOwnershipResolvers<ContextType = any, ParentType extends ResolversParentTypes['MediaOwnership'] = ResolversParentTypes['MediaOwnership']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerType?: Resolver<ResolversTypes['MediaOwnerType'], ParentType, ContextType>;
  position?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MediaUsageResolvers<ContextType = any, ParentType extends ResolversParentTypes['MediaUsage'] = ResolversParentTypes['MediaUsage']> = {
  ownerId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerTitle?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  ownerType?: Resolver<ResolversTypes['MediaOwnerType'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addProductsToCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationAddProductsToCollectionArgs, 'collectionId' | 'productIds'>>;
  bulkDeleteCollections?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkDeleteCollectionsArgs, 'input'>>;
  bulkDeleteProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkDeleteProductsArgs, 'input'>>;
  bulkUpdateCollections?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkUpdateCollectionsArgs, 'input'>>;
  bulkUpdateProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType, RequireFields<MutationBulkUpdateProductsArgs, 'input'>>;
  createAddressOnOwner?: Resolver<ResolversTypes['AddressOnOwner'], ParentType, ContextType, RequireFields<MutationCreateAddressOnOwnerArgs, 'input'>>;
  createCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationCreateCollectionArgs, 'input'>>;
  createCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationCreateCustomerArgs, 'input'>>;
  createDraftOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationCreateDraftOrderArgs, 'input'>>;
  createMedia?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<MutationCreateMediaArgs, 'input'>>;
  createProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationCreateProductArgs, 'input'>>;
  createStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationCreateStoreArgs, 'input'>>;
  createTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationCreateTagArgs, 'input'>>;
  deleteAddressOnOwner?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAddressOnOwnerArgs, 'id'>>;
  deleteCollection?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCollectionArgs, 'id'>>;
  deleteCustomer?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteCustomerArgs, 'id'>>;
  deleteMedia?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteMediaArgs, 'id'>>;
  deleteProduct?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteProductArgs, 'id'>>;
  deleteTag?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteTagArgs, 'id'>>;
  refresh?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType>;
  removeProductsFromCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationRemoveProductsFromCollectionArgs, 'collectionId' | 'productIds'>>;
  reorderMedia?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<MutationReorderMediaArgs, 'input'>>;
  signin?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType, RequireFields<MutationSigninArgs, 'input'>>;
  signout?: Resolver<ResolversTypes['AuthSignout'], ParentType, ContextType>;
  signup?: Resolver<ResolversTypes['AuthSignup'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  updateAddressOnOwner?: Resolver<ResolversTypes['AddressOnOwner'], ParentType, ContextType, RequireFields<MutationUpdateAddressOnOwnerArgs, 'input'>>;
  updateCollection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<MutationUpdateCollectionArgs, 'input'>>;
  updateCustomer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<MutationUpdateCustomerArgs, 'input'>>;
  updateMedia?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<MutationUpdateMediaArgs, 'input'>>;
  updateOrder?: Resolver<ResolversTypes['Order'], ParentType, ContextType, RequireFields<MutationUpdateOrderArgs, 'input'>>;
  updatePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdatePasswordArgs, 'input'>>;
  updateProduct?: Resolver<ResolversTypes['Product'], ParentType, ContextType, RequireFields<MutationUpdateProductArgs, 'input'>>;
  updateStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationUpdateStoreArgs, 'input'>>;
  updateTag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<MutationUpdateTagArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type OrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['Order'] = ResolversParentTypes['Order']> = {
  cancelledAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  currency?: Resolver<ResolversTypes['StoreCurrency'], ParentType, ContextType>;
  currencySymbol?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  customer?: Resolver<Maybe<ResolversTypes['Customer']>, ParentType, ContextType>;
  customerId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  customerNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  deliveredAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  discountAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  formattedOrderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  formattedTotalAmount?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['OrderItem']>, ParentType, ContextType>;
  orderNumber?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  paidAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  paymentStatus?: Resolver<ResolversTypes['PaymentStatus'], ParentType, ContextType>;
  privateNotes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shipmentStatus?: Resolver<ResolversTypes['ShipmentStatus'], ParentType, ContextType>;
  shippedAt?: Resolver<Maybe<ResolversTypes['DateTime']>, ParentType, ContextType>;
  shippingAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  subtotalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  trackingNumber?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  trackingUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderCountsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderCounts'] = ResolversParentTypes['OrderCounts']> = {
  cancelled?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  delivered?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  draft?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  pending?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  processing?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  shipped?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderItemResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderItem'] = ResolversParentTypes['OrderItem']> = {
  discountAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  productId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  sku?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  subtotal?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  taxAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  totalAmount?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  variantId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  variantName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderStatsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderStats'] = ResolversParentTypes['OrderStats']> = {
  counts?: Resolver<ResolversTypes['OrderCounts'], ParentType, ContextType>;
  totals?: Resolver<ResolversTypes['OrderTotals'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type OrderTotalsResolvers<ContextType = any, ParentType extends ResolversParentTypes['OrderTotals'] = ResolversParentTypes['OrderTotals']> = {
  discounts?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  orders?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  shipping?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  tax?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
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
  categoriesByStoreType?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoriesByStoreTypeArgs, 'storeType'>>;
  category?: Resolver<Maybe<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<QueryCategoryArgs, 'id'>>;
  collection?: Resolver<ResolversTypes['Collection'], ParentType, ContextType, RequireFields<QueryCollectionArgs, 'id'>>;
  customer?: Resolver<ResolversTypes['Customer'], ParentType, ContextType, RequireFields<QueryCustomerArgs, 'id'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  media?: Resolver<Array<ResolversTypes['Media']>, ParentType, ContextType, RequireFields<QueryMediaArgs, 'input' | 'skip' | 'take'>>;
  mediaById?: Resolver<ResolversTypes['Media'], ParentType, ContextType, RequireFields<QueryMediaByIdArgs, 'id'>>;
  myStoreOrderStats?: Resolver<ResolversTypes['OrderStats'], ParentType, ContextType, RequireFields<QueryMyStoreOrderStatsArgs, 'storeId'>>;
  myStoreOrders?: Resolver<Array<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryMyStoreOrdersArgs, 'skip' | 'storeId' | 'take'>>;
  myStoreProducts?: Resolver<Array<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryMyStoreProductsArgs, 'skip' | 'storeId' | 'take'>>;
  myStores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType, RequireFields<QueryMyStoresArgs, 'skip' | 'take'>>;
  order?: Resolver<Maybe<ResolversTypes['Order']>, ParentType, ContextType, RequireFields<QueryOrderArgs, 'id'>>;
  ownerAddresses?: Resolver<Array<ResolversTypes['AddressOnOwner']>, ParentType, ContextType, RequireFields<QueryOwnerAddressesArgs, 'ownerId' | 'ownerType'>>;
  product?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductArgs, 'id'>>;
  productBySlug?: Resolver<Maybe<ResolversTypes['Product']>, ParentType, ContextType, RequireFields<QueryProductBySlugArgs, 'slug' | 'storeId'>>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<QueryStoreArgs, 'idOrSlug'>>;
  storeCollections?: Resolver<Array<ResolversTypes['Collection']>, ParentType, ContextType, RequireFields<QueryStoreCollectionsArgs, 'skip' | 'storeId' | 'take'>>;
  storeCustomers?: Resolver<Array<ResolversTypes['Customer']>, ParentType, ContextType, RequireFields<QueryStoreCustomersArgs, 'skip' | 'storeId' | 'take'>>;
  storeOverview?: Resolver<ResolversTypes['StoreOverview'], ParentType, ContextType, RequireFields<QueryStoreOverviewArgs, 'storeId'>>;
  storeTags?: Resolver<Array<ResolversTypes['Tag']>, ParentType, ContextType, RequireFields<QueryStoreTagsArgs, 'skip' | 'storeId' | 'take'>>;
  tag?: Resolver<ResolversTypes['Tag'], ParentType, ContextType, RequireFields<QueryTagArgs, 'id'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
};

export type RecentActivityResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecentActivity'] = ResolversParentTypes['RecentActivity']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  description?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['ActivityType'], ParentType, ContextType>;
  user?: Resolver<Maybe<ResolversTypes['ActivityUser']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type RecentOrderResolvers<ContextType = any, ParentType extends ResolversParentTypes['RecentOrder'] = ResolversParentTypes['RecentOrder']> = {
  customerName?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  isNew?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  status?: Resolver<ResolversTypes['OrderStatus'], ParentType, ContextType>;
  total?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type StoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['AddressOnOwner']>>, ParentType, ContextType>;
  categories?: Resolver<Array<ResolversTypes['Category']>, ParentType, ContextType, RequireFields<StoreCategoriesArgs, 'skip' | 'take'>>;
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
  showCurrencyCode?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  slogan?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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

export type StoreOverviewResolvers<ContextType = any, ParentType extends ResolversParentTypes['StoreOverview'] = ResolversParentTypes['StoreOverview']> = {
  averageOrderValue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  collections?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  collectionsSubtext?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  conversionRate?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  conversionRateGrowth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  customers?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  customersSubtext?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  orderValueGrowth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  ordersSubtext?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  productsSubtext?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  recentActivities?: Resolver<Array<ResolversTypes['RecentActivity']>, ParentType, ContextType>;
  recentOrders?: Resolver<Array<ResolversTypes['RecentOrder']>, ParentType, ContextType>;
  revenue?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  revenueGrowth?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  totalOrders?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalProducts?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type TagResolvers<ContextType = any, ParentType extends ResolversParentTypes['Tag'] = ResolversParentTypes['Tag']> = {
  createdAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  store?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType>;
  storeId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface UploadScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Upload'], any> {
  name: 'Upload';
}

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
  ActivityUser?: ActivityUserResolvers<ContextType>;
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
  MediaOwnership?: MediaOwnershipResolvers<ContextType>;
  MediaUsage?: MediaUsageResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Order?: OrderResolvers<ContextType>;
  OrderCounts?: OrderCountsResolvers<ContextType>;
  OrderItem?: OrderItemResolvers<ContextType>;
  OrderStats?: OrderStatsResolvers<ContextType>;
  OrderTotals?: OrderTotalsResolvers<ContextType>;
  Product?: ProductResolvers<ContextType>;
  ProductOption?: ProductOptionResolvers<ContextType>;
  ProductOptionValue?: ProductOptionValueResolvers<ContextType>;
  ProductVariant?: ProductVariantResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  RecentActivity?: RecentActivityResolvers<ContextType>;
  RecentOrder?: RecentOrderResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  StoreOverview?: StoreOverviewResolvers<ContextType>;
  Tag?: TagResolvers<ContextType>;
  Upload?: GraphQLScalarType;
  User?: UserResolvers<ContextType>;
};

