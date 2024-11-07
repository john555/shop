import { Globe, Languages } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import {
  AccountFormValues,
  languages,
  timeZones,
} from '../(types)/account-types';

interface LocalizationProps {
  form: UseFormReturn<AccountFormValues>;
}

export function Localization({ form }: LocalizationProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="language"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Language</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a language" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {languages.map((language) => (
                  <SelectItem key={language.value} value={language.value}>
                    {language.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              This is the language that will be used in the user interface.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="timeZone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time Zone</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a time zone" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {timeZones.map((timeZone) => (
                  <SelectItem key={timeZone.value} value={timeZone.value}>
                    {timeZone.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormDescription>
              Choose the time zone for accurate time display across the
              application.
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
