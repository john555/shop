import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UseFormReturn } from 'react-hook-form';
import { FormValues } from './types';

interface ProductOrganizationCardProps {
  form: UseFormReturn<FormValues>;
}

export function ProductOrganizationCard({
  form,
}: ProductOrganizationCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Product organization</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange([...field.value, value])
                }
                value={field.value[field.value.length - 1]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="tag1">Tag1</SelectItem>
                  <SelectItem value="tag2">Tag2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="collections"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Collections</FormLabel>
              <Select
                onValueChange={(value) =>
                  field.onChange([...field.value, value])
                }
                value={field.value[field.value.length - 1]}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="collection1">Collection1</SelectItem>
                  <SelectItem value="collection2">Collection2</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
