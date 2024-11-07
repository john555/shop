import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
  Store,
  MapPin,
  MessageCircle,
  Facebook,
  Instagram,
  Pencil,
  Edit2,
} from 'lucide-react';
import { useStore } from '@/admin/hooks/store/use-store';
import { useState } from 'react';
import { EditProfileDialog } from './edit-profile-dialog';
import { EditAddressDialog } from './edit-address-dialog';
import { EditSocialMediaDialog } from './edit-social-media-dialog';
import { AddressType } from '@/types/api';

export function StoreDetailsCard() {
  const { store, loading } = useStore();
  const address = store?.addresses?.find(
    (a) => a.type === AddressType.Registered
  )?.address;

  const [isEditProfileDialogOpen, setIsEditProfileDialogOpen] = useState(false);
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
  const [isEditSocialMediaDialogOpen, setIsEditSocialMediaDialogOpen] =
    useState(false);

  function onEditAddress(): void {
    setIsEditAddressDialogOpen(true);
  }

  function onEditProfile(): void {
    setIsEditProfileDialogOpen(true);
  }

  function onEditSocialMedia(): void {
    setIsEditSocialMediaDialogOpen(true);
  }

  if (loading && !store) return <div>Loading...</div>;

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-base font-medium">Store details</CardTitle>
        </CardHeader>
        <CardContent className="p-4 pt-2 space-y-3">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Store className="h-5 w-5 text-muted-foreground" />
                <span className="font-medium">{store?.name}</span>
              </div>
              <div className="text-sm text-muted-foreground pl-8">
                <div>{store?.phone || 'No phone'}</div>
                <div>{store?.email}</div>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEditProfile}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Business address</div>
                {address ? (
                  <div className="text-muted-foreground">
                    {address.line1}, {address.line2 && `${address.line2}, `}
                    {address.city}, {address.state}, {address.country}{' '}
                    {address.zipCode}
                  </div>
                ) : (
                  <div className="text-muted-foreground">No address</div>
                )}
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onEditAddress}
            >
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <div className="py-2">
            <Separator />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Contact and Social Media</h3>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onEditSocialMedia}
              >
                <Edit2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <MessageCircle className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-muted-foreground">
                    {store?.whatsApp || 'No WhatsApp number'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Facebook className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Facebook</div>
                  <div className="text-muted-foreground">
                    {store?.facebook || 'No Facebook'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Instagram className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Instagram</div>
                  <div className="text-muted-foreground">
                    {store?.instagram || 'No Instagram'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      <EditProfileDialog
        isOpen={isEditProfileDialogOpen}
        onOpenChange={setIsEditProfileDialogOpen}
      />

      <EditAddressDialog
        isOpen={isEditAddressDialogOpen}
        onOpenChange={setIsEditAddressDialogOpen}
      />

      <EditSocialMediaDialog
        isOpen={isEditSocialMediaDialogOpen}
        onOpenChange={setIsEditSocialMediaDialogOpen}
      />
    </>
  );
}
