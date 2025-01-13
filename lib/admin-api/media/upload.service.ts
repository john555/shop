import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UploadUtils } from './upload.utils';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly bunnyStorageEndpoint: string;
  private readonly bunnyStorageZone: string;
  private readonly bunnyApiKey: string;
  private readonly bunnyCdnUrl: string;
  private readonly allowedTypes: string[];

  constructor(private readonly configService: ConfigService) {
    this.bunnyStorageEndpoint = this.configService.getOrThrow(
      'BUNNY_STORAGE_ENDPOINT'
    );
    this.bunnyStorageZone = this.configService.getOrThrow('BUNNY_STORAGE_ZONE');
    this.bunnyApiKey = this.configService.getOrThrow('BUNNY_API_KEY');
    this.bunnyCdnUrl = this.configService.getOrThrow('BUNNY_CDN_URL');

    // Configure allowed file types
    this.allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
      'video/mp4',
      'video/quicktime',
      'application/pdf',
    ];
  }

  async uploadFile(
    file: Buffer,
    fileName: string,
    baseDir?: string
  ): Promise<{ url: string; path: string; mimeType: string }> {
    try {
      // Validate file type
      if (!UploadUtils.isAllowedFileType(fileName, this.allowedTypes)) {
        throw new BadRequestException('File type not allowed');
      }

      // Generate upload path with dated folders
      const uploadPath = UploadUtils.generateUploadPath(fileName, baseDir);
      const uploadUrl = `${this.bunnyStorageEndpoint}/${this.bunnyStorageZone}/${uploadPath}`;
      const mimeType = UploadUtils.getMimeType(fileName);

      // Upload to Bunny.net
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          AccessKey: this.bunnyApiKey,
          'Content-Type': mimeType,
          accept: 'application/json',
        },
        body: file,
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Upload failed: ${error}`);
      }

      return {
        url: `${this.bunnyCdnUrl}/${uploadPath}`,
        path: uploadPath,
        mimeType,
      };
    } catch (error) {
      this.logger.error('Failed to upload file:', error);
      throw error;
    }
  }

  async deleteFile(url: string): Promise<void> {
    try {
      // Extract path from CDN URL
      const path = UploadUtils.extractPathFromUrl(this.bunnyCdnUrl, url);
      const deleteUrl = `${this.bunnyStorageEndpoint}/${this.bunnyStorageZone}/${path}`;

      const response = await fetch(deleteUrl, {
        method: 'DELETE',
        headers: {
          AccessKey: this.bunnyApiKey,
          accept: 'application/json',
        },
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(`Delete failed: ${error}`);
      }
    } catch (error) {
      this.logger.error('Failed to delete file:', error);
      throw error;
    }
  }
}
