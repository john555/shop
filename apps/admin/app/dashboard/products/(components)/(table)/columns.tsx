import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Product, SalesChannel } from '@/types/admin-api';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import { ProductStatusBadge } from '../(ui)/product-status-badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';

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
      <Popover>
        <PopoverTrigger>
          <Button
            variant="ghost"
            className="flex gap-2 items-center font-medium px-2"
          >
            {row.original.salesChannels.length}
            <ChevronDown size={16} />
          </Button>
        </PopoverTrigger>
        <PopoverContent>
          {row.original.salesChannels
            .map((channel) =>
              channel === SalesChannel.Online
                ? 'Online store'
                : channel === SalesChannel.InStore
                ? 'In store'
                : ''
            )
            .join(', ')}
        </PopoverContent>
      </Popover>
    ),
  },
  {
    accessorKey: 'collections',
    header: () => <div>Collections</div>,
    cell: ({ row }) => {
      return (
        <Popover>
          <PopoverTrigger>
            <Button
              variant="ghost"
              className="flex gap-2 items-center font-medium px-2"
            >
              {row.original.collections.length}
              <ChevronDown size={16} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="flex flex-wrap gap-2">
            {row.original.collections.map((collection) => (
              <Badge
                key={collection.id}
                variant="secondary"
                className="text-xs"
              >
                {collection.name}
              </Badge>
            ))}
          </PopoverContent>
        </Popover>
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
