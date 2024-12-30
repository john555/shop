import {
  ApolloClient,
  InMemoryCache,
  from,
  ApolloLink,
  Observable,
  Operation,
  FetchResult,
  gql,
} from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { print } from 'graphql';

const graphqlUrl = process.env.NEXT_PUBLIC_GRAPHQL_URL;

if (!graphqlUrl) {
  throw new Error('NEXT_PUBLIC_GRAPHQL_URL is not set');
}

interface RefreshResponse {
  data: {
    refresh: {
      accessToken: string;
      refreshToken: string;
    };
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

// Custom link that handles multipart file uploads
class MultipartLink extends ApolloLink {
  private getCommonHeaders(operation: Operation): Record<string, string> {
    return {
      Accept: 'application/json',
      'Apollo-Require-Preflight': 'true',
      'X-Apollo-Operation-Name': operation.operationName || '',
    };
  }

  public request(operation: Operation): Observable<FetchResult> {
    return new Observable((observer) => {
      const hasFiles = this.hasUploadFiles(operation);
      const body = hasFiles
        ? this.createUploadBody(operation)
        : this.createRegularBody(operation);
      const headers = hasFiles
        ? this.getCommonHeaders(operation)
        : {
            ...this.getCommonHeaders(operation),
            'Content-Type': 'application/json',
          };

      fetch(graphqlUrl, {
        method: 'POST',
        headers,
        credentials: 'include',
        body,
      })
        .then((response) => response.json())
        .then((result) => {
          // Check for both GraphQL and network errors
          if (result.errors?.length) {
            const error = new Error(result.errors[0].message);
            error.name = 'GraphQLError';
            // @ts-ignore
            error.graphQLErrors = result.errors;
            throw error;
          }
          observer.next(result);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }

  private hasUploadFiles(operation: Operation): boolean {
    return this.extractFiles(operation.variables).size > 0;
  }

  private createRegularBody(operation: Operation): string {
    return JSON.stringify({
      query: print(operation.query),
      variables: operation.variables,
      operationName: operation.operationName,
    });
  }

  private createUploadBody(operation: Operation): FormData {
    const form = new FormData();
    const files = this.extractFiles(operation.variables);
    const variables = this.replaceFilesWithNulls(operation.variables);

    // Add the operations
    form.append(
      'operations',
      JSON.stringify({
        query: print(operation.query),
        variables,
        operationName: operation.operationName,
      })
    );

    // Add the map
    const map: Record<string, string[]> = {};
    Array.from(files.entries()).forEach(([path, _], index) => {
      map[index] = [`variables.${path}`];
    });
    form.append('map', JSON.stringify(map));

    // Add the files
    Array.from(files.entries()).forEach(([_, file], index) => {
      form.append(`${index}`, file);
    });

    return form;
  }

  private extractFiles(
    value: any,
    path: string = '',
    files: Map<string, File> = new Map()
  ): Map<string, File> {
    if (value instanceof File) {
      files.set(path, value);
    } else if (Array.isArray(value)) {
      value.forEach((item, index) => {
        this.extractFiles(item, path ? `${path}.${index}` : `${index}`, files);
      });
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([key, val]) => {
        this.extractFiles(val, path ? `${path}.${key}` : key, files);
      });
    }
    return files;
  }

  private replaceFilesWithNulls(obj: any): any {
    if (obj instanceof File) {
      return null;
    }
    if (Array.isArray(obj)) {
      return obj.map((item) => this.replaceFilesWithNulls(item));
    }
    if (obj && typeof obj === 'object') {
      const result: Record<string, any> = {};
      Object.entries(obj).forEach(([key, value]) => {
        result[key] = this.replaceFilesWithNulls(value);
      });
      return result;
    }
    return obj;
  }
}

let isRefreshing = false;
let pendingRequests: Array<() => void> = [];

// Error handling link for token refresh
const errorLink = onError(({ networkError, operation, forward, ...p }) => {
  // Check if the error is an unauthenticated error
  const isUnauthenticated =
    networkError?.message?.includes('UNAUTHENTICATED') ||
    // @ts-ignore
    networkError?.graphQLErrors?.[0]?.extensions?.code === 'UNAUTHENTICATED';

  if (!isUnauthenticated || operation.operationName === 'refresh') {
    return;
  }

  if (!isRefreshing) {
    isRefreshing = true;

    return new Observable<FetchResult>((observer) => {
      client
        .mutate<RefreshResponse>({
          mutation: REFRESH_MUTATION,
        })
        .then(({ data }) => {
          isRefreshing = false;
          pendingRequests.forEach((callback) => callback());
          pendingRequests = [];
          forward(operation).subscribe(observer);
        })
        .catch((error) => {
          isRefreshing = false;
          pendingRequests = [];
          observer.error(error);
        });
    });
  }
console.log('operation', operation);
  return new Observable<FetchResult>((observer) => {
    pendingRequests.push(() => forward(operation).subscribe(observer));
  });
});

// Define type-safe cache configuration
const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        myStoreProducts: {
          // Merge function for pagination
          merge(existing = [], incoming: any[]) {
            return [...existing, ...incoming];
          },
        },
      },
    },
  },
});

// Create Apollo Client with upload and refresh support
export const client = new ApolloClient({
  link: from([errorLink, new MultipartLink()]),
  cache,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      nextFetchPolicy: 'cache-first',
    },
    query: {
      fetchPolicy: 'cache-first',
    },
    mutate: {
      fetchPolicy: 'no-cache',
    },
  },
});

// Type declaration for GraphQL Upload scalar
export type Upload = File | null;
