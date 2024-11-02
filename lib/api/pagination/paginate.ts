import { PrismaPromise } from '@prisma/client/runtime/library';
import { PaginationArgs } from './pagination.args';

export function paginate<T>({
  modelDelegate,
  args,
  cursorColumn = 'id',
  where,
}: {
  modelDelegate: { findMany: (args: any) => PrismaPromise<T[]> };
  args?: PaginationArgs;
  cursorColumn?: 'id';
  where?: any;
}) {
  return modelDelegate.findMany({
    where,
    skip: args?.cursor ? 1 : args?.skip || 0,
    take: args?.take || 25,
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
