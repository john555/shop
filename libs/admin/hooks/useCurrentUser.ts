import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { client } from '@/utils/apollo';
import { cache } from 'react';

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

const getUser = cache(async () => {
  const { data } = await client.query({
    query: ME_QUERY,
  });
  return data?.me;
});

export function useCurrentUser() {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

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