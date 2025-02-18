import { CURRENCIES } from "@/constants";

interface CurrencySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function CurrencySelect({
  value,
  onChange,
  className = "",
}: CurrencySelectProps) {
  return (
    <div className="space-y-1">
      <label
        htmlFor="currency"
        className="block text-sm font-medium text-gray-700"
      >
        Currency
      </label>
      <select
        id="currency"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md ${className}`}
      >
        {Object.values(CURRENCIES).map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.name} ({currency.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
