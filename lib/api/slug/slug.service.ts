import { Injectable } from '@nestjs/common';
import slugify from 'slugify';
import { randomBytes } from 'crypto';

@Injectable()
export class SlugService {
  constructor() {
    // Configure slugify defaults
    slugify.extend({ '+': 'plus' }); // Handle special characters
  }

  createSlug(text: string): string {
    return slugify(text, {
      lower: true,           // Convert to lowercase
      strict: true,          // Strip special characters
      trim: true,            // Trim leading/trailing spaces
      locale: 'en',          // Use English locale
    });
  }

  private generateRandomString(length: number = 6): string {
    return randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length)
      .toLowerCase();
  }

  async createUniqueSlug(
    text: string,
    checkUnique: (slug: string) => Promise<boolean>,
    maxAttempts = 10
  ): Promise<string> {
    // First attempt: use the basic slug
    let slug = this.createSlug(text);
    if (await checkUnique(slug)) {
      return slug;
    }

    // Second attempt: append current year
    const currentYear = new Date().getFullYear();
    slug = `${slug}-${currentYear}`;
    if (await checkUnique(slug)) {
      return slug;
    }

    // Additional attempts: append random string
    for (let i = 0; i < maxAttempts; i++) {
      const uniqueSuffix = this.generateRandomString();
      slug = `${this.createSlug(text)}-${uniqueSuffix}`;
      
      if (await checkUnique(slug)) {
        return slug;
      }
    }

    throw new Error(`Failed to generate unique slug for "${text}" after ${maxAttempts} attempts`);
  }

  /**
   * Validates if a slug meets the required format
   * @param slug The slug to validate
   * @returns True if the slug is valid, false otherwise
   */
  isValidSlug(slug: string): boolean {
    // Slug requirements:
    // 1. Only lowercase letters, numbers, and hyphens
    // 2. Must start and end with a letter or number
    // 3. Length between 3 and 100 characters
    const slugRegex = /^[a-z0-9][a-z0-9-]*[a-z0-9]$/;
    return (
      slugRegex.test(slug) &&
      slug.length >= 3 &&
      slug.length <= 100 &&
      !slug.includes('--')
    );
  }
}
