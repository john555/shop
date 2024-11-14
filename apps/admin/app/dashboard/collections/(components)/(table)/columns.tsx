import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Collection } from '@/types/api';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, MoreHorizontal } from 'lucide-react';
import Link from 'next/link';
import { CollectionStatusBadge } from '../(ui)/collection-status-badge';

export type CreateColumnsProps = {
  handleDeleteActionClick: (collection: Collection) => void;
};

export const createColumns: (
  props: CreateColumnsProps
) => ColumnDef<Collection>[] = ({ handleDeleteActionClick }) => [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4">
        <Link
          href={`${DASHBOARD_PAGE_LINK}/collections/${row.original.id}`}
          className="border-b-2 border-b-muted hover:border-b-muted-foreground"
        >
          {row.original.name}
        </Link>
      </div>
    ),
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: 'products',
    header: () => <div>Products</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium px-6">{row.original.products.length}</div>
      );
    },
  },
  {
    accessorKey: 'isActive',
    header: 'Status',
    cell: ({ row }) => (
      <CollectionStatusBadge isActive={row.getValue('isActive')} />
    ),
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex justify-end">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleDeleteActionClick(row.original)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
