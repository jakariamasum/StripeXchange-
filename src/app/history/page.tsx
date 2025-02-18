import { redirect } from "next/navigation";
import { TransactionHistory } from "@/components/TransactionHistory";
import { cookies } from "next/headers";
import { getTransactionsByUserId } from "@/services/transactionServices";
import { getWithdrawalRequestsByUserId } from "@/services/withdrawServices";

export default async function HistoryPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) {
    redirect("/login");
  }

  const transactions = await getTransactionsByUserId(userId);
  const withdraws = await getWithdrawalRequestsByUserId(userId);

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Transaction History
      </h1>
      <TransactionHistory transactions={transactions} withdraws={withdraws} />
    </div>
  );
}
