'use client';

import { DASHBOARD_PAGE_LINK } from '@/common/constants';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCollections } from '@/admin/hooks/collection';
import { useStore } from '@/admin/hooks/store';
import { DataTable } from './(components)/(table)/data-table';
import { createColumns } from './(components)/(table)/columns';
import { useState } from 'react';
import { Collection } from '@/types/admin-api';

export default function CollectionsPage() {
  const [activeCollection, setActiveCollection] = useState<Collection>();
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>();
  const router = useRouter();
  const { store } = useStore();
  const { collections, bulkDeleteCollections } = useCollections({
    storeId: store?.id,
  });

  const handleDeleteActionClick = (collection: Collection) => {
    setActiveCollection(collection);
    setDeleteModalOpen(true);
  };

  const handleDeleteConfirmationClick = async () => {
    if (!store || !activeCollection) return;

    await bulkDeleteCollections([activeCollection?.id]);
  };

  const columns = createColumns({ handleDeleteActionClick });
  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Collections</h1>
          <Button
            onClick={() =>
              router.push(`${DASHBOARD_PAGE_LINK}/collections/create`)
            }
          >
            <Plus className="mr-2 h-4 w-4" /> Add Collection
          </Button>
        </div>
        <DataTable data={collections} columns={columns} />
      </div>
      <AlertDialog open={deleteModalOpen} onOpenChange={setDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              collection
              <span className="font-semibold"> {activeCollection?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirmationClick}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
