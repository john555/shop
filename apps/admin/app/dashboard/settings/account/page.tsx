'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { PersonalInformation } from './(components)/personal-information';
import { Localization } from './(components)/localization';
import { PasswordChange } from './(components)/password-change';
import { accountFormSchema, AccountFormValues } from './(types)/account-types';

export default function SettingsAccountPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      language: 'en',
      timeZone: 'UTC',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: AccountFormValues) {
    setIsLoading(true);
    console.log(data);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }

  return (
    <div className="container max-w-3xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Account Settings</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Update your account details here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PersonalInformation form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Localization</CardTitle>
              <CardDescription>
                Customize your language and time zone preferences.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Localization form={form} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password here. Please enter your current password to
                confirm the changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PasswordChange form={form} />
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
