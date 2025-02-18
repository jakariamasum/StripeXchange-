import PaymentFormWrapper from "@/components/PaymentFormWrapper";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function PaymentPage() {
  const cookieStore = cookies();
  const userEmail = cookieStore.get("userEmail")?.value;
  if (!userEmail) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Make a Payment</h1>
      <PaymentFormWrapper />
    </div>
  );
}
