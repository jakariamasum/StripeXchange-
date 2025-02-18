import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white">
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Stripe Payment System
        </Link>
        <div className="space-x-4">
          <Link href="/payment" className="hover:text-gray-300">
            Payment
          </Link>
          <Link href="/withdraw" className="hover:text-gray-300">
            Withdraw
          </Link>
          <Link href="/history" className="hover:text-gray-300">
            History
          </Link>
          <Link href="/admin" className="hover:text-gray-300">
            Admin
          </Link>
        </div>
      </nav>
    </header>
  );
}
