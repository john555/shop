import { useFormContext } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ValidatedInput } from './validated-input';
import { OrderId } from '../(libs)/types';

interface OrderIdCardProps {
  orderId: OrderId;
  handleOrderIdInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function OrderIdCard({
  orderId,
  handleOrderIdInputChange,
}: OrderIdCardProps) {
  const {
    formState: { errors },
  } = useFormContext();

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
          <div className="space-y-2">
            <Label htmlFor="orderIdPrefix">Prefix</Label>
            <ValidatedInput
              name="orderIdPrefix"
              onChange={handleOrderIdInputChange}
            />
            {errors.orderIdPrefix && (
              <p className="text-sm text-red-500">
                {typeof errors.orderIdPrefix.message === 'string' && errors.orderIdPrefix.message}
              </p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="orderIdSuffix">Suffix</Label>
            <ValidatedInput
              name="orderIdSuffix"
              onChange={handleOrderIdInputChange}
            />
            {errors.orderIdSuffix && (
              <p className="text-sm text-red-500">
                {typeof errors.orderIdSuffix.message === 'string' && errors.orderIdSuffix.message}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Your order ID will appear as {orderId.prefix}1001{orderId.suffix},{' '}
          {orderId.prefix}1002{orderId.suffix}, {orderId.prefix}1003
          {orderId.suffix} ...
        </p>
      </CardContent>
    </Card>
  );
}
