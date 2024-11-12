import { gql, useMutation, useQuery } from '@apollo/client';

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
      categories{
        id
        name
        slug
        description
        updatedAt
        createdAt
      }
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
  const { loading, error: loadingError, data } = useQuery(FETCH_STORE_QUERY);
  const [updateStore, { loading: updatingStore, error: updateError }] =
    useMutation(UPDATE_STORE, {
      refetchQueries: [FETCH_STORE_QUERY],
    });
  const [
    updateStoreAddress,
    { loading: updatingStoreAddress, error: updateAddressError },
  ] = useMutation(UPDATE_ADDRESS, {
    refetchQueries: [FETCH_STORE_QUERY],
  });

  return {
    store: data?.myStores?.[0],
    loading,
    updating: updatingStore || updatingStoreAddress,
    error: loadingError || updateError || updateAddressError,
    updateStore,
    updateStoreAddress,
  };
}
