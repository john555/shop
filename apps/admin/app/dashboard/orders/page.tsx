'use client';

import { useOrders } from '@/admin/hooks/order';
import { useStore } from '@/admin/hooks/store';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from './(components)/(table)/data-table';
import { columns } from './(components)/(table)/columns';

export default function OrdersPage() {
  const { store } = useStore();
  const { orders } = useOrders({ storeId: store?.id });
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button asChild>
          <Link href={`${DASHBOARD_PAGE_LINK}/orders/create`}>
            <Plus className="mr-2 h-4 w-4" /> Create an Order
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={orders} />
    </div>
  );
}
