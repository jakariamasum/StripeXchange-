import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold mb-8">
        Welcome to Stripe Payment System
      </h1>
      <div className="flex space-x-4">
        <Link
          href="/payment"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Make a Payment
        </Link>
        <Link
          href="/withdraw"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Request Withdrawal
        </Link>
        <Link
          href="/history"
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          Transaction History
        </Link>
      </div>
    </div>
  );
}
