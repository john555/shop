import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { client } from 'lib/utils/apollo';
import { User } from '@/lib/common/types/api';

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      firstName
      lastName
      imageUrl
      updatedAt
    }
  }
`;

const SIGNOUT_MUTATION = gql`
  mutation signout {
    signout {
      success
    }
  }
`;

const getUser = async (): Promise<User | null> => {
  const { data } = await client.query<{ me: User | null }>({
    query: ME_QUERY,
  });
  return data?.me;
};

export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    getUser()
      .then((user) => {
        setUser(user);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const signOut = async () => {
    await client.mutate({
      mutation: SIGNOUT_MUTATION,
    });
    setUser(null);
    window.location.href = '/auth/signin';
  };

  return { user, isLoading, signOut };
}