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

/** Address */
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
  /** City/town/municipality */
  city?: InputMaybe<Scalars['String']['input']>;
  /** Country name or ISO code */
  country: Scalars['String']['input'];
  /** Street address, building number */
  line1?: InputMaybe<Scalars['String']['input']>;
  /** Suite, apartment, unit number */
  line2?: InputMaybe<Scalars['String']['input']>;
  /** State/province/region */
  state?: InputMaybe<Scalars['String']['input']>;
  /** Postal/ZIP code */
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

/** Address relationship with owner */
export type AddressOnOwner = {
  __typename?: 'AddressOnOwner';
  address: Address;
  addressId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  isDefault: Scalars['Boolean']['output'];
  ownerId: Scalars['String']['output'];
  ownerType: AddressOwnerType;
  type: AddressType;
  updatedAt: Scalars['DateTime']['output'];
};

/** Type of entity that owns the address */
export enum AddressOwnerType {
  Customer = 'CUSTOMER',
  Order = 'ORDER',
  Property = 'PROPERTY',
  Store = 'STORE',
  Vehicle = 'VEHICLE'
}

/** Type of address (billing, shipping, etc.) */
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

/** Position of currency symbol (BEFORE_AMOUNT, AFTER_AMOUNT) */
export enum CurrencyPosition {
  AfterAmount = 'AFTER_AMOUNT',
  BeforeAmount = 'BEFORE_AMOUNT'
}

/** Supported user interface languages */
export enum Language {
  Ar = 'AR',
  En = 'EN',
  Fr = 'FR',
  Lg = 'LG',
  Rw = 'RW',
  Sw = 'SW'
}

export type Mutation = {
  __typename?: 'Mutation';
  createStore: Store;
  createUser: User;
  deleteAddress: Scalars['Boolean']['output'];
  deleteStore: Scalars['Boolean']['output'];
  /** Refresh auth token */
  refresh: AuthSignin;
  /** Sign in */
  signin: AuthSignin;
  /** Sign out */
  signout: AuthSignout;
  /** Sign up new user */
  signup: AuthSignup;
  updateAddress: AddressOnOwner;
  updatePassword: User;
  updateStore: Store;
  updateUser: User;
};


export type MutationCreateStoreArgs = {
  input: StoreCreateInput;
};


export type MutationCreateUserArgs = {
  input: UserCreateInput;
};


export type MutationDeleteAddressArgs = {
  ownerId: Scalars['ID']['input'];
  ownerType: AddressOwnerType;
  type: AddressType;
};


export type MutationDeleteStoreArgs = {
  id: Scalars['String']['input'];
};


export type MutationSigninArgs = {
  input: AuthSigninInput;
};


export type MutationSignupArgs = {
  input: AuthSignupInput;
};


export type MutationUpdateAddressArgs = {
  input: UpdateAddressInput;
};


export type MutationUpdatePasswordArgs = {
  input: UserPasswordUpdateInput;
};


export type MutationUpdateStoreArgs = {
  input: StoreUpdateInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  getAddress?: Maybe<AddressOnOwner>;
  getAddresses: Array<AddressOnOwner>;
  /** Get current user */
  me: User;
  myStores: Array<Store>;
  store: Store;
  storeBySlug?: Maybe<Store>;
  user: User;
  users: Array<User>;
};


export type QueryGetAddressArgs = {
  ownerId: Scalars['ID']['input'];
  ownerType: AddressOwnerType;
  type: AddressType;
};


export type QueryGetAddressesArgs = {
  ownerId: Scalars['ID']['input'];
  ownerType: AddressOwnerType;
};


export type QueryMyStoresArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  take?: Scalars['Int']['input'];
};


export type QueryStoreArgs = {
  id: Scalars['ID']['input'];
};


export type QueryStoreBySlugArgs = {
  slug: Scalars['String']['input'];
};


export type QueryUserArgs = {
  id: Scalars['String']['input'];
};


export type QueryUsersArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  skip?: Scalars['Int']['input'];
  sortOrder?: InputMaybe<SortOrder>;
  take?: Scalars['Int']['input'];
};

export enum SortOrder {
  Asc = 'ASC',
  Desc = 'DESC'
}

/** Store model */
export type Store = {
  __typename?: 'Store';
  /** Addresses associated with the store */
  addresses?: Maybe<Array<AddressOnOwner>>;
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
  /** URL-friendly slug of the store */
  slug: Scalars['String']['output'];
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

export type UpdateAddressInput = {
  /** Address details */
  address: AddressInput;
  /** Whether this is the default address of this type */
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** ID of the entity that owns the address */
  ownerId: Scalars['ID']['input'];
  /** Type of entity that owns the address */
  ownerType: AddressOwnerType;
  /** Type of address */
  type: AddressType;
};

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

export type UserCreateInput = {
  /** Email of the User */
  email: Scalars['String']['input'];
  /** First name of the User */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** Preferred language for the user interface */
  language?: InputMaybe<Language>;
  /** Last name of the User */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password of the User */
  password?: InputMaybe<Scalars['String']['input']>;
  /** Preferred theme for the user interface */
  theme?: InputMaybe<Theme>;
  /** Preferred timezone (e.g., "Africa/Nairobi") */
  timeZone?: InputMaybe<Scalars['String']['input']>;
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
  AddressOwnerType: AddressOwnerType;
  AddressType: AddressType;
  AuthSignin: ResolverTypeWrapper<AuthSignin>;
  AuthSigninInput: AuthSigninInput;
  AuthSignout: ResolverTypeWrapper<AuthSignout>;
  AuthSignup: ResolverTypeWrapper<AuthSignup>;
  AuthSignupInput: AuthSignupInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  CurrencyPosition: CurrencyPosition;
  DateTime: ResolverTypeWrapper<Scalars['DateTime']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Language: Language;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SortOrder: SortOrder;
  Store: ResolverTypeWrapper<Store>;
  StoreCreateInput: StoreCreateInput;
  StoreCurrency: StoreCurrency;
  StoreType: StoreType;
  StoreUpdateInput: StoreUpdateInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Theme: Theme;
  UnitSystem: UnitSystem;
  UpdateAddressInput: UpdateAddressInput;
  User: ResolverTypeWrapper<User>;
  UserCreateInput: UserCreateInput;
  UserPasswordUpdateInput: UserPasswordUpdateInput;
  UserUpdateInput: UserUpdateInput;
  WeightUnit: WeightUnit;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  Address: Address;
  AddressInput: AddressInput;
  AddressOnOwner: AddressOnOwner;
  AuthSignin: AuthSignin;
  AuthSigninInput: AuthSigninInput;
  AuthSignout: AuthSignout;
  AuthSignup: AuthSignup;
  AuthSignupInput: AuthSignupInput;
  Boolean: Scalars['Boolean']['output'];
  DateTime: Scalars['DateTime']['output'];
  ID: Scalars['ID']['output'];
  Int: Scalars['Int']['output'];
  Mutation: {};
  Query: {};
  Store: Store;
  StoreCreateInput: StoreCreateInput;
  StoreUpdateInput: StoreUpdateInput;
  String: Scalars['String']['output'];
  UpdateAddressInput: UpdateAddressInput;
  User: User;
  UserCreateInput: UserCreateInput;
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
  address?: Resolver<ResolversTypes['Address'], ParentType, ContextType>;
  addressId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
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

export interface DateTimeScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['DateTime'], any> {
  name: 'DateTime';
}

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  createStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationCreateStoreArgs, 'input'>>;
  createUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationCreateUserArgs, 'input'>>;
  deleteAddress?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteAddressArgs, 'ownerId' | 'ownerType' | 'type'>>;
  deleteStore?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationDeleteStoreArgs, 'id'>>;
  refresh?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType>;
  signin?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType, RequireFields<MutationSigninArgs, 'input'>>;
  signout?: Resolver<ResolversTypes['AuthSignout'], ParentType, ContextType>;
  signup?: Resolver<ResolversTypes['AuthSignup'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  updateAddress?: Resolver<ResolversTypes['AddressOnOwner'], ParentType, ContextType, RequireFields<MutationUpdateAddressArgs, 'input'>>;
  updatePassword?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdatePasswordArgs, 'input'>>;
  updateStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationUpdateStoreArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  getAddress?: Resolver<Maybe<ResolversTypes['AddressOnOwner']>, ParentType, ContextType, RequireFields<QueryGetAddressArgs, 'ownerId' | 'ownerType' | 'type'>>;
  getAddresses?: Resolver<Array<ResolversTypes['AddressOnOwner']>, ParentType, ContextType, RequireFields<QueryGetAddressesArgs, 'ownerId' | 'ownerType'>>;
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  myStores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType, RequireFields<QueryMyStoresArgs, 'skip' | 'take'>>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<QueryStoreArgs, 'id'>>;
  storeBySlug?: Resolver<Maybe<ResolversTypes['Store']>, ParentType, ContextType, RequireFields<QueryStoreBySlugArgs, 'slug'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'take'>>;
};

export type StoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = {
  addresses?: Resolver<Maybe<Array<ResolversTypes['AddressOnOwner']>>, ParentType, ContextType>;
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
  slug?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timeZone?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  type?: Resolver<ResolversTypes['StoreType'], ParentType, ContextType>;
  unitSystem?: Resolver<ResolversTypes['UnitSystem'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  weightUnit?: Resolver<ResolversTypes['WeightUnit'], ParentType, ContextType>;
  whatsApp?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
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
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

