import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/api';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { ProductStatusBadge } from '../(ui)/product-status-badge';

export const columns: ColumnDef<Product>[] = [
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
    accessorKey: 'title',
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
          href={`${DASHBOARD_PAGE_LINK}/products/${row.original.id}`}
          className="border-b-2 border-b-muted hover:border-b-muted-foreground"
        >
          {row.original.title}
        </Link>
      </div>
    ),
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <ProductStatusBadge status={row.getValue('status')} />,
  },
  {
    accessorKey: 'salesChannels',
    header: 'Sales channels',
    cell: ({ row }) => (
      <div className="font-medium px-6">
        {row.original.salesChannels.length}
      </div>
    ),
  },
  {
    accessorKey: 'collections',
    header: () => <div>Collections</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium px-6">
          {row.original.collections.length}
        </div>
      );
    },
  },
  {
    accessorKey: 'category',
    header: () => <div>Category</div>,
    cell: ({ row }) => {
      return (
        <div className="font-medium">
          {row.original.category?.name || 'Uncategorized'}
        </div>
      );
    },
  },
];
