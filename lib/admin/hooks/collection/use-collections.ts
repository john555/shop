import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect } from 'react';
import { Collection, SortOrder } from '@/types/api';

interface CollectionFiltersInput {
  searchQuery?: string;
  isActive?: boolean;
}

interface UseCollectionsProps {
  storeId: string;
  skip?: number;
  take?: number;
  cursor?: string;
  filters?: CollectionFiltersInput;
  sortOrder?: SortOrder;
}

interface BulkCollectionUpdateInput {
  collectionIds: string[];
  storeId: string;
  data: CollectionBulkUpdateData;
}

interface CollectionBulkUpdateData {
  isActive?: boolean;
}

interface BulkCollectionDeleteInput {
  collectionIds: string[];
  storeId: string;
}

const COLLECTIONS_FIELDS = `
  id
  name
  description
  slug
  isActive
  seoTitle
  seoDescription
  createdAt
  updatedAt
  products {
    id
    title
    slug
  }
`;

const FETCH_COLLECTIONS = gql`
  query StoreCollections(
    $storeId: String!
    $skip: Int
    $take: Int
    $sortOrder: SortOrder
  ) {
    storeCollections(
      storeId: $storeId
      skip: $skip
      take: $take
      sortOrder: $sortOrder
    ) {
      ${COLLECTIONS_FIELDS}
    }
  }
`;

const BULK_UPDATE_COLLECTIONS = gql`
  mutation BulkUpdateCollections($input: BulkCollectionUpdateInput!) {
    bulkUpdateCollections(input: $input)
  }
`;

const BULK_DELETE_COLLECTIONS = gql`
  mutation BulkDeleteCollections($input: BulkCollectionDeleteInput!) {
    bulkDeleteCollections(input: $input)
  }
`;

export function useCollections({
  storeId,
  skip = 0,
  take = 25,
  sortOrder,
}: UseCollectionsProps) {
  // Fetch collections
  const {
    data,
    loading: loadingCollections,
    error: collectionsError,
    refetch,
  } = useQuery(FETCH_COLLECTIONS, {
    variables: {
      storeId,
      skip,
      take,
      sortOrder,
    },
    skip: !storeId,
  });

  // Bulk update collections mutation
  const [
    bulkUpdateCollections,
    { loading: updatingCollections, error: updateError },
  ] = useMutation(BULK_UPDATE_COLLECTIONS, {
    refetchQueries: [
      {
        query: FETCH_COLLECTIONS,
        variables: { storeId, skip, take, sortOrder },
      },
    ],
  });

  // Bulk delete collections mutation
  const [
    bulkDeleteCollections,
    { loading: deletingCollections, error: deleteError },
  ] = useMutation(BULK_DELETE_COLLECTIONS, {
    refetchQueries: [
      {
        query: FETCH_COLLECTIONS,
        variables: { storeId, skip, take, sortOrder },
      },
    ],
  });

  // Refetch when query parameters change
  useEffect(() => {
    if (storeId) {
      refetch({
        storeId,
        skip,
        take,
        sortOrder,
      });
    }
  }, [storeId, skip, take, sortOrder, refetch]);

  // Combine loading states
  const loading =
    loadingCollections || updatingCollections || deletingCollections;

  // Combine error states
  const error = collectionsError || updateError || deleteError;

  return {
    collections: (data?.storeCollections || []) as Collection[],
    loading,
    error,
    bulkUpdateCollections: async (
      collectionIds: string[],
      updateData: CollectionBulkUpdateData
    ) => {
      const response = await bulkUpdateCollections({
        variables: {
          input: {
            collectionIds,
            storeId,
            data: updateData,
          },
        },
      });
      return response.data.bulkUpdateCollections;
    },
    bulkDeleteCollections: async (collectionIds: string[]) => {
      const response = await bulkDeleteCollections({
        variables: {
          input: {
            collectionIds,
            storeId,
          },
        },
      });
      return response.data.bulkDeleteCollections;
    },
    refetch,
  };
}
