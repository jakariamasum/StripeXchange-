"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { CurrencySelect } from "./ui/CurrencySelect";
import { createTransaction, updateBalance } from "@/app/actions";
import { CurrencyCode } from "@/types";

export function PaymentForm() {
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);
    setError("");

    try {
      const { error: backendError, clientSecret } = await fetch(
        "/api/create-payment-intent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number.parseFloat(amount),
            currency: currency.toLowerCase(),
          }),
        }
      ).then((res) => res.json());

      if (backendError) {
        setError(backendError);
        return;
      }

      const { error: stripeError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement)!,
          },
        });

      if (stripeError) {
        setError(stripeError.message || "Payment failed");
      } else if (paymentIntent.status === "succeeded") {
        await updateBalance(Number.parseFloat(amount), currency, "add");
        await createTransaction({
          type: "payment",
          amount: Number.parseFloat(amount),
          currency,
          status: "completed",
        });

        router.push("/payment/success");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred during payment");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Amount"
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="1"
        step="0.01"
        required
      />
      <CurrencySelect
        value={currency}
        onChange={(value) => setCurrency(value as CurrencyCode)}
      />
      <div className="space-y-1">
        <label
          htmlFor="card-element"
          className="block text-sm font-medium text-gray-700"
        >
          Credit or debit card
        </label>
        <div className="mt-1 p-3 border border-gray-300 rounded-md">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </div>
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <Button type="submit" disabled={isLoading} className="w-full">
        {isLoading
          ? "Processing..."
          : `Pay ${amount ? `${amount} ${currency}` : ""}`}
      </Button>
    </form>
  );
}
