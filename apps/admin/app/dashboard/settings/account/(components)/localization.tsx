import { Globe, Languages } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
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
import { AccountFormValues, timeZones } from '../(types)/account-types';
import { LANGUAGES, TIMEZONES } from '@/common/constants';

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
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a language" />
                  </div>
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {LANGUAGES.map((language) => (
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
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <div className="flex items-center">
                    <Globe className="mr-2 h-4 w-4 text-muted-foreground" />
                    <SelectValue placeholder="Select a time zone" />
                  </div>
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
