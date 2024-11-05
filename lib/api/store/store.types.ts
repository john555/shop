import {
  Store,
  Address,
  AddressOnOwner,
  User,
  Prisma,
  StoreCurrency,
  CurrencyPosition,
} from '@prisma/client';

// Define the shape of address with relations
type AddressWithRelations = AddressOnOwner & {
  address: Address;
};

// Define all possible relations a store can have
export type StoreRelations = {
  addresses: AddressWithRelations[];
  owner: User;
};

// Base store type with all relations optional
export type StoreWithRelations = Store & Partial<StoreRelations>;

// Define specific include types for addresses
export type StoreInclude = {
  addresses?: {
    include: {
      address: true;
    };
  };
  owner?: boolean;
};

// Helper function to create include object
export const createStoreInclude = (
  options: {
    addresses?: boolean;
    owner?: boolean;
  } = {}
): StoreInclude => ({
  addresses: options.addresses
    ? {
        include: {
          address: true,
        },
      }
    : undefined,
  owner: options.owner ?? false,
});

// Default include settings
export const DEFAULT_STORE_INCLUDE: StoreInclude = {
  addresses: {
    include: {
      address: true,
    },
  },
  owner: false,
};

// Type for create input
export type StoreCreateData = Omit<
  Prisma.StoreUncheckedCreateInput,
  'addresses' | 'createdAt' | 'updatedAt'
>;

export type StoreUpdateData = Omit<
  Prisma.StoreUncheckedUpdateInput,
  'addresses' | 'createdAt' | 'updatedAt' | 'currency'
> & {
  currency?: StoreCurrency;
  currencySymbol?: string | null;
  currencyPosition?: CurrencyPosition;
};

// Type for currency settings update
export type StoreCurrencySettings = {
  currency?: StoreCurrency;
  currencySymbol?: string | null;
  currencyPosition?: CurrencyPosition;
  showCurrencyCode?: boolean;
};