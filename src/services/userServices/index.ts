import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getUserBalance(email: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      balanceUSD: true,
      balanceEUR: true,
      balanceGBP: true,
      balanceBDT: true,
    },
  });

  if (!user) {
    return { USD: 0, EUR: 0, GBP: 0, BDT: 0 };
  }

  return {
    USD: user.balanceUSD,
    EUR: user.balanceEUR,
    GBP: user.balanceGBP,
    BDT: user.balanceBDT,
  };
}
