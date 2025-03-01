import { useState, useEffect } from 'react';
import { gql } from '@apollo/client';
import { client } from '@/common/apollo';
import { User } from '@/types/admin-api';
import { SIGNIN_PAGE_LINK } from '@/common/constants';

const ME_QUERY = gql`
  query me {
    me {
      id
      email
      firstName
      lastName
      updatedAt
      language
      timeZone
      theme
      stores {
        id
      }
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
      .catch((error) => {
        // show a toast
        console.error('Error fetching user:', error);
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
    window.location.href = SIGNIN_PAGE_LINK;
  };

  return { user, isLoading, signOut };
}
