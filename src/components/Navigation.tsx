"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Button } from "./ui/Button";
import { Balance } from "./Balance";

export function Navigation() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const isAuthPage = pathname === "/login" || pathname === "/signup";
  if (isAuthPage) return null;

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link
              href="/"
              className="flex-shrink-0 flex items-center font-semibold text-lg"
            >
              Stripe Payment System
            </Link>
            {session && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  href="/payment"
                  className={`${
                    pathname === "/payment" ? "border-b-2 border-blue-500" : ""
                  } inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900`}
                >
                  Payment
                </Link>
                <Link
                  href="/withdraw"
                  className={`${
                    pathname === "/withdraw" ? "border-b-2 border-blue-500" : ""
                  } inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900`}
                >
                  Withdraw
                </Link>
                <Link
                  href="/history"
                  className={`${
                    pathname === "/history" ? "border-b-2 border-blue-500" : ""
                  } inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900`}
                >
                  History
                </Link>
                {session.user?.email === "admin@example.com" && (
                  <Link
                    href="/admin"
                    className={`${
                      pathname === "/admin" ? "border-b-2 border-blue-500" : ""
                    } inline-flex items-center px-1 pt-1 text-sm font-medium text-gray-900`}
                  >
                    Admin
                  </Link>
                )}
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <Balance />
                <span className="text-sm text-gray-700">
                  {session.user?.email}
                </span>
                <Button onClick={() => signOut()} variant="secondary">
                  Sign out
                </Button>
              </div>
            ) : (
              <div className="space-x-4">
                <Link href="/login">
                  <Button variant="secondary">Sign in</Button>
                </Link>
                <Link href="/signup">
                  <Button variant="primary">Sign up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
