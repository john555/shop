'use client';

import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/admin/hooks/store';
import { useProducts } from '@/admin/hooks/product';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { DataTable } from './(components)/(table)/data-table';
import { columns } from './(components)/(table)/columns';

export default function ProductsPage() {
  const { store, loading: loadingStore } = useStore();
  const { products, loading: loadingProducts } = useProducts({
    storeId: store?.id,
  });
  const loading = loadingStore || loadingProducts;

  if (loading || !products) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button asChild>
          <Link href={`${DASHBOARD_PAGE_LINK}/products/create`}>
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Link>
        </Button>
      </div>
      <DataTable columns={columns} data={products} />
    </div>
  );
}
