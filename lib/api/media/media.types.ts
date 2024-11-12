import { Prisma } from '@prisma/client';

export type MediaCreateData = Omit<
  Prisma.MediaUncheckedCreateInput,
  'createdAt' | 'updatedAt'
>;

export type MediaUpdateData = Omit<
  Prisma.MediaUncheckedUpdateInput,
  'createdAt' | 'updatedAt'
>;
