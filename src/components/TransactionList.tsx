import { CURRENCIES } from "@/constants";
import type { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
              Type
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
              Amount
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
              Status
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold text-gray-900">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {transactions.map((transaction) => {
            const currency = CURRENCIES[transaction.currency];
            return (
              <tr key={transaction.id}>
                <td className="py-3 px-4 text-sm text-gray-900 capitalize">
                  {transaction.type}
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {currency.symbol}
                  {transaction.amount.toFixed(2)} {currency.code}
                </td>
                <td className="py-3 px-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      transaction.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-gray-900">
                  {new Date(transaction.createdAt).toLocaleDateString()}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {transactions.length === 0 && (
        <p className="text-center text-gray-500 py-4">No transactions found</p>
      )}
    </div>
  );
}
