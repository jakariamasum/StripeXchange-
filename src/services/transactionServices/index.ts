import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createTransaction(
  userId: string,
  type: string,
  amount: number,
  currency: string,
  status: string,
  stripePayoutId?: string
) {
  return prisma.transaction.create({
    data: {
      userId,
      type,
      amount,
      currency,
      status,
      stripePayoutId,
    },
  });
}

export async function getTransactionsByUserId(userId: string) {
  return prisma.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}
