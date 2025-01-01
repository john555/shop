import { Store } from '@/types/admin-api';
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
      slug
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
      categories {
        id
        name
        slug
        description
        children {
          id
          name
          slug
          description
          children {
            id
            name
            slug
            description
            children {
              id
              name
              slug
              description
            }
          }
        }
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

export function useStore() {
  const {
    loading,
    error: loadingError,
    data,
    refetch: refetchStore,
  } = useQuery(FETCH_STORE_QUERY);
  const [updateStore, { loading: updatingStore, error: updateError }] =
    useMutation(UPDATE_STORE, {
      refetchQueries: [FETCH_STORE_QUERY],
    });

  return {
    store: data?.myStores?.[0] as Store,
    loading,
    updating: updatingStore,
    error: loadingError || updateError,
    updateStore,
    refetchStore,
  };
}
