import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';

export class UploadUtils {
  /**
   * Sanitizes a filename by removing special characters and spaces
   */
  static sanitizeFileName(fileName: string): string {
    // Remove any path components and get just the filename
    const baseName = fileName.replace(/^.*[\\/]/, '');
    
    // Get the file extension
    const ext = extname(baseName);
    
    // Get the name without extension and sanitize it
    const nameWithoutExt = baseName
      .replace(ext, '')
      .replace(/[^a-zA-Z0-9]/g, '-') // Replace special chars with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
      .toLowerCase();
    
    return nameWithoutExt + ext.toLowerCase();
  }

  /**
   * Generates a unique filename with the format:
   * timestamp-uuid-sanitized_original_name.ext
   */
  static generateUniqueFileName(originalFileName: string): string {
    const timestamp = Date.now();
    const uuid = uuidv4().slice(0, 8); // Use first 8 chars of UUID
    const sanitizedName = this.sanitizeFileName(originalFileName);

    return `${timestamp}-${uuid}-${sanitizedName}`;
  }

  /**
   * Organizes files into dated folders
   * Returns the full path including the dated directory structure
   */
  static generateUploadPath(
    fileName: string, 
    baseDir?: string
  ): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    
    const datePath = `${year}/${month}`;
    const uniqueFileName = this.generateUniqueFileName(fileName);
    
    if (baseDir) {
      return `${baseDir}/${datePath}/${uniqueFileName}`;
    }
    
    return `${datePath}/${uniqueFileName}`;
  }

  /**
   * Gets MIME type for common image formats
   */
  static getMimeType(fileName: string): string {
    const ext = extname(fileName).toLowerCase();
    const mimeTypes: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.mp4': 'video/mp4',
      '.mov': 'video/quicktime',
      '.pdf': 'application/pdf',
    };

    return mimeTypes[ext] || 'application/octet-stream';
  }

  /**
   * Validates file type against allowed types
   */
  static isAllowedFileType(fileName: string, allowedTypes: string[]): boolean {
    const mimeType = this.getMimeType(fileName);
    return allowedTypes.includes(mimeType);
  }

  /**
   * Extracts path from CDN URL
   */
  static extractPathFromUrl(cdnUrl: string, fileUrl: string): string {
    return fileUrl.replace(cdnUrl + '/', '');
  }
}