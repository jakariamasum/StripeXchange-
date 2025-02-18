import { WithdrawalForm } from "@/components/WithdrawForm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function WithdrawPage() {
  const cookieStore = cookies();
  const userId = cookieStore.get("userId")?.value;
  if (!userId) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Request a Withdrawal
      </h1>
      <WithdrawalForm userId={userId} />
    </div>
  );
}
