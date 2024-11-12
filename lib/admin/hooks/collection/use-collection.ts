import { gql, useMutation, useQuery } from '@apollo/client';
import { Collection } from '@/types/api';

const PRODUCT_FRAGMENT = gql`
  fragment ProductFields on Product {
    id
    title
    slug
    status
    price
    compareAtPrice
    available
    trackInventory
    description
    seoTitle
    seoDescription
    createdAt
    updatedAt
  }
`;

const COLLECTION_FRAGMENT = gql`
  fragment CollectionFields on Collection {
    id
    name
    slug
    description
    storeId
    createdAt
    updatedAt
    products {
      ...ProductFields
    }
  }
  ${PRODUCT_FRAGMENT}
`;

const GET_COLLECTION = gql`
  query GetCollection($id: ID!) {
    collection(id: $id) {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`;

const CREATE_COLLECTION = gql`
  mutation CreateCollection($input: CollectionCreateInput!) {
    createCollection(input: $input) {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`;

const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($input: CollectionUpdateInput!) {
    updateCollection(input: $input) {
      ...CollectionFields
    }
  }
  ${COLLECTION_FRAGMENT}
`;

const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: ID!) {
    deleteCollection(id: $id)
  }
`;

export interface CollectionCreateInput {
  name: string;
  slug: string;
  description?: string | null;
  storeId: string;
}

export interface CollectionUpdateInput {
  id: string;
  name?: string;
  description?: string | null;
}

export function useCollection(initialId?: string) {
  // Query for fetching a single collection
  const {
    data,
    loading: fetchingCollection,
    error: fetchError,
    refetch: refetchCollection,
  } = useQuery(GET_COLLECTION, {
    variables: { id: initialId },
    skip: !initialId,
  });

  // Mutations for CRUD operations
  const [createCollection, { loading: creating, error: createError }] = useMutation(
    CREATE_COLLECTION,
  );

  const [updateCollection, { loading: updating, error: updateError }] = useMutation(
    UPDATE_COLLECTION,
    {
      refetchQueries: [
        {
          query: GET_COLLECTION,
          variables: { id: initialId },
        },
      ],
    }
  );

  const [deleteCollection, { loading: deleting, error: deleteError }] = useMutation(
    DELETE_COLLECTION
  );

  // Handler for creating a new collection
  const handleCreate = async (input: CollectionCreateInput) => {
    try {
      const { data } = await createCollection({
        variables: { input },
      });
      
      // Refetch the collection with the new ID
      await refetchCollection({ id: data.createCollection.id });
      
      return data.createCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  };

  // Handler for updating a collection
  const handleUpdate = async (input: CollectionUpdateInput) => {
    try {
      const { data } = await updateCollection({
        variables: { input },
      });
      return data.updateCollection;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  };

  // Handler for deleting a collection
  const handleDelete = async (collectionId: string) => {
    try {
      const { data } = await deleteCollection({
        variables: { id: collectionId },
      });
      return data.deleteCollection;
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  };

  return {
    collection: data?.collection as Collection | undefined,
    loading: fetchingCollection || creating || updating || deleting,
    error: fetchError || createError || updateError || deleteError,
    create: handleCreate,
    update: handleUpdate,
    delete: handleDelete,
    refetch: refetchCollection,
  };
}
