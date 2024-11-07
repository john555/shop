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
import { StoreProfile } from '../(libs)/types';

const socialMediaSchema = z.object({
  whatsApp: z.string().min(1, 'WhatsApp number is required'),
  facebook: z.string().min(1, 'Facebook page name or URL is required'),
  instagram: z.string().min(1, 'Instagram handle is required'),
});

interface EditSocialMediaDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  storeProfile: StoreProfile;
  setStoreProfile: React.Dispatch<React.SetStateAction<StoreProfile>>;
  setChangedFields: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
}

export function EditSocialMediaDialog({
  isOpen,
  onOpenChange,
  storeProfile,
  setStoreProfile,
  setChangedFields,
  setHasChanges,
}: EditSocialMediaDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof socialMediaSchema>>({
    resolver: zodResolver(socialMediaSchema),
    defaultValues: {
      whatsApp: storeProfile.whatsApp,
      facebook: storeProfile.facebook,
      instagram: storeProfile.instagram,
    },
  });

  const onSubmit = (data: z.infer<typeof socialMediaSchema>) => {
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
                <Input
                  id="facebook"
                  {...register('facebook')}
                  placeholder="kampalacraftsug"
                />
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
                  placeholder="@kampalacrafts"
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
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
