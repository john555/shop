import { Customer, CustomerCreateInput } from '@/types/api';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';

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

const GET_CUSTOMER = gql`
  query GetCustomer($id: ID!) {
    customer(id: $id) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const CREATE_CUSTOMER = gql`
  mutation CreateCustomer($input: CustomerCreateInput!) {
    createCustomer(input: $input) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($input: CustomerUpdateInput!) {
    updateCustomer(input: $input) {
      ${CUSTOMER_FIELDS}
    }
  }
`;

interface UseCustomerProps {
  id?: string;
  storeId: string;
}

export function useCustomer({ id, storeId }: UseCustomerProps) {
  // Fetch customer data if ID is provided
  const {
    data,
    loading,
    error: fetchError,
    refetch: refetchCustomer,
  } = useQuery(GET_CUSTOMER, {
    variables: { id },
    skip: !id,
  });

  // Create customer mutation
  const [createCustomer, { loading: creating, error: createError }] =
    useMutation(CREATE_CUSTOMER);

  // Update customer mutation
  const [updateCustomer, { loading: updating, error: updateError }] =
    useMutation(UPDATE_CUSTOMER, {
      refetchQueries: [
        {
          query: GET_CUSTOMER,
          variables: { id },
        },
      ],
    });

  // Refetch customer data when ID changes
  useEffect(() => {
    if (id) {
      refetchCustomer({ id });
    }
  }, [id, refetchCustomer]);

  const handleCreateCustomer = async (
    input: Omit<CustomerCreateInput, 'storeId'>
  ) => {
    try {
      const response = await createCustomer({
        variables: {
          input: {
            ...input,
            storeId,
          },
        },
      });
      return response.data.createCustomer;
    } catch (err) {
      console.error('Error creating customer:', err);
      throw err;
    }
  };

  const handleUpdateCustomer = async (input: Partial<CustomerCreateInput>) => {
    if (!id) {
      throw new Error('Cannot update customer without ID');
    }

    try {
      const response = await updateCustomer({
        variables: {
          input: {
            id,
            ...input,
          },
        },
      });
      return response.data.updateCustomer;
    } catch (err) {
      console.error('Error updating customer:', err);
      throw err;
    }
  };

  return {
    customer: data?.customer as Customer | undefined,
    loading,
    creating,
    updating,
    fetchError,
    createError,
    updateError,
    createCustomer: handleCreateCustomer,
    updateCustomer: handleUpdateCustomer,
    refetch: refetchCustomer,
  };
}
