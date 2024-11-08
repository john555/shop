'use client';

import { useEffect, useState } from 'react';
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
import { Form, FormMessage } from '@/components/ui/form';
import { PersonalInformation } from './(components)/personal-information';
import { Localization } from './(components)/localization';
import { PasswordChange } from './(components)/password-change';
import { accountFormSchema, AccountFormValues } from './(types)/account-types';
import { useCurrentUser } from '@/common/hooks/auth/use-current-user';
import { updateUser, updateUserPassword } from '@/common/actions/user';
import { User } from '@/types/api';
import { toast } from "sonner"

export default function SettingsAccountPage() {
  const { user } = useCurrentUser();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
  });

  const hasChanges =
    form.formState.dirtyFields &&
    Object.keys(form.formState.dirtyFields).length > 0;

  useEffect(() => {
    if (!user) return;
    resetForm(user);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  function resetForm(user: User) {
    form.reset({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email,
      timeZone: user.timeZone || '',
      language: user.language || '',
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  }

  async function onSubmit(data: AccountFormValues) {
    if (!user?.id) return;
    setIsUpdating(true);
    const changedFields = form.formState.dirtyFields;
    const values = form.getValues();
    const passwordFields = ['oldPassword', 'newPassword'];

    const accountChanges = Object.keys(changedFields).reduce((acc, key) => {
      // ignore password fields
      if ([...passwordFields, 'confirmPassword'].includes(key)) {
        return acc;
      }
      // @ts-expect-error - TS doesn't know the key is a valid key
      acc[key] = values[key];
      return acc;
    }, {});

    const passwordChanges = Object.keys(changedFields).reduce((acc, key) => {
      if (!passwordFields.includes(key)) {
        return acc;
      }
      // @ts-expect-error - TS doesn't know the key is a valid key
      acc[key] = values[key];
      return acc;
    }, {} as { oldPassword: string; newPassword: string });

    const updates = [];

    if (Object.keys(accountChanges).length > 0) {
      updates.push(updateUser({ id: user.id, ...accountChanges }));
    }

    if (Object.keys(passwordChanges).length > 0) {
      updates.push(
        updateUserPassword({
          id: user.id,
          oldPassword: passwordChanges.oldPassword,
          newPassword: passwordChanges.newPassword,
        })
      );
    }

    const [updatedUser] = await Promise.all(updates)
      .then((results) => {
        toast.success("User updated", {
          description: "User updated successfully",
        })
        return results;
      })
      .catch((error) => {
        toast.error("Failed to update user", {
          description: error.message,
        })
        return [];
      })
      .finally(() => {
        setIsUpdating(false);
      });

    if (updatedUser) {
      resetForm(updatedUser);
    }
  }

  return (
    <div className="container max-w-3xl mx-auto px-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Account Settings</h1>
      </div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 pb-16"
        >
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
                Update your password here. Please enter your old password to
                confirm the changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PasswordChange form={form} />
            </CardContent>
          </Card>

          {hasChanges && (
            <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-md p-4 flex justify-end items-center z-50">
              <FormMessage />
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? 'Saving Changes..' : 'Save Changes'}
              </Button>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
