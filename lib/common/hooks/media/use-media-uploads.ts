import { useState, useCallback } from 'react';

export interface MediaFile {
  id: string;
  type: 'image' | 'video' | '3d';
  url: string;
  thumbnailUrl: string;
  name: string;
  fileType: string;
  fileSize: number;
  width?: number;
  height?: number;
  duration?: number;
}

interface UploadProgress {
  fileId: string;
  progress: number;
}

interface UseMediaUploadOptions {
  path?: string;
  onUploadComplete?: (file: MediaFile) => void;
  onUploadError?: (error: string) => void;
}

interface UploadResponse {
  success: boolean;
  file?: MediaFile;
  error?: string;
}

export function useMediaUpload({
  path = '',
  onUploadComplete,
  onUploadError,
}: UseMediaUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);

  // Helper to get file dimensions
  const getFileDimensions = useCallback(
    async (
      file: File
    ): Promise<{ width?: number; height?: number; duration?: number }> => {
      return new Promise((resolve) => {
        if (file.type.startsWith('image/')) {
          const img = new Image();
          img.onload = () => {
            resolve({ width: img.width, height: img.height });
          };
          img.onerror = () => resolve({});
          img.src = URL.createObjectURL(file);
        } else if (file.type.startsWith('video/')) {
          const video = document.createElement('video');
          video.onloadedmetadata = () => {
            resolve({
              width: video.videoWidth,
              height: video.videoHeight,
              duration: video.duration,
            });
          };
          video.onerror = () => resolve({});
          video.src = URL.createObjectURL(file);
        } else {
          resolve({});
        }
      });
    },
    []
  );

  const uploadFile = useCallback(
    async (file: File): Promise<UploadResponse> => {
      try {
        const uploadId = Math.random().toString(36).substr(2, 9);
        setUploadProgress((prev) => [
          ...prev,
          { fileId: uploadId, progress: 0 },
        ]);

        const formData = new FormData();
        formData.append('file', file);
        if (path) formData.append('path', path);

        const xhr = new XMLHttpRequest();

        const response = await new Promise<{ status: number; data: any }>(
          (resolve, reject) => {
            xhr.upload.onprogress = (event) => {
              if (event.lengthComputable) {
                const progress = (event.loaded / event.total) * 100;
                setUploadProgress((prev) =>
                  prev.map((item) =>
                    item.fileId === uploadId ? { ...item, progress } : item
                  )
                );
              }
            };

            xhr.onload = async () => {
              try {
                const data = JSON.parse(xhr.responseText);
                resolve({ status: xhr.status, data });
              } catch (error) {
                reject(new Error('Invalid response format'));
              }
            };

            xhr.onerror = () => reject(new Error('Upload failed'));

            xhr.open('POST', '/api/media/upload', true);
            xhr.send(formData);
          }
        );

        // Clean up progress tracking
        setUploadProgress((prev) =>
          prev.filter((item) => item.fileId !== uploadId)
        );

        if (response.status !== 200) {
          const error = response.data.error || 'Upload failed';
          onUploadError?.(error);
          return { success: false, error };
        }

        // Get file dimensions if applicable
        const dimensions = await getFileDimensions(file);

        // Create MediaFile object
        const mediaFile: MediaFile = {
          id: uploadId,
          type: file.type.startsWith('image/')
            ? 'image'
            : file.type.startsWith('video/')
            ? 'video'
            : '3d',
          url: response.data.file.url,
          thumbnailUrl: file.type.startsWith('image/')
            ? response.data.file.url
            : '/placeholder.svg?height=100&width=100',
          name: file.name.split('.')[0],
          fileType: file.name.split('.').pop()?.toUpperCase() || '',
          fileSize: file.size,
          ...dimensions,
        };

        onUploadComplete?.(mediaFile);
        return { success: true, file: mediaFile };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Upload failed';
        onUploadError?.(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [path, getFileDimensions, onUploadComplete, onUploadError]
  );

  const uploadFiles = useCallback(
    async (files: File[]): Promise<UploadResponse[]> => {
      setIsUploading(true);
      try {
        const results = await Promise.all(
          files.map((file) => uploadFile(file))
        );
        return results;
      } finally {
        setIsUploading(false);
      }
    },
    [uploadFile]
  );

  return {
    uploadFile,
    uploadFiles,
    isUploading,
    uploadProgress,
  };
}
