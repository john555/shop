import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { encode } from 'blurhash';
import { FileUpload } from 'graphql-upload-ts';
import { MediaType } from '@prisma/client';

interface MediaMetadata {
  type: MediaType;
  width?: number;
  height?: number;
  duration?: number;
  blurHash?: string;
  placeholder?: string;
}

@Injectable()
export class MediaOptimizationService {
  // Map common MIME types to MediaType enum
  private mimeTypeMap: Record<string, MediaType> = {
    'image/jpeg': MediaType.PHOTO,
    'image/png': MediaType.PHOTO,
    'image/gif': MediaType.PHOTO,
    'image/webp': MediaType.PHOTO,
    'image/svg+xml': MediaType.PHOTO,
    'video/mp4': MediaType.VIDEO,
    'video/quicktime': MediaType.VIDEO,
    'model/gltf-binary': MediaType.MODEL_3D,
    'model/gltf+json': MediaType.MODEL_3D,
  };

  async generateMetadata(
    file: FileUpload,
    buffer: Buffer
  ): Promise<MediaMetadata> {
    const metadata: MediaMetadata = {
      type: this.detectMediaType(file.mimetype),
    };

    if (metadata.type === MediaType.PHOTO) {
      const imageMetadata = await this.processImage(buffer);
      Object.assign(metadata, imageMetadata);
    } else if (metadata.type === MediaType.VIDEO) {
      // Here you would integrate with a video processing library
      // like ffmpeg to extract video metadata
      // For now we'll just set the type
    }

    return metadata;
  }

  private detectMediaType(mimeType: string): MediaType {
    return this.mimeTypeMap[mimeType] || MediaType.PHOTO;
  }

  private async processImage(buffer: Buffer): Promise<Partial<MediaMetadata>> {
    const image = sharp(buffer);
    const metadata = await image.metadata();

    // Generate tiny placeholder
    const placeholderBuffer = await image
      .resize(10, 10, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .toBuffer();

    const placeholderBase64 = placeholderBuffer.toString('base64');

    // Generate BlurHash
    let blurHash: string | undefined;
    if (metadata.width && metadata.height) {
      const { data: pixels, info } = await image
        .raw()
        .ensureAlpha()
        .resize(32, 32, { fit: 'inside' })
        .toBuffer({ resolveWithObject: true });

      blurHash = encode(
        new Uint8ClampedArray(pixels),
        info.width,
        info.height,
        4, // x components
        3 // y components
      );
    }

    return {
      width: metadata.width,
      height: metadata.height,
      blurHash,
      placeholder: `data:image/${metadata.format};base64,${placeholderBase64}`,
    };
  }
}
