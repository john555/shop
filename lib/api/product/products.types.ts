import { Prisma } from '@prisma/client';

// Type for create input
export type ProductCreateData = Omit<
  Prisma.ProductUncheckedCreateInput,
  'createdAt' | 'updatedAt'
>;
