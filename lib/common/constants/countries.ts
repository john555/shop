export type CountryMetadata = {
  code: string;
  flag: string;
  phoneCode: string;
  name: string;
};
export const COUNTRIES: CountryMetadata[] = [
  {
    code: 'UG',
    flag: '🇺🇬',
    phoneCode: '256',
    name: 'Uganda',
  },
  {
    code: 'KE',
    flag: '🇰🇪',
    phoneCode: '254',
    name: 'Kenya',
  },
  {
    code: 'TZ',
    flag: '🇹🇿',
    phoneCode: '255',
    name: 'Tanzania',
  },
  {
    code: 'RW',
    flag: '🇷🇼',
    phoneCode: '250',
    name: 'Rwanda',
  },
  {
    code: 'BI',
    flag: '🇧🇮',
    phoneCode: '257',
    name: 'Burundi',
  },
  {
    code: 'SS',
    flag: '🇸🇸',
    phoneCode: '211',
    name: 'South Sudan',
  },
  {
    code: 'ET',
    flag: '🇪🇹',
    phoneCode: '251',
    name: 'Ethiopia',
  },
  {
    code: 'ER',
    flag: '🇪🇷',
    phoneCode: '291',
    name: 'Eritrea',
  },
  {
    code: 'DJ',
    flag: '🇩🇯',
    phoneCode: '253',
    name: 'Djibouti',
  },
  {
    code: 'SO',
    flag: '🇸🇴',
    phoneCode: '252',
    name: 'Somalia',
  },
];

export function getCountryFromCode(code: string): CountryMetadata | undefined {
  const country = COUNTRIES.find((country) => country.code === code);
  return country ? country : undefined;
}

export function getCountryFromPhoneCode(
  phoneCode: string
): CountryMetadata | undefined {
  const country = COUNTRIES.find((country) => country.phoneCode === phoneCode);
  return country ? country : undefined;
}
