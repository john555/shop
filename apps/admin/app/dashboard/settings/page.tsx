'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

export default function SettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>General</CardTitle>
        <CardDescription>Manage your store information</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="store-name">Store name</Label>
          <Input id="store-name" placeholder="Your store name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="legal-name">Legal business name</Label>
          <Input id="legal-name" placeholder="Your legal business name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" type="tel" placeholder="Your phone number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="store-address">Store address</Label>
          <Textarea
            id="store-address"
            placeholder="Enter your store's physical address in Uganda"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="timezone">Store timezone</Label>
          <Select defaultValue="eat">
            <SelectTrigger id="timezone">
              <SelectValue placeholder="Select timezone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eat">East Africa Time (EAT)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="unit-system">Unit system</Label>
          <Select defaultValue="metric">
            <SelectTrigger id="unit-system">
              <SelectValue placeholder="Select unit system" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="metric">Metric system</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
