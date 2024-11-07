'use client';

import { useState, useCallback, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { StoreDetailsCard } from './(components)/store-details-card';
import { StoreDefaultsCard } from './(components)/store-defaults-card';
import { OrderIdCard } from './(components)/order-id-card';
import { EditProfileDialog } from './(components)/edit-profile-dialog';
import { EditAddressDialog } from './(components)/edit-address-dialog';
import { EditSocialMediaDialog } from './(components)/edit-social-media-dialog';
import { storeSettingsSchema } from './(libs)/schemas';
import { useStoreSettings } from './(libs)/hooks';

export default function StoreSettingsPage() {
  const {
    storeProfile,
    setStoreProfile,
    address,
    setAddress,
    storeDefaults,
    setStoreDefaults,
    orderId,
    setOrderId,
    hasChanges,
    setHasChanges,
    changedFields,
    setChangedFields,
  } = useStoreSettings();

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
  const [isEditSocialMediaDialogOpen, setIsEditSocialMediaDialogOpen] =
    useState(false);

  const methods = useForm<z.infer<typeof storeSettingsSchema>>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      ...storeDefaults,
      orderIdPrefix: orderId.prefix,
      orderIdSuffix: orderId.suffix,
    },
    mode: 'onBlur',
  });

  const handleOrderIdInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setOrderId((prev) => ({ ...prev, [id]: value }));
      setChangedFields((prev) => ({ ...prev, [id]: value }));
      setHasChanges(true);
    },
    [setOrderId, setChangedFields, setHasChanges]
  );

  const handleUnitSystemChange = (value: 'metric' | 'imperial') => {
    const defaultWeightUnit = value === 'metric' ? 'kg' : 'lb';
    setStoreDefaults((prev) => ({
      ...prev,
      unitSystem: value,
      weightUnit: defaultWeightUnit,
    }));
    setChangedFields((prev) => ({
      ...prev,
      unitSystem: value,
      weightUnit: defaultWeightUnit,
    }));
    setHasChanges(true);
    methods.setValue('unitSystem', value, { shouldValidate: true });
    methods.setValue('weightUnit', defaultWeightUnit, { shouldValidate: true });
    methods.trigger('weightUnit');
  };

  useEffect(() => {
    if (
      storeDefaults.unitSystem === 'metric' &&
      !['kg', 'g'].includes(storeDefaults.weightUnit)
    ) {
      handleUnitSystemChange('metric');
    } else if (
      storeDefaults.unitSystem === 'imperial' &&
      !['lb', 'oz'].includes(storeDefaults.weightUnit)
    ) {
      handleUnitSystemChange('imperial');
    }
  }, [storeDefaults.unitSystem, storeDefaults.weightUnit]);

  const onSubmit = (data: z.infer<typeof storeSettingsSchema>) => {
    setStoreDefaults({
      currency: data.currency,
      currencySymbol: data.currencySymbol,
      currencyPosition: data.currencyPosition,
      showCurrencyCode: data.showCurrencyCode,
      unitSystem: data.unitSystem,
      weightUnit: data.weightUnit,
      timeZone: data.timeZone,
    });
    setOrderId({
      prefix: data.orderIdPrefix,
      suffix: data.orderIdSuffix || '',
    });
    setChangedFields({});
    setHasChanges(false);
    // Here you would typically send the data to your backend
    console.log('Submitting changes:', data);
  };

  const handleSaveChanges = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      methods.handleSubmit((data) => {
        onSubmit(data);
        setChangedFields({});
        setHasChanges(false);
      })();
    },
    [methods, onSubmit, setChangedFields, setHasChanges]
  );

  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="container max-w-3xl mx-auto px-4 py-2 relative pb-16"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-semibold">General</h1>
          </div>

          <div className="space-y-4">
            <StoreDetailsCard
              storeProfile={storeProfile}
              address={{ ...address, line2: address.line2 || '' }}
              onEditProfile={() => setIsEditProfileDialogOpen(true)}
              onEditAddress={() => setIsEditAddressDialogOpen(true)}
              onEditSocialMedia={() => setIsEditSocialMediaDialogOpen(true)}
            />
            <StoreDefaultsCard
              storeDefaults={storeDefaults}
              setStoreDefaults={setStoreDefaults}
              setChangedFields={setChangedFields}
              setHasChanges={setHasChanges}
              handleUnitSystemChange={handleUnitSystemChange}
            />
            <OrderIdCard
              orderId={orderId}
              handleOrderIdInputChange={handleOrderIdInputChange}
            />
          </div>
        </form>
      </FormProvider>

      <EditProfileDialog
        isOpen={isEditProfileDialogOpen}
        onOpenChange={setIsEditProfileDialogOpen}
        storeProfile={storeProfile}
        setStoreProfile={setStoreProfile}
        setChangedFields={setChangedFields}
        setHasChanges={setHasChanges}
      />

      <EditAddressDialog
        isOpen={isEditAddressDialogOpen}
        onOpenChange={setIsEditAddressDialogOpen}
        address={{ ...address, line2: address.line2 || '' }}
        setAddress={setAddress}
        setChangedFields={setChangedFields}
        setHasChanges={setHasChanges}
      />

      <EditSocialMediaDialog
        isOpen={isEditSocialMediaDialogOpen}
        onOpenChange={setIsEditSocialMediaDialogOpen}
        storeProfile={storeProfile}
        setStoreProfile={setStoreProfile}
        setChangedFields={setChangedFields}
        setHasChanges={setHasChanges}
      />

      {hasChanges && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md p-4 flex justify-end items-center z-50">
          <Button type="button" onClick={handleSaveChanges}>
            Save Changes
          </Button>
        </div>
      )}
    </>
  );
}
