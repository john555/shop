import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { FormField, FormItem, FormControl } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn, useFieldArray } from 'react-hook-form';
import { FormValues } from './types';

interface VariantPricingInventoryCardProps {
  form: UseFormReturn<FormValues>;
}

export function VariantPricingInventoryCard({
  form,
}: VariantPricingInventoryCardProps) {
  const {
    fields: optionFields,
    append: appendOption,
    remove: removeOption,
    move: moveOption,
  } = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const { fields: variantFields } = useFieldArray({
    control: form.control,
    name: 'variants',
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variant Pricing and Inventory</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              {optionFields.map((option, index) => (
                <TableHead key={option.id}>
                  {form.watch(`options.${index}.name`)}
                </TableHead>
              ))}
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {variantFields.map((field, index) => (
              <TableRow key={field.id}>
                <TableCell>
                  <Checkbox />
                </TableCell>
                {optionFields.map((option, optionIndex) => (
                  <TableCell key={option.id}>
                    {form.watch(`variants.${index}.optionCombination.${optionIndex}`) || ''}
                  </TableCell>
                ))}
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`variants.${index}.price`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
                <TableCell>
                  <FormField
                    control={form.control}
                    name={`variants.${index}.available`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            {...field}
                            onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}