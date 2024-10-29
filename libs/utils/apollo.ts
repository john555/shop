import {
  ApolloClient,
  InMemoryCache,
  from,
  HttpLink,
  Observable,
  FetchResult,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { gql } from '@apollo/client';

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!graphqlUrl) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_URL is not set');
}

interface RefreshResponse {
  refresh: {
    accessToken: string;
    refreshToken: string;
  };
}

const REFRESH_MUTATION = gql`
  mutation refresh {
    refresh {
      accessToken
      refreshToken
    }
  }
`;

// Create the http link
const httpLink = new HttpLink({
  uri: graphqlUrl,
  credentials: 'include', // This ensures cookies are sent with requests
});

let isRefreshing = false;
const pendingRequests: Array<() => void> = [];

// Error handling link for token refresh
const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (!graphQLErrors) return undefined;

  // Move this logic outside the loop to avoid closure issues
  const handleUnauthenticated = () => {
    if (!isRefreshing) {
      isRefreshing = true;

      return new Observable<FetchResult>((observer) => {
        client
          .mutate<RefreshResponse>({
            mutation: REFRESH_MUTATION,
          })
          .then(() => {
            isRefreshing = false;
            pendingRequests.forEach((callback) => callback());
            pendingRequests.length = 0;
            forward(operation).subscribe(observer);
          })
          .catch(() => {
            isRefreshing = false;
            pendingRequests.length = 0;
            window.location.href = '/login';
          });
      });
    }

    return new Observable<FetchResult>((observer) => {
      pendingRequests.push(() => forward(operation).subscribe(observer));
    });
  };

  for (const err of graphQLErrors) {
    if (
      err.extensions?.code === 'UNAUTHENTICATED' &&
      !operation.operationName?.includes('refresh')
    ) {
      return handleUnauthenticated();
    }
  }
});

// Create Apollo Client with error handling
export const client = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});
