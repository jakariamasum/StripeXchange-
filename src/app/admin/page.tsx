import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getAllPendingWithdrawalRequests } from "@/services/withdrawServices";
import { AdminDashboard } from "@/components/AdminDashboard";

export default async function AdminPage() {
  const cookieStore = cookies();
  const userEmail = cookieStore.get("userEmail")?.value;

  if (userEmail !== "admin@example.com") {
    redirect("/");
  }

  const withdrawalRequests = await getAllPendingWithdrawalRequests();

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Withdrawal Request
      </h1>
      <AdminDashboard withdrawalRequests={withdrawalRequests} />
    </div>
  );
}
