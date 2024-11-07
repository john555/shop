import Link from 'next/link';
import { useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ValidatedInput } from './validated-input';
import { StoreDefaults } from '../(libs)/types';

interface StoreDefaultsCardProps {
  storeDefaults: StoreDefaults;
  setStoreDefaults: React.Dispatch<React.SetStateAction<StoreDefaults>>;
  setChangedFields: React.Dispatch<React.SetStateAction<Record<string, any>>>;
  setHasChanges: React.Dispatch<React.SetStateAction<boolean>>;
  handleUnitSystemChange: (value: 'metric' | 'imperial') => void;
}

export function StoreDefaultsCard({
  storeDefaults,
  setStoreDefaults,
  setChangedFields,
  setHasChanges,
  handleUnitSystemChange,
}: StoreDefaultsCardProps) {
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext();

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium">Store defaults</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-4">
        {/* Currency Display */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Currency display</h3>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  {storeDefaults.currency === 'UGX'
                    ? 'Ugandan Shilling (UGX)'
                    : storeDefaults.currency === 'KES'
                    ? 'Kenyan Shilling (KES)'
                    : storeDefaults.currency === 'TZS'
                    ? 'Tanzanian Shilling (TZS)'
                    : storeDefaults.currency === 'RWF'
                    ? 'Rwandan Franc (RWF)'
                    : storeDefaults.currency === 'BIF'
                    ? 'Burundian Franc (BIF)'
                    : storeDefaults.currency === 'SSP'
                    ? 'South Sudanese Pound (SSP)'
                    : 'Select Currency'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onSelect={() => {
                    setStoreDefaults((prev) => ({
                      ...prev,
                      currency: 'UGX',
                      currencySymbol: 'USh',
                    }));
                    setChangedFields((prev) => ({
                      ...prev,
                      currency: 'UGX',
                      currencySymbol: 'USh',
                    }));
                    setHasChanges(true);
                  }}
                >
                  Ugandan Shilling (UGX)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setStoreDefaults((prev) => ({
                      ...prev,
                      currency: 'KES',
                      currencySymbol: 'KSh',
                    }));
                    setChangedFields((prev) => ({
                      ...prev,
                      currency: 'KES',
                      currencySymbol: 'KSh',
                    }));
                    setHasChanges(true);
                  }}
                >
                  Kenyan Shilling (KES)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setStoreDefaults((prev) => ({
                      ...prev,
                      currency: 'TZS',
                      currencySymbol: 'TSh',
                    }));
                    setChangedFields((prev) => ({
                      ...prev,
                      currency: 'TZS',
                      currencySymbol: 'TSh',
                    }));
                    setHasChanges(true);
                  }}
                >
                  Tanzanian Shilling (TZS)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setStoreDefaults((prev) => ({
                      ...prev,
                      currency: 'RWF',
                      currencySymbol: 'RF',
                    }));
                    setChangedFields((prev) => ({
                      ...prev,
                      currency: 'RWF',
                      currencySymbol: 'RF',
                    }));
                    setHasChanges(true);
                  }}
                >
                  Rwandan Franc (RWF)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setStoreDefaults((prev) => ({
                      ...prev,
                      currency: 'BIF',
                      currencySymbol: 'FBu',
                    }));
                    setChangedFields((prev) => ({
                      ...prev,
                      currency: 'BIF',
                      currencySymbol: 'FBu',
                    }));
                    setHasChanges(true);
                  }}
                >
                  Burundian Franc (BIF)
                </DropdownMenuItem>
                <DropdownMenuItem
                  onSelect={() => {
                    setStoreDefaults((prev) => ({
                      ...prev,
                      currency: 'SSP',
                      currencySymbol: '£',
                    }));
                    setChangedFields((prev) => ({
                      ...prev,
                      currency: 'SSP',
                      currencySymbol: '£',
                    }));
                    setHasChanges(true);
                  }}
                >
                  South Sudanese Pound (SSP)
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Currency symbol</Label>
            <ValidatedInput
              name="currencySymbol"
              value={storeDefaults.currencySymbol}
              onChange={(e) => {
                const newValue = e.target.value;
                setStoreDefaults((prev) => ({
                  ...prev,
                  currencySymbol: newValue,
                }));
                setChangedFields((prev) => ({
                  ...prev,
                  currencySymbol: newValue,
                }));
                setHasChanges(true);
                setValue('currencySymbol', newValue, { shouldValidate: true });
              }}
              placeholder="Enter currency symbol (e.g., $, €, £)"
            />
            {errors.currencySymbol?.message && (
              <p className="text-sm text-red-500">
                {errors.currencySymbol.message.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Currency position</Label>
            <Select
              value={storeDefaults.currencyPosition}
              onValueChange={(value: 'before' | 'after') => {
                setStoreDefaults((prev) => ({
                  ...prev,
                  currencyPosition: value,
                }));
                setChangedFields((prev) => ({
                  ...prev,
                  currencyPosition: value,
                }));
                setHasChanges(true);
              }}
              {...register('currencyPosition')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select currency position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="before">
                  Before amount (e.g., $100)
                </SelectItem>
                <SelectItem value="after">After amount (e.g., 100$)</SelectItem>
              </SelectContent>
            </Select>
            {errors.currencyPosition?.message && (
              <p className="text-sm text-red-500">
                {errors.currencyPosition.message.toString()}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="showCurrencyCode"
              checked={storeDefaults.showCurrencyCode}
              onCheckedChange={(checked: boolean) => {
                setStoreDefaults((prev) => ({
                  ...prev,
                  showCurrencyCode: checked,
                }));
                setChangedFields((prev) => ({
                  ...prev,
                  showCurrencyCode: checked,
                }));
                setHasChanges(true);
              }}
              {...register('showCurrencyCode')}
            />
            <Label htmlFor="showCurrencyCode">
              Show currency code (e.g., USD, UGX)
            </Label>
          </div>
          <div className="text-sm text-muted-foreground">
            Example:{' '}
            {storeDefaults.currencyPosition === 'before'
              ? storeDefaults.showCurrencyCode
                ? `${storeDefaults.currency} `
                : storeDefaults.currencySymbol
              : ''}
            100
            {storeDefaults.currencyPosition === 'after'
              ? storeDefaults.showCurrencyCode
                ? ` ${storeDefaults.currency}`
                : storeDefaults.currencySymbol
              : ''}
          </div>
        </div>

        {/* Unit System and Weight */}
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label className="font-medium">Unit system</Label>
            <Select
              value={storeDefaults.unitSystem}
              onValueChange={handleUnitSystemChange}
              {...register('unitSystem')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select unit system" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="metric">Metric system</SelectItem>
                <SelectItem value="imperial">Imperial system</SelectItem>
              </SelectContent>
            </Select>
            {errors.unitSystem?.message && (
              <p className="text-sm text-red-500">
                {errors.unitSystem.message.toString()}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label className="font-medium">Default weight unit</Label>
            <Select
              value={storeDefaults.weightUnit}
              onValueChange={(value: 'kg' | 'g' | 'lb' | 'oz') => {
                setStoreDefaults((prev) => ({ ...prev, weightUnit: value }));
                setChangedFields((prev) => ({ ...prev, weightUnit: value }));
                setHasChanges(true);
                setValue('weightUnit', value, { shouldValidate: true });
              }}
              {...register('weightUnit')}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select weight unit" />
              </SelectTrigger>
              <SelectContent>
                {storeDefaults.unitSystem === 'metric' ? (
                  <>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="g">Gram (g)</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="lb">Pound (lb)</SelectItem>
                    <SelectItem value="oz">Ounce (oz)</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            {errors.weightUnit?.message && (
              <p className="text-sm text-red-500">
                {errors.weightUnit.message.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Time Zone */}
        <div className="space-y-2">
          <Label className="font-medium">Time zone</Label>
          <Select
            value={storeDefaults.timeZone}
            onValueChange={(value) => {
              setStoreDefaults((prev) => ({ ...prev, timeZone: value }));
              setChangedFields((prev) => ({ ...prev, timeZone: value }));
              setHasChanges(true);
            }}
            {...register('timeZone')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time zone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eat">(GMT+03:00) East Africa Time</SelectItem>
              <SelectItem value="cat">
                (GMT+02:00) Central Africa Time
              </SelectItem>
              <SelectItem value="wat">(GMT+01:00) West Africa Time</SelectItem>
              <SelectItem value="gmt">
                (GMT+00:00) Greenwich Mean Time
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.timeZone && (
            <p className="text-sm text-red-500">{errors.timeZone?.message as string}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Sets the time for when orders and analytics are recorded
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          To change your user level time zone and language visit your{' '}
          <Link
            href="/settings/account"
            className="text-primary hover:underline"
          >
            account settings
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
