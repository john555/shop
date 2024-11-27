import { CurrencyPosition, Store } from './types';

export function formatCurrency(
  amount: number,
  currencySettings: Pick<
    Store,
    'showCurrencyCode' | 'currency' | 'currencyPosition' | 'currencySymbol'
  >
) {
  const formattedAmount = amount.toLocaleString(); // Uses user's system settings for locale
  return currencySettings.currencyPosition === CurrencyPosition.BeforeAmount
    ? currencySettings.showCurrencyCode
      ? `${currencySettings.currency} ${formattedAmount}`
      : `${currencySettings.currencySymbol}${formattedAmount}`
    : currencySettings.showCurrencyCode
    ? `${formattedAmount} ${currencySettings.currency}`
    : `${formattedAmount}${currencySettings.currencySymbol}`;
}
