export const EXCHANGE_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  BDT: 115.85,
} as const;

export type CurrencyCode = keyof typeof EXCHANGE_RATES;

export function convertCurrency(
  amount: number,
  fromCurrency: CurrencyCode,
  toCurrency: CurrencyCode
): number {
  const amountInUSD = amount / EXCHANGE_RATES[fromCurrency];
  const amountInTargetCurrency = amountInUSD * EXCHANGE_RATES[toCurrency];

  return Math.round(amountInTargetCurrency * 100) / 100;
}

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(amount);
}
