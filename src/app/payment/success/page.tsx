"use client";
import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Successful!</h2>
        <p className="text-gray-600 mb-6">
          Thank you for your payment. Your transaction has been completed
          successfully.
        </p>
        <div className="space-y-4">
          <Link
            href="/"
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Return to Home
          </Link>
          <Link
            href="/payment"
            className="block w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Make Another Payment
          </Link>
        </div>
      </div>
    </div>
  );
}
