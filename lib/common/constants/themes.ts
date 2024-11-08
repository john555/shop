
import { Laptop, Moon, Sun } from 'lucide-react';
import { Theme } from '../types';

export interface ThemeOption {
  value: Theme;
  label: string;
  icon: typeof Sun | typeof Moon | typeof Laptop;
  description: string;
}

export const THEMES: ThemeOption[] = [
  {
    value: Theme.Light,
    label: 'Light',
    icon: Sun,
    description: 'Light theme for bright environments'
  },
  {
    value: Theme.Dark,
    label: 'Dark',
    icon: Moon,
    description: 'Dark theme for low-light environments'
  },
  {
    value: Theme.System,
    label: 'System',
    icon: Laptop,
    description: 'Follows your system theme preference'
  },
];

// Helper functions
export const getThemeLabel = (value: Theme): string => {
  return THEMES.find((theme) => theme.value === value)?.label || value;
};

export const getThemeIcon = (value: Theme) => {
  return THEMES.find((theme) => theme.value === value)?.icon || Laptop;
};

export const getThemeDescription = (value: Theme): string => {
  return THEMES.find((theme) => theme.value === value)?.description || '';
};