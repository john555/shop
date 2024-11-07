import { z } from 'zod';

export const storeProfileSchema = z.object({
  name: z.string().min(1, 'Store name is required'),
  phone: z.string().min(1, 'Phone number is required'),
  email: z.string().email('Invalid email address'),
});

export const addressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State/Province/Region is required'),
  city: z.string().min(1, 'City/Town/Municipality is required'),
  line1: z.string().min(1, 'Street address is required'),
  line2: z.string().optional(),
  zipCode: z.string().min(1, 'Postal/ZIP code is required'),
});

export const storeSettingsSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  currencyPosition: z.enum(['before', 'after'], {
    required_error: 'Currency position is required',
  }),
  showCurrencyCode: z.boolean(),
  unitSystem: z.enum(['metric', 'imperial'], {
    required_error: 'Unit system is required',
  }),
  weightUnit: z.enum(['kg', 'g', 'lb', 'oz'], {
    required_error: 'Weight unit is required',
  }),
  timeZone: z.string().min(1, 'Time zone is required'),
  orderIdPrefix: z.string().min(1, 'Order ID prefix is required'),
  orderIdSuffix: z.string().optional(),
});
