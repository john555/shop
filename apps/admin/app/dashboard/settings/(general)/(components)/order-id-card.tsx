import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

export function OrderIdCard() {
  const { control, watch } = useFormContext();
  const prefix = watch('orderPrefix');
  const suffix = watch('orderSuffix');

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-base font-medium">Order ID</CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-2 space-y-3">
        <p className="text-sm text-muted-foreground">
          Shown on the order page, customer pages, and customer order
          notifications to identify order
        </p>

        <div className="grid gap-6 sm:grid-cols-2">
          <FormField
            control={control}
            name="orderPrefix"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Prefix</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name="orderSuffix"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel>Suffix</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Your order ID will appear as {prefix}1001{suffix}, {prefix}1002
          {suffix}, {prefix}1003{suffix} ...
        </p>
      </CardContent>
    </Card>
  );
}
