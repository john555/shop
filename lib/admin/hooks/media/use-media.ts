import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  Media,
  MediaSearchInput,
  MediaUpdateInput,
  MediaCreateInput,
  MediaReorderInput,
} from '@/types/admin-api';

interface UseMediaProps {
  skip?: number;
  take?: number;
  cursor?: string;
  filters?: MediaSearchInput;
}

const MEDIA_FIELDS = `
  id
  type
  url
  alt
  fileName
  mimeType
  fileSize
  width
  height
  duration
  thumbnail
  modelFormat
  blurHash
  placeholder
  isArchived
  purpose
  storeId
  createdAt
  updatedAt
  usedIn {
    ownerType
    ownerId
    ownerTitle
  }
`;

const FETCH_MEDIA = gql`
  query Media(
    $input: MediaSearchInput!
    $skip: Int
    $take: Int
    $cursor: String
  ) {
    media(
      input: $input
      skip: $skip
      take: $take
      cursor: $cursor
    ) {
      ${MEDIA_FIELDS}
    }
  }
`;

const CREATE_MEDIA = gql`
  mutation CreateMedia($input: MediaCreateInput!) {
    createMedia(input: $input) {
      ${MEDIA_FIELDS}
    }
  }
`;

const UPDATE_MEDIA = gql`
  mutation UpdateMedia($input: MediaUpdateInput!) {
    updateMedia(input: $input) {
      ${MEDIA_FIELDS}
    }
  }
`;

const DELETE_MEDIA = gql`
  mutation DeleteMedia($id: String!) {
    deleteMedia(id: $id)
  }
`;

const REORDER_MEDIA = gql`
  mutation ReorderMedia($input: MediaReorderInput!) {
    reorderMedia(input: $input) {
      ${MEDIA_FIELDS}
    }
  }
`;

export function useMedia({
  skip = 0,
  take = 25,
  cursor,
  filters,
}: UseMediaProps = {}) {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>(
    {}
  );
  const [uploadErrors, setUploadErrors] = useState<Record<string, Error>>({});

  // Fetch media
  const {
    data,
    loading: loadingMedia,
    error: mediaError,
    refetch,
  } = useQuery(FETCH_MEDIA, {
    variables: {
      input: filters || {},
      skip,
      take,
      cursor,
    },
    skip: !filters?.storeId,
  });

  // Refetch when query parameters change
  useEffect(() => {
    if (filters?.storeId) {
      refetch({
        input: filters,
        skip,
        take,
        cursor,
      });
    }
  }, [filters, skip, take, cursor, refetch]);

  // Create media mutation
  const [createMediaMutation] = useMutation(CREATE_MEDIA);

  // Update media mutation
  const [updateMediaMutation] = useMutation(UPDATE_MEDIA);

  // Delete media mutation
  const [deleteMediaMutation] = useMutation(DELETE_MEDIA);

  // Reorder media mutation
  const [reorderMediaMutation] = useMutation(REORDER_MEDIA);

  // Upload/Create media function
  const createMedia = async (input: MediaCreateInput) => {
    try {
      const uploadId = Math.random().toString(36).substring(7);
      setUploadProgress((prev) => ({ ...prev, [uploadId]: 0 }));
      setUploadErrors((prev) => ({ ...prev, [uploadId]: null }));

      const response = await createMediaMutation({
        variables: { input },
        context: {
          fetchOptions: {
            onProgress: (progress: ProgressEvent) => {
              if (progress.lengthComputable) {
                const percent = Math.round(
                  (progress.loaded / progress.total) * 100
                );
                setUploadProgress((prev) => ({ ...prev, [uploadId]: percent }));
              }
            },
          },
        },
      });

      setUploadProgress((prev) => {
        const { [uploadId]: _, ...rest } = prev;
        return rest;
      });
      return response.data.createMedia;
    } catch (error) {
      const uploadId = Math.random().toString(36).substring(7);
      setUploadErrors((prev) => ({ ...prev, [uploadId]: error as Error }));
      throw error;
    }
  };

  // Update media function
  const updateMedia = async (input: MediaUpdateInput) => {
    const response = await updateMediaMutation({
      variables: { input },
    });
    return response.data.updateMedia;
  };

  // Delete media function
  const deleteMedia = async (id: string) => {
    const response = await deleteMediaMutation({
      variables: { id },
    });
    return response.data.deleteMedia;
  };

  // Reorder media function
  const reorderMedia = async (input: MediaReorderInput) => {
    const response = await reorderMediaMutation({
      variables: { input },
    });
    return response.data.reorderMedia;
  };

  return {
    media: (data?.media || []) as Media[],
    loading: loadingMedia,
    error: mediaError,
    uploadProgress,
    uploadErrors,
    createMedia,
    updateMedia,
    deleteMedia,
    reorderMedia,
    refetch,
  };
}
