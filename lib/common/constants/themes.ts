import { Theme } from '@prisma/client';
import { Computer, Moon, Sun } from 'lucide-react';

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun | typeof Moon | typeof Computer;
  description: string;
}

export const THEMES: ThemeOption[] = [
  {
    value: Theme.LIGHT,
    label: 'Light',
    icon: Sun,
    description: 'Light theme for bright environments'
  },
  {
    value: Theme.DARK,
    label: 'Dark',
    icon: Moon,
    description: 'Dark theme for low-light environments'
  },
  {
    value: Theme.SYSTEM,
    label: 'System',
    icon: Computer,
    description: 'Follows your system theme preference'
  },
];

// Helper functions
export const getThemeLabel = (value: Theme): string => {
  return THEMES.find((theme) => theme.value === value)?.label || value;
};

export const getThemeIcon = (value: Theme) => {
  return THEMES.find((theme) => theme.value === value)?.icon || Computer;
};

export const getThemeDescription = (value: Theme): string => {
  return THEMES.find((theme) => theme.value === value)?.description || '';
};