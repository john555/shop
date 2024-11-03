import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function TaxesSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Taxes</CardTitle>
        <CardDescription>Manage your tax settings</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="tax-calculation">Automatic tax calculation</Label>
          <Switch id="tax-calculation" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="vat-number">VAT Registration Number</Label>
          <Input id="vat-number" placeholder="Enter your VAT registration number" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tax-rate">Standard VAT Rate (%)</Label>
          <Input id="tax-rate" type="number" defaultValue="18" />
        </div>
        <Button variant="outline">Manage tax rates</Button>
      </CardContent>
    </Card>
  )
}