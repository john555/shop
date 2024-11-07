import { useState, useCallback } from 'react';
import { StoreProfile, Address, StoreDefaults, OrderId } from '../(libs)/types';
import { addressSchema } from './schemas';
import { z } from 'zod';

export function useStoreSettings() {
  const [storeProfile, setStoreProfile] = useState<StoreProfile>({
    name: 'Kampala Crafts',
    phone: '+256 700 123456',
    email: 'info@kampalacrafts.ug',
    whatsApp: '+256 700 123456',
    facebook: 'kampalacraftsug',
    instagram: '@kampalacrafts',
  });

  const [orderId, setOrderId] = useState<OrderId>({ prefix: '#', suffix: '' });

  const [storeDefaults, setStoreDefaults] = useState<StoreDefaults>({
    currency: 'UGX',
    currencySymbol: 'USh',
    currencyPosition: 'before',
    showCurrencyCode: true,
    unitSystem: 'metric',
    weightUnit: 'kg',
    timeZone: 'eat',
  });

  const [address, setAddress] = useState<z.infer<typeof addressSchema>>({
    country: 'Uganda',
    state: 'Central Region',
    city: 'Kampala',
    line1: '123 Main St',
    line2: 'Suite 456',
    zipCode: '00256',
  });

  const [hasChanges, setHasChanges] = useState(false);
  const [changedFields, setChangedFields] = useState<Record<string, any>>({});

  const handleOrderIdInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { id, value } = e.target;
      setOrderId((prev) => ({ ...prev, [id]: value }));
      setChangedFields((prev) => ({ ...prev, [id]: value }));
      setHasChanges(true);
    },
    []
  );

  const handleUnitSystemChange = useCallback((value: 'metric' | 'imperial') => {
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
  }, []);

  const updateStoreProfile = useCallback(
    (newProfile: Partial<StoreProfile>) => {
      setStoreProfile((prev) => ({ ...prev, ...newProfile }));
      setChangedFields((prev) => ({ ...prev, ...newProfile }));
      setHasChanges(true);
    },
    []
  );

  const updateAddress = useCallback(
    (newAddress: Partial<z.infer<typeof addressSchema>>) => {
      setAddress((prev: z.infer<typeof addressSchema>) => ({
        ...prev,
        ...newAddress,
      }));
      setChangedFields((prev) => ({ ...prev, ...newAddress }));
      setHasChanges(true);
    },
    []
  );

  const updateStoreDefaults = useCallback(
    (newDefaults: Partial<StoreDefaults>) => {
      setStoreDefaults((prev) => ({ ...prev, ...newDefaults }));
      setChangedFields((prev) => ({ ...prev, ...newDefaults }));
      setHasChanges(true);
    },
    []
  );

  const resetChanges = useCallback(() => {
    setChangedFields({});
    setHasChanges(false);
  }, []);

  return {
    storeProfile,
    setStoreProfile,
    orderId,
    setOrderId,
    storeDefaults,
    setStoreDefaults,
    address,
    setAddress,
    hasChanges,
    setHasChanges,
    changedFields,
    setChangedFields,
    handleOrderIdInputChange,
    handleUnitSystemChange,
    updateStoreProfile,
    updateAddress,
    updateStoreDefaults,
    resetChanges,
  };
}
