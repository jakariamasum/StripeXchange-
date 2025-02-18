import { Currency } from "@/types";
import { CurrencyCode } from "@/utils/currency";

export const CURRENCIES: Record<CurrencyCode, Currency> = {
  USD: {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    minimumWithdrawal: 50,
    decimals: 2,
  },
  EUR: {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    minimumWithdrawal: 45,
    decimals: 2,
  },
  GBP: {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    minimumWithdrawal: 40,
    decimals: 2,
  },
  BDT: {
    code: "BDT",
    name: "Bangladeshi Taka",
    symbol: "৳",
    minimumWithdrawal: 5000,
    decimals: 2,
  },
};
