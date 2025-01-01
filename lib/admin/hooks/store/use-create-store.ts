import { useState } from 'react';
import { gql } from '@apollo/client';
import { client } from '@/common/apollo';
import { StoreCreateInput, Store } from '@/types/admin-api';

// GraphQL Queries and Mutations
const CREATE_STORE_MUTATION = gql`
  mutation CreateStore($input: StoreCreateInput!) {
    createStore(input: $input) {
      id
      name
      email
      currency
      type
      slug
      ownerId
      createdAt
      updatedAt
    }
  }
`;

// Hook for creating a store
export function useCreateStore() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const createStore = async (input: StoreCreateInput): Promise<Store> => {
    setIsSuccessful(false)
    setIsLoading(true);
    setError(null);

    try {
      const { data } = await client.mutate<{ createStore: Store }>({
        mutation: CREATE_STORE_MUTATION,
        variables: { input },
      });
      setIsSuccessful(true);
      return data!.createStore;
    } catch (err) {
      setError(err as Error);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { createStore, isLoading, isSuccessful, error };
}