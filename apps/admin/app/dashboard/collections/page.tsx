import { Button } from '@libs/components/ui/button';
import Link from 'next/link';
import * as React from 'react';

export default function CollectionsPage() {
  return (
    <div className="container mx-auto">
      <div className="flex flex-row justify-between items-center pb-4">
        <h3 className="text-xl text-slate-500">Collections</h3>
        <Link href="/dashboard/collections/new">
          <Button>Create collection</Button>
        </Link>
      </div>
    </div>
  );
}
