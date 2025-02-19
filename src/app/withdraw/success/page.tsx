"use client";
import { Button } from "@/components/ui/Button";
import { useSearchParams } from "next/navigation";

export default function WithdrawSuccessPage() {
  const searchParams = useSearchParams();
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Withdrawal Successful</h2>
        <p className="text-gray-600 mb-6">
          Your withdrawal request for {amount} {currency} has been successfully
          submitted. It will be processed pending admin approval.
        </p>
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Go back to Dashboard
        </Button>
      </div>
    </div>
  );
}
