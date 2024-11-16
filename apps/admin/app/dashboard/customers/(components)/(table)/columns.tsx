import { DASHBOARD_PAGE_LINK, LANGUAGES } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Customer } from '@/types/api';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { SubscriptionStatusBadge } from '../(ui)/subscription-status-badge';

export const columns: ColumnDef<Customer>[] = [
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
          href={`${DASHBOARD_PAGE_LINK}/customers/${row.original.id}`}
          className="border-b-2 border-b-muted hover:border-b-muted-foreground"
        >
          {row.original.firstName} {row.original.lastName}
        </Link>
      </div>
    ),
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <div>{row.original.email}</div>,
  },
  {
    accessorKey: 'marketingEmails',
    header: 'Email subscription',
    cell: ({ row }) => (
      <SubscriptionStatusBadge
        type="email"
        isSubscribed={row.original.marketingEmails}
      />
    ),
  },
  {
    accessorKey: 'marketingSMS',
    header: 'SMS subscription',
    cell: ({ row }) => (
      <SubscriptionStatusBadge
        type="sms"
        isSubscribed={row.original.marketingSMS}
      />
    ),
  },
  {
    accessorKey: 'language',
    header: 'Language',
    cell: ({ row }) => {
      const language = LANGUAGES.find(
        (l) => l.value === row.getValue('language')
      );
      return <div>{language?.label}</div>;
    },
  },
  {
    accessorKey: 'orders',
    header: 'Orders',
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue('orders') || 'Coming soon'}</div>;
    },
  },
  {
    accessorKey: 'amountSpent',
    header: 'Amount spent',
    cell: ({ row }) => {
      return <div className="text-muted-foreground">{row.getValue('amountSpent') || 'Coming soon'}</div>;
    },
  },
];
