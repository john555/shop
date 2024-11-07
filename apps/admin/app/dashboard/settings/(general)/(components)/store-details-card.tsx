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
import { StoreProfile, Address } from '../(libs)/types';

interface StoreDetailsCardProps {
  storeProfile: StoreProfile;
  address: Address;
  onEditProfile: () => void;
  onEditAddress: () => void;
  onEditSocialMedia: () => void;
}

export function StoreDetailsCard({
  storeProfile,
  address,
  onEditProfile,
  onEditAddress,
  onEditSocialMedia,
}: StoreDetailsCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium">Store details</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <div className="flex items-center justify-between py-3 border-b">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Store className="h-5 w-5 text-muted-foreground" />
              <span className="font-medium">{storeProfile.name}</span>
            </div>
            <div className="text-sm text-muted-foreground pl-8">
              <div>{storeProfile.phone}</div>
              <div>{storeProfile.email}</div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onEditProfile}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="font-medium">Business address</div>
              <div className="text-muted-foreground">
                {address.line1}, {address.line2 && `${address.line2}, `}
                {address.city}, {address.state}, {address.country}{' '}
                {address.zipCode}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onEditAddress}>
            <Pencil className="h-4 w-4" />
          </Button>
        </div>
        <div className="py-2">
          <Separator />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Contact and Social Media</h3>
            <Button variant="ghost" size="icon" onClick={onEditSocialMedia}>
              <Edit2 className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">WhatsApp</div>
                <div className="text-muted-foreground">
                  {storeProfile.whatsApp}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Facebook className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Facebook</div>
                <div className="text-muted-foreground">
                  {storeProfile.facebook}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Instagram className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="font-medium">Instagram</div>
                <div className="text-muted-foreground">
                  {storeProfile.instagram}
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
