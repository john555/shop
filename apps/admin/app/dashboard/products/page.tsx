'use client';

import { ProductsTable } from '@/lib/admin/features/products-table';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import * as React from 'react';


export default function ProductsPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between items-center pb-4">
        <h3 className="text-xl text-slate-500">Products</h3>
        <Link href="/dashboard/products/new">
          <Button>Create product</Button>
        </Link>
      </div>
      <ProductsTable />
    </div>
  );
}
