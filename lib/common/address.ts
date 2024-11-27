import { getCountryFromCode } from './constants';
import { Address } from './types';

export function formatAddress(address: Address): string {
  return [
    address.line1,
    [address.line2, address.city].filter(Boolean).join(', '),
    address.state,
    [getCountryFromCode(address.country)?.name, address.zipCode]
      .filter(Boolean)
      .join(' '),
  ]
    .filter(Boolean)
    .join(', ');
}
