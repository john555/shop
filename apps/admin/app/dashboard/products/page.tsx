'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Plus, Search } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/admin/hooks/store';
import { useProducts } from '@/admin/hooks/product';
import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { useRouter } from 'next/navigation';

export default function ProductsPage() {
  const router = useRouter();
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

      {!products?.length ? (
        <div>No products found</div>
      ) : (
        <>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search products" className="pl-8" />
            </div>
            <Button variant="outline">Filter</Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Available</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.map((product) => (
                <TableRow
                  key={product.id}
                  onClick={() =>
                    router.push(`${DASHBOARD_PAGE_LINK}/products/${product.id}`)
                  }
                >
                  <TableCell className="font-medium">{product.title}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>${product.price.toFixed(2)}</TableCell>
                  <TableCell>{product.available}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}
