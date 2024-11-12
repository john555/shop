import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { Tag, TagCreateInput, TagUpdateInput } from '@/types/api';

// GraphQL Fragments
const TAG_FIELDS = gql`
  fragment TagFields on Tag {
    id
    name
    slug
    storeId
    createdAt
    updatedAt
  }
`;

const FETCH_TAG = gql`
  query Tag($id: ID!) {
    tag(id: $id) {
      ...TagFields
    }
  }
  ${TAG_FIELDS}
`;

const CREATE_TAG = gql`
  mutation CreateTag($input: TagCreateInput!) {
    createTag(input: $input) {
      ...TagFields
    }
  }
  ${TAG_FIELDS}
`;

const UPDATE_TAG = gql`
  mutation UpdateTag($input: TagUpdateInput!) {
    updateTag(input: $input) {
      ...TagFields
    }
  }
  ${TAG_FIELDS}
`;

const DELETE_TAG = gql`
  mutation DeleteTag($id: ID!) {
    deleteTag(id: $id)
  }
`;

export function useTag(id?: string) {
  // Query for fetching a single tag
  const {
    data: tagData,
    loading: loadingTag,
    error: tagError,
    refetch: refetchTag,
  } = useQuery(FETCH_TAG, {
    variables: { id },
    skip: !id,
  });

  // Create tag mutation
  const [createTagMutation, { loading: creating, error: createError }] =
    useMutation(CREATE_TAG);

  // Update tag mutation
  const [updateTagMutation, { loading: updating, error: updateError }] =
    useMutation(UPDATE_TAG);

  // Delete tag mutation
  const [deleteTagMutation, { loading: deleting, error: deleteError }] =
    useMutation(DELETE_TAG);

  // Create tag wrapper that handles the response
  const createTag = useCallback(
    async (input: TagCreateInput) => {
      const response = await createTagMutation({
        variables: { input },
      });

      const createdTag = response.data?.createTag;

      if (createdTag?.id) {
        // Refetch to ensure we have the latest data
        await refetchTag({
          id: createdTag.id,
        });
      }

      return createdTag;
    },
    [createTagMutation, refetchTag]
  );

  // Update tag wrapper
  const updateTag = useCallback(
    async (input: Omit<TagUpdateInput, 'id'>) => {
      if (!id) throw new Error('Tag ID is required for updates');

      const { data } = await updateTagMutation({
        variables: {
          input: { ...input, id },
        },
      });

      return data?.updateTag;
    },
    [id, updateTagMutation]
  );

  // Delete tag wrapper
  const deleteTag = useCallback(async () => {
    if (!id) throw new Error('Tag ID is required for deletion');

    const { data } = await deleteTagMutation({
      variables: { id },
    });

    return data?.deleteTag;
  }, [id, deleteTagMutation]);

  return {
    // Data
    tag: tagData?.tag as Tag | undefined,

    // Loading states
    loading: loadingTag || creating || updating || deleting,
    creating,
    updating,
    deleting,

    // Errors
    error: tagError || createError || updateError || deleteError,

    // CRUD operations
    createTag,
    updateTag,
    deleteTag,

    // Refresh data
    refetch: refetchTag,
  };
}
