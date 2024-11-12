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
