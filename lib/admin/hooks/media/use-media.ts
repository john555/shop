import { gql, useMutation, useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import {
  Media,
  MediaOwnerType,
  MediaSearchInput,
  MediaUploadInput,
} from '@/types/api';

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
  blurHash
  placeholder
  isArchived
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

const DELETE_MEDIA = gql`
  mutation DeleteMedia($id: ID!) {
    deleteMedia(id: $id)
  }
`;

const UPLOAD_MEDIA = gql`
  mutation UploadMedia($input: MediaUploadInput!) {
    uploadMedia(input: $input) {
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

const REORDER_MEDIA = gql`
  mutation ReorderMedia($ownerId: String!, $ownerType: MediaOwnerType!, $orderedIds: [String!]!) {
    reorderMedia(ownerId: $ownerId, ownerType: $ownerType, orderedIds: $orderedIds) {
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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [uploadError, setUploadError] = useState<Error | null>(null);
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
    // Skip if no filters provided to avoid unnecessary queries
    skip: !filters.storeId,
  });

  // Refetch when query parameters change
  useEffect(() => {
    if (filters) {
      refetch({
        input: filters,
        skip,
        take,
        cursor,
      });
    }
  }, [filters, skip, take, cursor, refetch]);

  // Delete media mutation
  const [deleteMedia, { loading: deletingMedia, error: deleteError }] =
    useMutation(DELETE_MEDIA, {
      refetchQueries: [
        {
          query: FETCH_MEDIA,
          variables: {
            input: filters || {},
            skip,
            take,
            cursor,
          },
        },
      ],
    });

  // Upload mutation with progress tracking
  const [uploadMediaMutation] = useMutation(UPLOAD_MEDIA, {
    context: {
      fetchOptions: {
        onProgress: (progress: ProgressEvent) => {
          if (progress.lengthComputable) {
            const percent = Math.round(
              (progress.loaded / progress.total) * 100
            );
            setUploadProgress(percent);
          }
        },
      },
    },
    refetchQueries: [
      {
        query: FETCH_MEDIA,
        variables: {
          input: filters || {},
          skip,
          take,
          cursor,
        },
      },
    ],
  });

  // Update media mutation
  const [updateMedia, { loading: updatingMedia, error: updateError }] =
    useMutation(UPDATE_MEDIA, {
      refetchQueries: [
        {
          query: FETCH_MEDIA,
          variables: {
            input: filters || {},
            skip,
            take,
            cursor,
          },
        },
      ],
    });

  // Reorder media mutation
  const [reorderMedia, { loading: reorderingMedia, error: reorderError }] =
    useMutation(REORDER_MEDIA, {
      refetchQueries: [
        {
          query: FETCH_MEDIA,
          variables: {
            input: filters || {},
            skip,
            take,
            cursor,
          },
        },
      ],
    });

  // Combine loading states
  const loading =
    loadingMedia || deletingMedia || updatingMedia || reorderingMedia;

  // Combine error states
  const error = mediaError || deleteError || updateError || reorderError;
  return {
    media: (data?.media || []) as Media[],
    loading,
    error,
    // Upload state
    uploadProgress,
    uploadError,
    deleteMedia: async (id: string) => {
      const response = await deleteMedia({
        variables: { id },
      });
      return response.data.deleteMedia;
    },
    uploadMedia: async (input: MediaUploadInput) => {
      try {
        setUploadProgress(0);
        setUploadError(null);

        const response = await uploadMediaMutation({
          variables: {
            input,
          },
          refetchQueries: [
            {
              query: FETCH_MEDIA,
              variables: filters,
            },
          ],
        });

        setUploadProgress(100);
        return response.data.uploadMedia;
      } catch (error) {
        setUploadError(error as Error);
        throw error;
      }
    },

    updateMedia: async (input: {
      id: string;
      alt?: string;
      position?: number;
    }) => {
      const response = await updateMedia({
        variables: { input },
      });
      return response.data.updateMedia;
    },
    reorderMedia: async (
      ownerId: string,
      ownerType: MediaOwnerType,
      orderedIds: string[]
    ) => {
      const response = await reorderMedia({
        variables: { ownerId, ownerType, orderedIds },
      });
      return response.data.reorderMedia;
    },
    refetch,
  };
}
