import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Order } from '@/types/api';
import { Checkbox } from '@/components/ui/checkbox';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';
import { OrderStatusBadge } from '../(ui)/order-status-badge';
import { OrderPaymentStatusBadge } from '../(ui)/order-payment-status-badge';
import { OrderShipmentStatusBadge } from '../(ui)/order-shipment-status-badge';

export const columns: ColumnDef<Order>[] = [
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
    accessorKey: 'orderNumber',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Order ID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="pl-4">
        <Link
          href={`${DASHBOARD_PAGE_LINK}/orders/${row.original.id}`}
          className="border-b-2 border-b-muted hover:border-b-muted-foreground"
        >
          {row.original.formattedOrderNumber}
        </Link>
      </div>
    ),
    enableHiding: false,
    enablePinning: true,
  },
  {
    accessorKey: 'customerName',
    header: 'Customer',
    cell: ({ row }) => {
      const name =
        [row.original.customer?.firstName, row.original.customer?.lastName]
          .filter(Boolean)
          .join(' ') || 'No customer';
      return <div className="font-medium">{name}</div>;
    },
  },
  {
    accessorKey: 'totalAmount',
    header: 'Total',
    cell: ({ row }) => row.original.formattedTotalAmount,
  },
  {
    accessorKey: 'paymentStatus',
    header: 'Payment Status',
    cell: ({ row }) => <OrderPaymentStatusBadge status={row.getValue('paymentStatus')} />,
  },
  {
    accessorKey: 'items',
    header: 'Items',
    cell: ({ row }) => row.original.items.length,
  },
  {
    accessorKey: 'shipmentStatus',
    header: 'Shipment Status',
    cell: ({ row }) => <OrderShipmentStatusBadge status={row.getValue('shipmentStatus')} />,
  },
  {
    accessorKey: 'status',
    header: 'Order Status',
    cell: ({ row }) => <OrderStatusBadge status={row.getValue('status')} />,
  },
];
