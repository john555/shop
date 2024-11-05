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

/** Position of currency symbol */
export enum CurrencyPosition {
  AfterAmount = 'AFTER_AMOUNT',
  BeforeAmount = 'BEFORE_AMOUNT'
}

export type Mutation = {
  __typename?: 'Mutation';
  createStore: Store;
  createUser: User;
  /** Refresh auth token */
  refresh: AuthSignin;
  /** Sign in */
  signin: AuthSignin;
  /** Sign out */
  signout: AuthSignout;
  /** Sign up new user */
  signup: AuthSignup;
  updateStore: Store;
  updateUser: User;
};


export type MutationCreateStoreArgs = {
  input: StoreCreateInput;
};


export type MutationCreateUserArgs = {
  input: UserCreateInput;
};


export type MutationSigninArgs = {
  input: AuthSigninInput;
};


export type MutationSignupArgs = {
  input: AuthSignupInput;
};


export type MutationUpdateStoreArgs = {
  input: StoreUpdateInput;
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type Query = {
  __typename?: 'Query';
  /** Get current user */
  me: User;
  myStores: Array<Store>;
  store: Store;
  user: User;
  users: Array<User>;
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

/** store */
export type Store = {
  __typename?: 'Store';
  /** Date the Store was created */
  createdAt: Scalars['DateTime']['output'];
  /** Currency of the Store */
  currency: StoreCurrency;
  /** Position of currency symbol */
  currencyPosition: CurrencyPosition;
  /** Custom currency symbol */
  currencySymbol?: Maybe<Scalars['String']['output']>;
  /** Email of the Store */
  email: Scalars['String']['output'];
  /** Facebook page of the Store */
  facebook?: Maybe<Scalars['String']['output']>;
  /** ID of the Store */
  id: Scalars['ID']['output'];
  /** Instagram handle of the Store */
  instagram?: Maybe<Scalars['String']['output']>;
  /** Name of the Store */
  name: Scalars['String']['output'];
  /** Order number prefix */
  orderPrefix?: Maybe<Scalars['String']['output']>;
  /** Order number suffix */
  orderSuffix?: Maybe<Scalars['String']['output']>;
  /** ID of the User who owns the store */
  ownerId: Scalars['String']['output'];
  /** Phone number of the Store */
  phone?: Maybe<Scalars['String']['output']>;
  /** Whether to show currency code */
  showCurrencyCode: Scalars['Boolean']['output'];
  /** Slug of the Store */
  slug: Scalars['String']['output'];
  /** Timezone of the Store */
  timeZone: Scalars['String']['output'];
  /** Type of the Store */
  type: StoreType;
  /** Measurement system */
  unitSystem: UnitSystem;
  /** Date the Store was last updated */
  updatedAt: Scalars['DateTime']['output'];
  /** Weight unit */
  weightUnit: WeightUnit;
  /** WhatsApp number of the Store */
  whatsApp?: Maybe<Scalars['String']['output']>;
};

export type StoreCreateInput = {
  /** Currency of the Store */
  currency: StoreCurrency;
  /** Position of currency symbol */
  currencyPosition?: InputMaybe<CurrencyPosition>;
  /** Custom currency symbol. If not provided, defaults will be used based on currency. */
  currencySymbol?: InputMaybe<Scalars['String']['input']>;
  /** Facebook page username/handle */
  facebook?: InputMaybe<Scalars['String']['input']>;
  /** Instagram handle (without @) */
  instagram?: InputMaybe<Scalars['String']['input']>;
  /** Name of the Store */
  name: Scalars['String']['input'];
  /** Prefix for order numbers */
  orderPrefix?: InputMaybe<Scalars['String']['input']>;
  /** Suffix for order numbers */
  orderSuffix?: InputMaybe<Scalars['String']['input']>;
  /** Phone number of the Store */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Whether to show currency code */
  showCurrencyCode?: InputMaybe<Scalars['Boolean']['input']>;
  /** Slug of the Store */
  slug: Scalars['String']['input'];
  /** Timezone for the store */
  timeZone?: InputMaybe<Scalars['String']['input']>;
  /** Type of the Store */
  type: StoreType;
  /** Unit system for measurements */
  unitSystem?: InputMaybe<UnitSystem>;
  /** Weight unit for products */
  weightUnit?: InputMaybe<WeightUnit>;
  /** WhatsApp business number */
  whatsApp?: InputMaybe<Scalars['String']['input']>;
};

/** The currency of store */
export enum StoreCurrency {
  Bif = 'BIF',
  Kes = 'KES',
  Rwf = 'RWF',
  Ssp = 'SSP',
  Tzs = 'TZS',
  Ugx = 'UGX'
}

/** The type of store */
export enum StoreType {
  PhysicalGoods = 'PHYSICAL_GOODS',
  RealEstate = 'REAL_ESTATE',
  Vehicles = 'VEHICLES'
}

export type StoreUpdateInput = {
  /** Position of currency symbol */
  currencyPosition?: InputMaybe<CurrencyPosition>;
  /** Custom currency symbol. Set to null to use currency defaults. */
  currencySymbol?: InputMaybe<Scalars['String']['input']>;
  /** Facebook page username/handle */
  facebook?: InputMaybe<Scalars['String']['input']>;
  /** ID of the Store */
  id: Scalars['ID']['input'];
  /** Instagram handle (without @) */
  instagram?: InputMaybe<Scalars['String']['input']>;
  /** Name of the Store */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Prefix for order numbers */
  orderPrefix?: InputMaybe<Scalars['String']['input']>;
  /** Suffix for order numbers */
  orderSuffix?: InputMaybe<Scalars['String']['input']>;
  /** Phone number of the Store */
  phone?: InputMaybe<Scalars['String']['input']>;
  /** Whether to show currency code */
  showCurrencyCode?: InputMaybe<Scalars['Boolean']['input']>;
  /** Slug of the Store */
  slug?: InputMaybe<Scalars['String']['input']>;
  /** Timezone for the store */
  timeZone?: InputMaybe<Scalars['String']['input']>;
  /** Unit system for measurements */
  unitSystem?: InputMaybe<UnitSystem>;
  /** Weight unit for products */
  weightUnit?: InputMaybe<WeightUnit>;
  /** WhatsApp business number */
  whatsApp?: InputMaybe<Scalars['String']['input']>;
};

/** Measurement system used by the store */
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
  /** URL of the User image */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Last name of the User */
  lastName?: Maybe<Scalars['String']['output']>;
  /** Stores owned by the User */
  stores: Array<Store>;
  /** Date the User was last updated */
  updatedAt: Scalars['DateTime']['output'];
};

export type UserCreateInput = {
  /** Email of the User */
  email: Scalars['String']['input'];
  /** First name of the User */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** URL of the User image */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Last name of the User */
  lastName?: InputMaybe<Scalars['String']['input']>;
  /** Password of the User */
  password?: InputMaybe<Scalars['String']['input']>;
};

export type UserUpdateInput = {
  /** First name of the User */
  firstName?: InputMaybe<Scalars['String']['input']>;
  /** ID of the User */
  id: Scalars['String']['input'];
  /** URL of the User image */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Last name of the User */
  lastName?: InputMaybe<Scalars['String']['input']>;
};

/** Weight unit used by the store */
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
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  SortOrder: SortOrder;
  Store: ResolverTypeWrapper<Store>;
  StoreCreateInput: StoreCreateInput;
  StoreCurrency: StoreCurrency;
  StoreType: StoreType;
  StoreUpdateInput: StoreUpdateInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  UnitSystem: UnitSystem;
  User: ResolverTypeWrapper<User>;
  UserCreateInput: UserCreateInput;
  UserUpdateInput: UserUpdateInput;
  WeightUnit: WeightUnit;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
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
  User: User;
  UserCreateInput: UserCreateInput;
  UserUpdateInput: UserUpdateInput;
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
  refresh?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType>;
  signin?: Resolver<ResolversTypes['AuthSignin'], ParentType, ContextType, RequireFields<MutationSigninArgs, 'input'>>;
  signout?: Resolver<ResolversTypes['AuthSignout'], ParentType, ContextType>;
  signup?: Resolver<ResolversTypes['AuthSignup'], ParentType, ContextType, RequireFields<MutationSignupArgs, 'input'>>;
  updateStore?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<MutationUpdateStoreArgs, 'input'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  me?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  myStores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType, RequireFields<QueryMyStoresArgs, 'skip' | 'take'>>;
  store?: Resolver<ResolversTypes['Store'], ParentType, ContextType, RequireFields<QueryStoreArgs, 'id'>>;
  user?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<QueryUserArgs, 'id'>>;
  users?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryUsersArgs, 'skip' | 'take'>>;
};

export type StoreResolvers<ContextType = any, ParentType extends ResolversParentTypes['Store'] = ResolversParentTypes['Store']> = {
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
  imageUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  lastName?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  stores?: Resolver<Array<ResolversTypes['Store']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['DateTime'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type Resolvers<ContextType = any> = {
  AuthSignin?: AuthSigninResolvers<ContextType>;
  AuthSignout?: AuthSignoutResolvers<ContextType>;
  AuthSignup?: AuthSignupResolvers<ContextType>;
  DateTime?: GraphQLScalarType;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Store?: StoreResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
};

