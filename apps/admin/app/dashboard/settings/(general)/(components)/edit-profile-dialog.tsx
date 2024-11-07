import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StoreProfile } from '../(libs)/types';
import { storeProfileSchema } from '../(libs)/schemas';

interface EditProfileDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storeProfile: StoreProfile;
  setStoreProfile: React.Dispatch<React.SetStateAction<StoreProfile>>;
  setChangedFields: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditProfileDialog({
  isOpen,
  onOpenChange,
  storeProfile,
  setStoreProfile,
  setChangedFields,
  setHasChanges,
}: EditProfileDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof storeProfileSchema>>({
    resolver: zodResolver(storeProfileSchema),
    defaultValues: storeProfile,
  });

  const onSubmit = (data: z.infer<typeof storeProfileSchema>) => {
    setStoreProfile((prevProfile) => ({
      ...prevProfile,
      ...data,
    }));
    setChangedFields((prev) => ({ ...prev, ...data }));
    setHasChanges(true);
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription className="text-base">
            Update your store&apos;s basic information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Store name</Label>
                <Input id="name" {...register('name')} />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Appears on your website and receipts
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Store phone</Label>
                <Input id="phone" type="tel" {...register('phone')} />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Include country code (e.g., +256 for Uganda)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Store email</Label>
                <Input id="email" type="email" {...register('email')} />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
                <p className="text-sm text-muted-foreground">
                  Receives messages about your store. For sender email, go to{' '}
                  <Link
                    href="/notification-settings"
                    className="text-primary hover:underline"
                  >
                    notification settings
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
