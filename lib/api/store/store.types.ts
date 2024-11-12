import { User, Prisma, StoreCurrency, CurrencyPosition } from '@prisma/client';

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
