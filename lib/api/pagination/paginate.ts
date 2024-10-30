import { PrismaPromise } from '@prisma/client/runtime/library';
import { PaginationArgs } from './pagination.args';

export function paginate<T>(
  modelDelegate: { findMany: (args: any) => PrismaPromise<T[]> },
  args: PaginationArgs,
  cursorColumn = 'id',
) {
  return modelDelegate.findMany({
    skip: args?.cursor ? 1 : args?.skip,
    take: args?.take,
    cursor: args?.cursor
      ? {
          [cursorColumn]: args.cursor,
        }
      : undefined,
    orderBy: {
      [cursorColumn]: args?.sortOrder || 'desc',
    },
  });
}
