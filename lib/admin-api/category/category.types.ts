import { Prisma } from '@prisma/client';

export type CategoryInclude = {
  children?: boolean;
  parent?: boolean;
  store?: boolean;
  products?: boolean;
};

export const DEFAULT_CATEGORY_INCLUDE: CategoryInclude = {
  children: false,
  parent: false,
  store: false,
  products: false,
};

export type CategoryCreateData = Omit<
  Prisma.CategoryUncheckedCreateInput,
  'createdAt' | 'updatedAt'
>;

export type CategoryUpdateData = Omit<
  Prisma.CategoryUncheckedUpdateInput,
  'createdAt' | 'updatedAt' | 'storeId' | 'slug'
>;

export interface PresetCategory {
  name: string;
  slug: string;
  description: string;
  children?: PresetCategory[];
}

export interface CategoryCreator {
  getCategories(): PresetCategory[];
}

export const createSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
};

export const validateCategoryData = (categories: PresetCategory[]): void => {
  const slugs = new Set<string>();

  const checkCategory = (category: PresetCategory) => {
    if (slugs.has(category.slug)) {
      throw new Error(`Duplicate slug found: ${category.slug}`);
    }
    slugs.add(category.slug);

    category.children?.forEach(checkCategory);
  };

  categories.forEach(checkCategory);
};
