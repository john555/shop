import { z } from 'zod';

export const accountFormSchema = z
  .object({
    firstName: z.string().min(2, {
      message: 'First name must be at least 2 characters.',
    }),
    lastName: z.string().min(2, {
      message: 'Last name must be at least 2 characters.',
    }),
    email: z.string().email({
      message: 'Please enter a valid email address.',
    }),
    language: z.string({
      required_error: 'Please select a language.',
    }),
    timeZone: z.string({
      required_error: 'Please select a time zone.',
    }),
    currentPassword: z.string().min(8, {
      message: 'Current password must be at least 8 characters.',
    }),
    newPassword: z.string().min(8, {
      message: 'New password must be at least 8 characters.',
    }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters.',
    }),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type AccountFormValues = z.infer<typeof accountFormSchema>;

export const languages = [
  { value: 'en', label: 'English' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'es', label: 'Spanish' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ru', label: 'Russian' },
  { value: 'ja', label: 'Japanese' },
  { value: 'ko', label: 'Korean' },
  { value: 'zh', label: 'Chinese' },
];

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
