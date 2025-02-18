import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createWithdrawalRequest(
  userId: string,
  amount: number,
  currency: string,
  accountNumber: string
) {
  return prisma.withdrawalRequest.create({
    data: {
      userId,
      amount,
      currency,
      accountNumber,
      status: "pending",
    },
  });
}

export async function getWithdrawalRequestsByUserId(userId: string) {
  return prisma.withdrawalRequest.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAllPendingWithdrawalRequests() {
  return prisma.withdrawalRequest.findMany({
    where: { status: "pending" },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });
}

export async function updateWithdrawalRequestStatus(
  id: string,
  status: string
) {
  return prisma.withdrawalRequest.update({
    where: { id },
    data: { status },
  });
}
