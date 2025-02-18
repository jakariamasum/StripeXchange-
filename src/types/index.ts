export interface Currency {
  code: CurrencyCode;
  name: string;
  symbol: string;
  minimumWithdrawal: number;
}

export interface Balance {
  USD: number;
  EUR: number;
  GBP: number;
  BDT: number;
}

export interface Transaction {
  id: string;
  type: "payment" | "withdrawal";
  amount: number;
  currency: CurrencyCode;
  status: string;
  createdAt: string;
}

export interface WithdrawalRequest {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  accountNumber: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
  user: {
    email: string;
  };
}

export type CurrencyCode = "USD" | "EUR" | "GBP" | "BDT";

export interface Currency {
  code: "USD" | "EUR" | "GBP" | "BDT";
  name: string;
  symbol: string;
  minimumWithdrawal: number;
  decimals: number;
}
