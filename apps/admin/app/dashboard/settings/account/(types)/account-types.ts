import { Language } from '@/types/api';
import { z } from 'zod';

export const accountFormSchema = z
  .object({
    firstName: z
      .string()
      .min(2, {
        message: 'First name must be at least 2 characters.',
      })
      .optional(),
    lastName: z
      .string()
      .min(2, {
        message: 'Last name must be at least 2 characters.',
      })
      .optional(),
    email: z
      .string()
      .email({
        message: 'Please enter a valid email address.',
      })
      .optional(),
    language: z
      .nativeEnum(Language, {
        required_error: 'Please select a language.',
      })
      .optional(),
    timeZone: z
      .string({
        required_error: 'Please select a time zone.',
      })
      .optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => !data.newPassword || data.oldPassword, {
    message: 'Old password is required',
    path: ['oldPassword'],
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const timeZones = [
  { value: 'UTC', label: '(UTC+00:00) Coordinated Universal Time' },
  {
    value: 'America/New_York',
    label: '(UTC-05:00) Eastern Time (US & Canada)',
  },
  { value: 'America/Chicago', label: '(UTC-06:00) Central Time (US & Canada)' },
  { value: 'America/Denver', label: '(UTC-07:00) Mountain Time (US & Canada)' },
  {
    value: 'America/Los_Angeles',
    label: '(UTC-08:00) Pacific Time (US & Canada)',
  },
  { value: 'Europe/London', label: '(UTC+00:00) London, Edinburgh, Dublin' },
  { value: 'Europe/Paris', label: '(UTC+01:00) Paris, Berlin, Rome, Madrid' },
  { value: 'Asia/Tokyo', label: '(UTC+09:00) Tokyo, Seoul' },
  { value: 'Australia/Sydney', label: '(UTC+10:00) Sydney, Melbourne' },
];
