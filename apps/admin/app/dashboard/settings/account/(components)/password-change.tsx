import { Lock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { AccountFormValues } from '../(types)/account-types';

interface PasswordChangeProps {
  form: UseFormReturn<AccountFormValues>;
}

export function PasswordChange({ form }: PasswordChangeProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="currentPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Current Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  type="password"
                  placeholder="Enter current password"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="newPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>New Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  type="password"
                  placeholder="Enter new password"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm New Password</FormLabel>
            <FormControl>
              <div className="relative">
                <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  className="pl-8"
                  type="password"
                  placeholder="Confirm new password"
                  {...field}
                />
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
