import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

export default function ShippingSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shipping</CardTitle>
        <CardDescription>Manage your shipping zones and rates</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="shipping-origin">Shipping origin</Label>
          <Textarea id="shipping-origin" placeholder="Enter your shipping origin address in Uganda" />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="shipping-rates">Show shipping rates</Label>
          <Switch id="shipping-rates" />
        </div>
        <Button variant="outline">Manage shipping zones</Button>
      </CardContent>
    </Card>
  )
}