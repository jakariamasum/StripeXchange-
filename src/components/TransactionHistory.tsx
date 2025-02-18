import type { Transaction, WithdrawalRequest } from "@prisma/client";

interface TransactionHistoryProps {
  transactions: Transaction[];
  withdraws: WithdrawalRequest[];
}

export function TransactionHistory({
  transactions,
  withdraws,
}: TransactionHistoryProps) {
  return (
    <div className="overflow-x-auto ">
      <table className="min-w-full bg-white mb-16">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Type</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Currency</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {transactions.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {transaction.id}
              </td>
              <td className="py-3 px-6 text-left">{transaction.type}</td>
              <td className="py-3 px-6 text-left">{transaction.amount}</td>
              <td className="py-3 px-6 text-left">{transaction.currency}</td>
              <td className="py-3 px-6 text-left">{transaction.status}</td>
              <td className="py-3 px-6 text-left">
                {new Date(transaction.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <table className="min-w-full bg-white">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">ID</th>
            <th className="py-3 px-6 text-left">Account</th>
            <th className="py-3 px-6 text-left">Amount</th>
            <th className="py-3 px-6 text-left">Currency</th>
            <th className="py-3 px-6 text-left">Status</th>
            <th className="py-3 px-6 text-left">Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {withdraws?.map((transaction) => (
            <tr
              key={transaction.id}
              className="border-b border-gray-200 hover:bg-gray-100"
            >
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {transaction.id}
              </td>
              <td className="py-3 px-6 text-left">
                {transaction.accountNumber}
              </td>
              <td className="py-3 px-6 text-left">{transaction.amount}</td>
              <td className="py-3 px-6 text-left">{transaction.currency}</td>
              <td className="py-3 px-6 text-left">{transaction.status}</td>
              <td className="py-3 px-6 text-left">
                {new Date(transaction.createdAt).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
