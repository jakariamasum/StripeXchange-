import { CURRENCIES } from "@/constants";
import type { Balance } from "@/types";

interface BalanceDisplayProps {
  balance: Balance;
  className?: string;
}

export function BalanceDisplay({
  balance,
  className = "",
}: BalanceDisplayProps) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${className}`}>
      {Object.entries(balance).map(([code, amount]) => {
        const currency = CURRENCIES[code];
        return (
          <div key={code} className="p-3 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-600">{currency.name}</div>
            <div className="text-lg font-medium">
              {currency.symbol}
              {amount.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
