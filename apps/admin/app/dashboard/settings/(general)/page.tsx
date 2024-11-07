'use client';

import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { StoreDetailsCard } from './(components)/store-details-card';
import { StoreDefaultsCard } from './(components)/store-defaults-card';
import { OrderIdCard } from './(components)/order-id-card';
import { useStore } from '@/admin/hooks/store/use-store';
import { CurrencyPosition, Store, UnitSystem, WeightUnit } from '@/types/api';
import { Form } from '@/components/ui/form';

export const storeSettingsSchema = z.object({
  currency: z.string().min(1, 'Currency is required'),
  currencySymbol: z.string().min(1, 'Currency symbol is required'),
  currencyPosition: z.nativeEnum(CurrencyPosition, {
    required_error: 'Currency position is required',
  }),
  showCurrencyCode: z.boolean(),
  unitSystem: z.nativeEnum(UnitSystem, {
    required_error: 'Unit system is required',
  }),
  weightUnit: z.nativeEnum(WeightUnit, {
    required_error: 'Weight unit is required',
  }),
  timeZone: z.string().min(1, 'Time zone is required'),
  orderPrefix: z.string().min(1, 'Order ID prefix is required'),
  orderSuffix: z.string().optional(),
});

export default function StoreSettingsPage() {
  const { store, updating, updateStore } = useStore();

  const form = useForm<z.infer<typeof storeSettingsSchema>>({
    resolver: zodResolver(storeSettingsSchema),
    mode: 'onBlur',
  });

  const hasChanges =
    form.formState.dirtyFields &&
    Object.keys(form.formState.dirtyFields).length > 0;

  useEffect(() => {
    if (store) {
      resetForm(store);
    }
  }, [form, store]);

  const resetForm = (store: Store) => {
    form.reset({
      currency: store.currency,
      currencySymbol: store.currencySymbol || '',
      currencyPosition: store.currencyPosition || '',
      showCurrencyCode: store.showCurrencyCode,
      unitSystem: store.unitSystem,
      weightUnit: store.weightUnit,
      timeZone: store.timeZone,
      orderPrefix: store.orderPrefix || '',
      orderSuffix: store.orderSuffix || '',
    });
  };

  const handleSaveChanges = useCallback(async () => {
    if (!store?.id) return;
    const changedFields = form.formState.dirtyFields;
    const values = form.getValues();
    const changes = Object.keys(changedFields).reduce((acc, key: any) => {
      // @ts-ignore-next-line
      acc[key] = values[key];
      return acc;
    }, {});
    const updatedStore = await updateStore({ id: store.id, ...changes });
    resetForm(updatedStore);
  }, [form, store]);

  return (
    <>
      <div className="container max-w-3xl mx-auto px-4 py-2 relative pb-16">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">General</h1>
        </div>

        <Form {...form}>
          <div className="space-y-4">
            <StoreDetailsCard />
            <StoreDefaultsCard />
            <OrderIdCard />
          </div>
        </Form>
      </div>

      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md p-4 flex justify-end items-center z-50">
          <Button type="button" onClick={handleSaveChanges} disabled={updating}>
            {updating ? 'Saving Changes..' : 'Save Changes'}
          </Button>
        </div>
      )}
    </>
  );
}
