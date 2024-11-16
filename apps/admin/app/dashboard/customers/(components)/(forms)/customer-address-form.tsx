import { COUNTRIES } from '@/common/constants';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

type CustomerFormProps = {
  isAddressDialogOpen: boolean;
  setIsAddressDialogOpen: (value: boolean) => void;
};

const addressSchema = z.object({
  country: z.string().min(1, 'Country is required').optional(),
  state: z.string().optional(),
  city: z.string().optional(),
  line1: z.string().optional(),
  line2: z.string().optional(),
  zipCode: z.string().optional(),
});

type CustomerAddressFormValues = z.infer<typeof addressSchema>;

const getInitialValues = () => {
  return {
    country: '',
    state: '',
    city: '',
    line1: '',
    line2: '',
    zipCode: '',
  };
};

export function CustomerAddressForm({
  isAddressDialogOpen,
  setIsAddressDialogOpen,
}: CustomerFormProps) {
  const form = useForm<CustomerAddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: getInitialValues(),
  });

  const onSubmit = async (data: CustomerAddressFormValues) => {
    console.log(data);
  };

  return (
    <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add / Update Address</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setIsAddressDialogOpen(false);
            }}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="line1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street address, building number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="line2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Suite, apartment, unit number</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/town/municipality</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zipCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal/ZIP code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country.code} value={country.code}>
                            {country.flag} {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Save Address
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
