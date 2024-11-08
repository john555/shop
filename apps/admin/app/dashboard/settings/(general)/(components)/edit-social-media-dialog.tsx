import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
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
import { useStore } from '@/admin/hooks/store/use-store';
import { useEffect } from 'react';

const socialMediaSchema = z.object({
  whatsApp: z.string(),
  facebook: z.string(),
  instagram: z.string(),
});

interface EditSocialMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSocialMediaDialog({
  isOpen,
  onOpenChange,
}: EditSocialMediaDialogProps) {
  const { store, updating, updateStore } = useStore();

  const {
    setValue,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      whatsApp: store?.whatsApp || '',
      facebook: store?.facebook || '',
      instagram: store?.instagram || '',
    },
  });

  useEffect(() => {
    if (store) {
      setValue('whatsApp', store?.whatsApp || '');
      setValue('facebook', store?.facebook || '');
      setValue('instagram', store.instagram || '');
    }
  }, [setValue, store]);

  const onSubmit = async (data: z.infer<typeof socialMediaSchema>) => {
    if (!store?.id) return;

    await updateStore({ id: store.id, ...data });

    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle>Edit Contact and Social Media</DialogTitle>
          <DialogDescription className="text-base">
            Update your store&apos;s contact and social media information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="whatsApp">WhatsApp</Label>
                <Input
                  id="whatsApp"
                  {...register('whatsApp')}
                  placeholder="+256 700 123456"
                />
                {errors.whatsApp && (
                  <p className="text-sm text-red-500">
                    {errors.whatsApp.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  WhatsApp number for customer support
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input id="facebook" {...register('facebook')} placeholder="" />
                {errors.facebook && (
                  <p className="text-sm text-red-500">
                    {errors.facebook.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Your Facebook page name or URL
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  {...register('instagram')}
                  placeholder="@YourUsername"
                />
                {errors.instagram && (
                  <p className="text-sm text-red-500">
                    {errors.instagram.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Your Instagram handle (with @)
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
            <Button type="submit" disabled={updating}>
              {updating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
