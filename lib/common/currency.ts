import { CurrencyPosition, Store } from './types';

export function formatPrice(
  amount: number,
  currencySettings: Pick<
    Store,
    'showCurrencyCode' | 'currency' | 'currencyPosition' | 'currencySymbol'
  >
) {
  if (!currencySettings) return '';

  const formattedAmount = amount.toLocaleString(); // Uses user's system settings for locale
  return currencySettings.currencyPosition === CurrencyPosition.BeforeAmount
    ? currencySettings.showCurrencyCode
      ? `${currencySettings.currency} ${formattedAmount}`
      : `${currencySettings.currencySymbol}${formattedAmount}`
    : currencySettings.showCurrencyCode
    ? `${formattedAmount} ${currencySettings.currency}`
    : `${formattedAmount}${currencySettings.currencySymbol}`;
}
