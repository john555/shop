import Link from 'next/link';
import {
  ControllerRenderProps,
  FieldValues,
  useFormContext,
} from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useStore } from '@/admin/hooks/store/use-store';
import { CurrencyPosition, UnitSystem, WeightUnit } from '@/types/admin-api';
import { Input } from '@/components/ui/input';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { currencyLabels } from '@/common/constants/currency';
import { TIMEZONES } from '@/common/constants/timezone';
import { formatPrice } from '@/common/currency';

export function StoreDefaultsCard() {
  const { store } = useStore();

  const { control, watch, setValue } = useFormContext();
  const currencyPosition = watch('currencyPosition');
  const currencySymbol = watch('currencySymbol');
  const currency = watch('currency');
  const showCurrencyCode = watch('showCurrencyCode');
  const unitSystem = watch('unitSystem');

  const handleUnitSystemChange =
    (field: ControllerRenderProps<FieldValues, 'unitSystem'>) =>
    (value: UnitSystem) => {
      field.onChange(value);
      setValue(
        'weightUnit',
        value === UnitSystem.Metric ? WeightUnit.Kilogram : WeightUnit.Pound,
        {
          shouldDirty: true,
        }
      );
    };

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
            {store?.currency ? (
              <Button variant="outline" disabled>
                {currencyLabels[store.currency]}
              </Button>
            ) : null}
          </div>
          <FormField
            control={control}
            name="currencySymbol"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-medium">Currency symbol</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Enter currency symbol (e.g., $, €, £)"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="currencyPosition"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-medium">Currency position</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency position" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={CurrencyPosition.BeforeAmount}>
                      Before amount (e.g.,{' '}
                      {formatPrice(1000, {
                        currencyPosition: CurrencyPosition.BeforeAmount,
                        showCurrencyCode,
                        currencySymbol,
                        currency,
                      })}
                      )
                    </SelectItem>
                    <SelectItem value={CurrencyPosition.AfterAmount}>
                      After amount (e.g.,{' '}
                      {formatPrice(1000, {
                         currencyPosition: CurrencyPosition.AfterAmount,
                        showCurrencyCode,
                        currencySymbol,
                        currency,
                      })}
                      )
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="showCurrencyCode"
            render={({ field }) => (
              <FormItem className="flex flex-row space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Show currency code (e.g., USD, UGX)</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="text-sm text-muted-foreground">
            Example:{' '}
            {formatPrice(1000, {
              currencyPosition,
              showCurrencyCode,
              currencySymbol,
              currency,
            })}
          </div>
        </div>

        {/* Unit System and Weight */}
        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={control}
            name="unitSystem"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-medium">Unit system</FormLabel>
                <Select
                  onValueChange={handleUnitSystemChange(field)}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select unit system" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={UnitSystem.Metric}>
                      Metric system
                    </SelectItem>
                    <SelectItem value={UnitSystem.Imperial}>
                      Imperial system
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="weightUnit"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="font-medium">
                  Default weight unit
                </FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select weight unit" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {unitSystem === UnitSystem.Metric ? (
                      <>
                        <SelectItem value={WeightUnit.Kilogram}>
                          Kilogram (kg)
                        </SelectItem>
                        <SelectItem value={WeightUnit.Gram}>
                          Gram (g)
                        </SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value={WeightUnit.Pound}>
                          Pound (lb)
                        </SelectItem>
                        <SelectItem value={WeightUnit.Ounce}>
                          Ounce (oz)
                        </SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
        </div>

        {/* Time Zone */}
        <FormField
          control={control}
          name="timeZone"
          render={({ field }) => (
            <FormItem className="space-y-2">
              <FormLabel className="font-medium">Time zone</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select time zone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {TIMEZONES.map((timeZoneGroup) => (
                    <SelectGroup key={timeZoneGroup.label}>
                      <SelectLabel>{timeZoneGroup.label}</SelectLabel>
                      {timeZoneGroup.timezones.map((timeZone) => (
                        <SelectItem key={timeZone.value} value={timeZone.value}>
                          {timeZone.label} ({timeZone.offset})
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Sets the time for when orders and analytics are recorded
              </FormDescription>
            </FormItem>
          )}
        />

        <p className="text-sm text-muted-foreground">
          To change your user level time zone and language visit your{' '}
          <Link
            href="/dashboard/settings/account"
            className="text-primary hover:underline"
          >
            account settings
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
