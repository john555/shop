import { Language } from '@prisma/client';

export interface LanguageOption {
  value: Language;
  label: string;
  locale: string;
}

export const LANGUAGES: LanguageOption[] = [
  {
    value: Language.EN,
    label: 'English',
    locale: 'en',
  },
  {
    value: Language.SW,
    label: 'Kiswahili',
    locale: 'sw',
  },
  {
    value: Language.FR,
    label: 'Français',
    locale: 'fr',
  },
  {
    value: Language.AR,
    label: 'العربية',
    locale: 'ar',
  },
  {
    value: Language.RW,
    label: 'Kinyarwanda',
    locale: 'rw',
  },
  {
    value: Language.LG,
    label: 'Luganda',
    locale: 'lg',
  },
];

// Helper functions
export const getLanguageLabel = (value: Language): string => {
  return LANGUAGES.find((lang) => lang.value === value)?.label || value;
};

export const getLanguageLocale = (value: Language): string => {
  return LANGUAGES.find((lang) => lang.value === value)?.locale || 'en';
};
