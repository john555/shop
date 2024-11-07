import { useEffect, useState } from 'react';
import { gql } from '@apollo/client';
import { client } from '@/common/apollo';
import {
  AddressOwnerType,
  AddressType,
  Store,
  StoreUpdateInput,
  UpdateAddressInput,
} from '@/types/api';

const UPDATE_STORE = gql`
  mutation UpdateStore($input: StoreUpdateInput!) {
    updateStore(input: $input) {
      id
      name
      email
      phone
      facebook
      instagram
      whatsApp
      currency
      currencyPosition
      currencySymbol
      showCurrencyCode
      timeZone
      unitSystem
      weightUnit
      orderPrefix
      orderSuffix
      addresses {
        id
        type
        ownerId
        ownerType
        isDefault
        address {
          id
          country
          city
          state
          line1
          line2
          zipCode
          updatedAt
          createdAt
        }
      }
    }
  }
`;

const FETCH_STORE_QUERY = gql`
  query myStores {
    myStores {
      id
      name
      email
      phone
      facebook
      instagram
      whatsApp
      currency
      currencyPosition
      currencySymbol
      showCurrencyCode
      timeZone
      unitSystem
      weightUnit
      orderPrefix
      orderSuffix
      addresses {
        id
        type
        ownerId
        ownerType
        isDefault
        address {
          id
          country
          city
          state
          line1
          line2
          zipCode
          updatedAt
          createdAt
        }
      }
    }
  }
`;

const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($input: UpdateAddressInput!) {
    updateAddress(input: $input) {
      id
      isDefault
      type
      ownerId
      ownerType
      address {
        id
        country
        state
        city
        line1
        line2
        zipCode
      }
    }
  }
`;

export function useStore() {
  const [store, setStore] = useState<Store | undefined>();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const updateStore = async (input: StoreUpdateInput) => {
    try {
      setUpdating(true);
      setError(null);

      const { data, errors } = await client.mutate({
        mutation: UPDATE_STORE,
        variables: { input },
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      const updatedStore = data.updateStore;
      setStore((prev) => ({ ...prev, ...updatedStore }));
      return updatedStore;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
      throw err;
    } finally {
      setUpdating(false);
    }
  };

  const fetchMyStores = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, errors } = await client.query({
        query: FETCH_STORE_QUERY,
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      const fetchedStore: Store = data.myStores[0];
      setStore(fetchedStore);
      return fetchedStore;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setLoading(false);
    }
  };

  const updateStoreAddress = async (input: UpdateAddressInput) => {
    try {
      setUpdating(true);
      setError(null);

      const { data, errors } = await client.mutate({
        mutation: UPDATE_ADDRESS,
        variables: {
          input,
        },
      });

      if (errors) {
        throw new Error(errors[0].message);
      }

      const updatedStore = data.updateStore;
      setStore(updatedStore);
      return updatedStore;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred'));
    } finally {
      setUpdating(false);
    }
  };

  useEffect(() => {
    fetchMyStores();
  }, []);

  return { store, loading, updating, error, updateStore, updateStoreAddress };
}
