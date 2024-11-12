import { gql, useMutation, useQuery } from '@apollo/client';
import { useCallback } from 'react';
import { Media, MediaCreateInput, MediaUpdateInput } from '@/types/api';

const MEDIA_FIELDS = gql`
  fragment MediaFields on Media {
    id
    type
    url
    alt
    position
    fileName
    mimeType
    fileSize
    width
    height
    duration
    thumbnail
    modelFormat
    ownerType
    ownerId
    createdAt
    updatedAt
  }
`;

const FETCH_MEDIA = gql`
  query Media($id: ID!) {
    media(id: $id) {
      ...MediaFields
    }
  }
  ${MEDIA_FIELDS}
`;

const CREATE_MEDIA = gql`
  mutation CreateMedia($input: MediaCreateInput!) {
    createMedia(input: $input) {
      ...MediaFields
    }
  }
  ${MEDIA_FIELDS}
`;

const UPDATE_MEDIA = gql`
  mutation UpdateMedia($input: MediaUpdateInput!) {
    updateMedia(input: $input) {
      ...MediaFields
    }
  }
  ${MEDIA_FIELDS}
`;

const DELETE_MEDIA = gql`
  mutation DeleteMedia($id: ID!) {
    deleteMedia(id: $id)
  }
`;

export function useMedia(id?: string) {
  // Query for fetching a single media item
  const {
    data: mediaData,
    loading: loadingMedia,
    error: mediaError,
    refetch: refetchMedia
  } = useQuery(FETCH_MEDIA, {
    variables: { id },
    skip: !id,
  });

  // Create media mutation
  const [createMediaMutation, { 
    loading: creating,
    error: createError 
  }] = useMutation(CREATE_MEDIA);

  // Update media mutation
  const [updateMediaMutation, { 
    loading: updating,
    error: updateError 
  }] = useMutation(UPDATE_MEDIA);

  // Delete media mutation
  const [deleteMediaMutation, { 
    loading: deleting,
    error: deleteError 
  }] = useMutation(DELETE_MEDIA);

  // Create media wrapper that handles the response
  const createMedia = useCallback(async (input: MediaCreateInput) => {
    const response = await createMediaMutation({
      variables: { input }
    });
    
    const createdMedia = response.data?.createMedia;
    
    if (createdMedia?.id) {
      // Refetch to ensure we have the latest data
      await refetchMedia({
        id: createdMedia.id
      });
    }
    
    return createdMedia;
  }, [createMediaMutation, refetchMedia]);

  // Update media wrapper
  const updateMedia = useCallback(async (input: Omit<MediaUpdateInput, 'id'>) => {
    if (!id) throw new Error('Media ID is required for updates');

    const { data } = await updateMediaMutation({
      variables: { 
        input: { ...input, id } 
      }
    });
    
    return data?.updateMedia;
  }, [id, updateMediaMutation]);

  // Delete media wrapper
  const deleteMedia = useCallback(async () => {
    if (!id) throw new Error('Media ID is required for deletion');

    const { data } = await deleteMediaMutation({
      variables: { id }
    });
    
    return data?.deleteMedia;
  }, [id, deleteMediaMutation]);

  return {
    // Data
    media: mediaData?.media as Media | undefined,
    
    // Loading states
    loading: loadingMedia || creating || updating || deleting,
    creating,
    updating,
    deleting,
    
    // Errors
    error: mediaError || createError || updateError || deleteError,
    
    // CRUD operations
    createMedia,
    updateMedia,
    deleteMedia,
    
    // Refresh data
    refetch: refetchMedia,
  };
}
