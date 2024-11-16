import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';

import { Customer, SortOrder } from '@/types/api';

interface CustomerFiltersInput {
  searchQuery?: string;
  marketingEmails?: boolean;
  marketingSMS?: boolean;
}

interface UseCustomersProps {
  storeId: string;
  skip?: number;
  take?: number;
  cursor?: string;
  filters?: CustomerFiltersInput;
  sortOrder?: SortOrder;
}

const CUSTOMER_FIELDS = `
  id
  firstName
  lastName
  language
  email
  phoneNumber
  marketingEmails
  marketingSMS
  notes
  storeId
  createdAt
  updatedAt
`;

const FETCH_CUSTOMERS = gql`
  query StoreCustomers(
    $storeId: String!
    $skip: Int
    $take: Int
    $cursor: String
    $sortOrder: SortOrder
  ) {
    storeCustomers(
      storeId: $storeId
      skip: $skip
      take: $take
      cursor: $cursor
      sortOrder: $sortOrder
    ) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const DELETE_CUSTOMER = gql`
  mutation DeleteCustomer($id: ID!) {
    deleteCustomer(id: $id)
  }
`;

export function useCustomers({
  storeId,
  skip = 0,
  take = 25,
  cursor,
  sortOrder,
}: UseCustomersProps) {
  // Fetch customers
  const {
    data,
    loading,
    error: fetchError,
    refetch,
  } = useQuery(FETCH_CUSTOMERS, {
    variables: {
      storeId,
      skip,
      take,
      cursor,
      sortOrder,
    },
    skip: !storeId,
  });

  // Refetch when query parameters change
  useEffect(() => {
    if (storeId) {
      refetch({
        storeId,
        skip,
        take,
        cursor,
        sortOrder,
      });
    }
  }, [storeId, skip, take, cursor, sortOrder, refetch]);

  // Delete customer mutation
  const [deleteCustomer, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_CUSTOMER, {
      refetchQueries: [
        {
          query: FETCH_CUSTOMERS,
          variables: {
            storeId,
            skip,
            take,
            cursor,
            sortOrder,
          },
        },
      ],
    });

  const handleDeleteCustomer = async (id: string) => {
    try {
      const response = await deleteCustomer({
        variables: { id },
      });
      return response.data.deleteCustomer;
    } catch (err) {
      console.error('Error deleting customer:', err);
      throw err;
    }
  };

  return {
    customers: (data?.storeCustomers || []) as Customer[],
    loading,
    deleting,
    fetchError,
    deleteError,
    deleteCustomer: handleDeleteCustomer,
    refetch,
  };
}
