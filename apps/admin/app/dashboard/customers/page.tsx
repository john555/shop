'use client';

import { useCustomers } from '@/admin/hooks/customer';
import { useStore } from '@/admin/hooks/store';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { DataTable } from './(components)/(table)/data-table';
import { columns } from './(components)/(table)/columns';

export default function CustomersPage() {
  const { store } = useStore();
  const { customers } = useCustomers({ storeId: store?.id });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Customers</h1>
        <Button asChild>
          <Link href={`${DASHBOARD_PAGE_LINK}/customers/create`}>
            <Plus className="mr-2 h-4 w-4" /> Add Customer
          </Link>
        </Button>
      </div>

      <DataTable data={customers} columns={columns} />
    </div>
  );
}
