import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

export default function PaymentsSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payments</CardTitle>
        <CardDescription>Manage your payment providers and settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="payment-provider">Payment provider</Label>
          <Select>
            <SelectTrigger id="payment-provider">
              <SelectValue placeholder="Select payment provider" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="mtn">MTN Mobile Money</SelectItem>
              <SelectItem value="airtel">Airtel Money</SelectItem>
              <SelectItem value="pesapal">Pesapal</SelectItem>
              <SelectItem value="flutterwave">Flutterwave</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="currency">Store currency</Label>
          <Select defaultValue="ugx">
            <SelectTrigger id="currency">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ugx">UGX (Ugandan Shilling)</SelectItem>
              <SelectItem value="usd">USD (US Dollar)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="capture-payment">Capture payment automatically</Label>
          <Switch id="capture-payment" />
        </div>
      </CardContent>
    </Card>
  )
}