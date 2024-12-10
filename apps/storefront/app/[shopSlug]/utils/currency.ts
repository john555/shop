export function formatCurrency(amount: number, currency: string = 'UGX'): string {
  return amount.toLocaleString('en-UG', { style: 'currency', currency: currency });
}

