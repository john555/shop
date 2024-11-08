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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/admin/hooks/store/use-store';
import { useEffect } from 'react';
import { AddressOwnerType, AddressType } from '@/types/api';

const countries = [
  { value: 'UG', label: 'Uganda' },
  { value: 'KE', label: 'Kenya' },
  { value: 'TZ', label: 'Tanzania' },
  { value: 'RW', label: 'Rwanda' },
  { value: 'BI', label: 'Burundi' },
  { value: 'SS', label: 'South Sudan' },
  { value: 'ET', label: 'Ethiopia' },
  { value: 'SO', label: 'Somalia' },
  { value: 'CD', label: 'Democratic Republic of the Congo' },
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
];

export const addressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  city: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  zipCode: z.string().optional(),
});

interface EditAddressDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditAddressDialog({
  isOpen,
  onOpenChange,
}: EditAddressDialogProps) {
  const { store, updating, updateStoreAddress } = useStore();
  const addressOnOwner = store?.addresses?.find(
    (a) => a.type === AddressType.Registered
  );
  const address = addressOnOwner?.address;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<z.infer<typeof addressSchema>>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      country: address?.country || '',
      state: address?.state || '',
      city: address?.city || '',
      line1: address?.line1 || '',
      line2: address?.line2 || '',
      zipCode: address?.zipCode || '',
    },
  });

  useEffect(() => {
    if (store) {
      setValue('country', address?.country || '');
      setValue('state', address?.state || '');
      setValue('city', address?.city || '');
      setValue('line1', address?.line1 || '');
      setValue('line2', address?.line2 || '');
      setValue('zipCode', address?.zipCode || '');
    }
  }, [address, store, setValue]);

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    if (!addressOnOwner?.ownerId || !addressOnOwner?.ownerType) return;

    await updateStoreAddress({
      ownerId: addressOnOwner.ownerId,
      ownerType: AddressOwnerType.Store,
      type: AddressType.Registered,
      address: {
        ...data,
      },
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle>Edit business address</DialogTitle>
          <DialogDescription className="text-base">
            Update your business address information.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4 py-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select
                  onValueChange={(value) => setValue('country', value)}
                  defaultValue={address?.country || ''}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country.value} value={country.label}>
                        {country.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.country && (
                  <p className="text-sm text-red-500">
                    {errors.country.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State/Province/Region</Label>
                <Input id="state" {...register('state')} />
                {errors.state && (
                  <p className="text-sm text-red-500">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City/Town/Municipality</Label>
                <Input id="city" {...register('city')} />
                {errors.city && (
                  <p className="text-sm text-red-500">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="line1">Street address, building number</Label>
                <Input id="line1" {...register('line1')} />
                {errors.line1 && (
                  <p className="text-sm text-red-500">{errors.line1.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="line2">
                  Suite, apartment, unit number (optional)
                </Label>
                <Input id="line2" {...register('line2')} />
                {errors.line2 && (
                  <p className="text-sm text-red-500">{errors.line2.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">Postal/ZIP code</Label>
                <Input id="zipCode" {...register('zipCode')} />
                {errors.zipCode && (
                  <p className="text-sm text-red-500">
                    {errors.zipCode.message}
                  </p>
                )}
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
