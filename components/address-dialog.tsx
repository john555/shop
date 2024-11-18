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
import { useEffect } from 'react';
import { AddressOwnerType, AddressType } from '@/types/api';
import { COUNTRIES } from '@/common/constants';
import { useAddressOwner } from '@/admin/hooks/address-owner';

export const addressSchema = z.object({
  country: z.string().min(1, 'Country is required'),
  state: z.string().optional(),
  city: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  zipCode: z.string().optional(),
});

interface AddressDialogProps {
  ownerId: string;
  addressOwnerId?: string;
  ownerType: AddressOwnerType;
  type: AddressType;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete?: () => void;
}

export function AddressDialog({
  ownerId,
  type,
  ownerType,
  addressOwnerId,
  isOpen,
  onOpenChange,
  onComplete,
}: AddressDialogProps) {
  const {
    addressOnOwner,
    updating,
    creating,
    createAddressOwner,
    updateAddressOwner,
  } = useAddressOwner(addressOwnerId);

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
    if (!address) {
      return;
    }
    setValue('country', address.country || '');
    setValue('state', address.state || '');
    setValue('city', address.city || '');
    setValue('line1', address.line1 || '');
    setValue('line2', address.line2 || '');
    setValue('zipCode', address.zipCode || '');
  }, [address, setValue]);

  const onSubmit = async (data: z.infer<typeof addressSchema>) => {
    const addressData = {
      country: data.country as string,
      state: data.state as string,
      city: data.city as string,
      line1: data.line1 as string,
      line2: data.line2 as string,
      zipCode: data.zipCode as string,
    };
    try {
      if (addressOnOwner) {
        await updateAddressOwner({
          id: addressOwnerId,
          address: addressData,
        });
      } else {
        await createAddressOwner({
          ownerId,
          ownerType,
          type,
          isDefault: true,
          address: addressData,
        });
      }

      if (onComplete) {
        onComplete();
      }

      onOpenChange(false);
    } catch (error) {
      console.error('Failed to save address:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto p-4">
        <DialogHeader className="pb-2">
          <DialogTitle>
            {addressOnOwner ? 'Edit' : 'Create'} {type.toLowerCase()} address
          </DialogTitle>
          <DialogDescription className="text-base">
            {addressOnOwner
              ? `Update ${type.toLowerCase()} address information.`
              : `Add ${type.toLowerCase()} address information.`}
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
                    {COUNTRIES.map((country) => (
                      <SelectItem key={country.code} value={country.code}>
                        {country.flag} {country.name}
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
              {updating || creating ? 'Saving...' : 'Save'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
