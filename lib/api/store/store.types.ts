import { User, Prisma, StoreCurrency, CurrencyPosition } from '@prisma/client';

// Define all possible relations a store can have
export type StoreRelations = {
  owner: User;
};

// Define specific include types for addresses
export type StoreInclude = {
  owner?: boolean;
};

// Helper function to create include object
export const createStoreInclude = (
  options: {
    addresses?: boolean;
    owner?: boolean;
  } = {}
): StoreInclude => ({
  owner: options.owner ?? false,
});

// Default include settings
export const DEFAULT_STORE_INCLUDE: StoreInclude = {
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
