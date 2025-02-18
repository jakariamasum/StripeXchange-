"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Balance, CurrencyCode } from "@/types";
import { CURRENCIES } from "@/constants";
import { CurrencySelect } from "./ui/CurrencySelect";
import { Modal } from "./modal/Modal";

interface WithdrawalFormProps {
  userId: string;
}

export function WithdrawalForm({ userId }: WithdrawalFormProps) {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [accountNumber, setAccountNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [balance, setBalance] = useState<Balance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchBalance = async () => {
      const response = await fetch("/api/user/balance");
      if (response.ok) {
        const data = await response.json();
        setBalance(data);
      }
    };
    fetchBalance();
  }, []);

  const validateWithdrawal = (amount: number, currency: CurrencyCode) => {
    if (!balance) return false;

    const minAmount = CURRENCIES[currency].minimumWithdrawal;
    if (amount < minAmount) {
      setModalMessage(
        `Minimum withdrawal amount is ${CURRENCIES[currency].symbol}${minAmount} ${currency}`
      );
      setShowModal(true);
      return false;
    }

    // Convert withdrawal amount to the currency's balance for comparison
    const withdrawalInBalance = amount;
    const availableBalance = balance[currency];

    if (withdrawalInBalance > availableBalance) {
      setModalMessage(
        `Insufficient balance. Your ${currency} balance is ${
          CURRENCIES[currency].symbol
        }${availableBalance.toFixed(2)}`
      );
      setShowModal(true);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const withdrawalAmount = Number.parseFloat(amount);

    if (!validateWithdrawal(withdrawalAmount, currency)) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/create-withdrawal-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId,
          amount: withdrawalAmount,
          currency,
          accountNumber,
        }),
      });

      if (response.ok) {
        router.push("/history");
        router.refresh();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to create withdrawal request");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while creating the withdrawal request");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Your Balance</h2>
          {balance ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(balance).map(([code, amount]) => {
                const curr = CURRENCIES[code as CurrencyCode];
                return (
                  <div key={code} className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">{curr.name}</div>
                    <div className="text-lg font-medium">
                      {curr.symbol}
                      {amount.toFixed(curr.decimals)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="animate-pulse h-16 bg-gray-200 rounded"></div>
          )}
        </div>

        <Input
          label="Amount"
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={CURRENCIES[currency].minimumWithdrawal}
          step="0.01"
          required
        />

        <CurrencySelect
          value={currency}
          onChange={(value) => setCurrency(value as CurrencyCode)}
        />

        <Input
          label="Account Number"
          type="text"
          id="accountNumber"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          required
        />

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? "Processing..." : "Request Withdrawal"}
        </Button>

        <p className="text-sm text-gray-600 mt-2">
          Minimum withdrawal amounts:{" "}
          {Object.entries(CURRENCIES).map(([code, curr], index) => (
            <span key={code}>
              {index > 0 && ", "}
              {curr.symbol}
              {curr.minimumWithdrawal} {code}
            </span>
          ))}
        </p>
      </form>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Withdrawal Error"
      >
        <div className="mt-2">
          <p className="text-sm text-gray-500">{modalMessage}</p>
        </div>
        <div className="mt-4">
          <Button onClick={() => setShowModal(false)} className="w-full">
            Close
          </Button>
        </div>
      </Modal>
    </>
  );
}
