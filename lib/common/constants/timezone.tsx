import { Clock } from 'lucide-react';

export interface TimezoneOption {
  value: string;
  label: string;
  abbr: string;
  offset: string;
  region: 'Africa' | 'Europe' | 'Asia' | 'Other';
}

export interface TimezoneRegion {
  label: string;
  timezones: TimezoneOption[];
}

export const TIMEZONES: TimezoneRegion[] = [
  {
    label: 'Africa',
    timezones: [
      {
        value: 'Africa/Nairobi',
        label: 'Nairobi',
        abbr: 'EAT',
        offset: 'UTC+3',
        region: 'Africa',
      },
      {
        value: 'Africa/Dar_es_Salaam',
        label: 'Dar es Salaam',
        abbr: 'EAT',
        offset: 'UTC+3',
        region: 'Africa',
      },
      {
        value: 'Africa/Kampala',
        label: 'Kampala',
        abbr: 'EAT',
        offset: 'UTC+3',
        region: 'Africa',
      },
      {
        value: 'Africa/Kigali',
        label: 'Kigali',
        abbr: 'CAT',
        offset: 'UTC+2',
        region: 'Africa',
      },
      {
        value: 'Africa/Bujumbura',
        label: 'Bujumbura',
        abbr: 'CAT',
        offset: 'UTC+2',
        region: 'Africa',
      },
      {
        value: 'Africa/Juba',
        label: 'Juba',
        abbr: 'EAT',
        offset: 'UTC+3',
        region: 'Africa',
      },
      {
        value: 'Africa/Cairo',
        label: 'Cairo',
        abbr: 'EET',
        offset: 'UTC+2',
        region: 'Africa',
      },
      {
        value: 'Africa/Lagos',
        label: 'Lagos',
        abbr: 'WAT',
        offset: 'UTC+1',
        region: 'Africa',
      },
    ],
  },
  {
    label: 'Europe',
    timezones: [
      {
        value: 'Europe/London',
        label: 'London',
        abbr: 'GMT/BST',
        offset: 'UTC+0/1',
        region: 'Europe',
      },
      {
        value: 'Europe/Paris',
        label: 'Paris',
        abbr: 'CET/CEST',
        offset: 'UTC+1/2',
        region: 'Europe',
      },
    ],
  },
  {
    label: 'Asia',
    timezones: [
      {
        value: 'Asia/Dubai',
        label: 'Dubai',
        abbr: 'GST',
        offset: 'UTC+4',
        region: 'Asia',
      },
      {
        value: 'Asia/Riyadh',
        label: 'Riyadh',
        abbr: 'AST',
        offset: 'UTC+3',
        region: 'Asia',
      },
    ],
  },
];

// Helper functions
export const getTimezoneLabel = (value: string): string => {
  for (const region of TIMEZONES) {
    const timezone = region.timezones.find((tz) => tz.value === value);
    if (timezone) {
      return `${timezone.label} (${timezone.offset})`;
    }
  }
  return value;
};

export const getTimezoneOffset = (value: string): string => {
  for (const region of TIMEZONES) {
    const timezone = region.timezones.find((tz) => tz.value === value);
    if (timezone) {
      return timezone.offset;
    }
  }
  return 'UTC+0';
};

export const getFlatTimezones = (): TimezoneOption[] => {
  return TIMEZONES.reduce(
    (acc, region) => [...acc, ...region.timezones],
    [] as TimezoneOption[]
  );
};

export const getDefaultTimezone = (): string => {
  return 'Africa/Nairobi';
};

// Examples of how to use the timezone data in components
export const TimezoneSelect = () => {
  return (
    <select defaultValue={getDefaultTimezone()}>
      {TIMEZONES.map((region) => (
        <optgroup key={region.label} label={region.label}>
          {region.timezones.map((timezone) => (
            <option key={timezone.value} value={timezone.value}>
              {timezone.label} ({timezone.offset})
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

// Function to format current time in a timezone
export const formatTimezoneTime = (timezone: string): string => {
  try {
    return new Date().toLocaleTimeString('en-US', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return new Date().toLocaleTimeString();
  }
};

// Function to get current offset for a timezone
export const getCurrentOffset = (timezone: string): string => {
  try {
    const date = new Date();
    const options = Intl.DateTimeFormat('en-US', {
      timeZone: timezone,
      timeZoneName: 'short',
    }).formatToParts(date);
    return options.find((part) => part.type === 'timeZoneName')?.value || '';
  } catch (error) {
    return '';
  }
};
