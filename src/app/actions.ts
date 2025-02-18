"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";
import { CurrencyCode } from "@/types";
import { convertCurrency } from "@/utils/currency";

const prisma = new PrismaClient();

export async function updateBalance(
  amount: number,
  currency: CurrencyCode,
  type: "add" | "subtract"
) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: {
      balanceUSD: true,
      balanceEUR: true,
      balanceGBP: true,
      balanceBDT: true,
    },
  });

  if (!user) throw new Error("User not found");

  // Convert amount to each currency
  const amountUSD = convertCurrency(amount, currency, "USD");
  const amountEUR = convertCurrency(amount, currency, "EUR");
  const amountGBP = convertCurrency(amount, currency, "GBP");
  const amountBDT = convertCurrency(amount, currency, "BDT");

  const multiplier = type === "add" ? 1 : -1;

  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      balanceUSD: user.balanceUSD + amountUSD * multiplier,
      balanceEUR: user.balanceEUR + amountEUR * multiplier,
      balanceGBP: user.balanceGBP + amountGBP * multiplier,
      balanceBDT: user.balanceBDT + amountBDT * multiplier,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/payment");
  revalidatePath("/withdraw");
}

export async function createTransaction(data: {
  type: "payment" | "withdrawal";
  amount: number;
  currency: CurrencyCode;
  status: string;
}) {
  const session = await getServerSession();
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) throw new Error("User not found");

  // Store the original amount and currency, plus the USD equivalent
  const amountUSD = convertCurrency(data.amount, data.currency, "USD");

  await prisma.transaction.create({
    data: {
      userId: user.id,
      type: data.type,
      amount: data.amount,
      amountUSD,
      currency: data.currency,
      status: data.status,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/history");
}
