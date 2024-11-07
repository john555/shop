export type StoreProfile = {
  name: string;
  phone: string;
  email: string;
  whatsApp: string;
  facebook: string;
  instagram: string;
};

export type OrderId = {
  prefix: string;
  suffix: string;
};

export type StoreDefaults = {
  currency: string;
  currencySymbol: string;
  currencyPosition: 'before' | 'after';
  showCurrencyCode: boolean;
  unitSystem: 'metric' | 'imperial';
  weightUnit: 'kg' | 'g' | 'lb' | 'oz';
  timeZone: string;
};

export type Address = {
  country: string;
  state: string;
  city: string;
  line1: string;
  line2: string;
  zipCode: string;
};
