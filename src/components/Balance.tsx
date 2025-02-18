"use client";

import { useEffect, useState } from "react";

interface BalanceData {
  USD: number;
  EUR: number;
  GBP: number;
}

export function Balance() {
  const [balance, setBalance] = useState<BalanceData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await fetch("/api/user/balance");
        if (response.ok) {
          const data = await response.json();
          setBalance(data);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalance();
  }, []);

  if (isLoading) {
    return <div className="animate-pulse h-6 w-24 bg-gray-200 rounded"></div>;
  }

  if (!balance) return null;

  return (
    <div className="flex space-x-4">
      {Object.entries(balance).map(([currency, amount]) => (
        <div key={currency} className="text-sm">
          <span className="font-medium">{currency}:</span> {amount.toFixed(2)}
        </div>
      ))}
    </div>
  );
}
