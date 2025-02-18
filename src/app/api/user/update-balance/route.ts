import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { amount, currency, type } = await request.json();

    const balanceField = `balance${currency}` as
      | "balanceUSD"
      | "balanceEUR"
      | "balanceGBP";
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const currentBalance = user[balanceField];
    const newBalance =
      type === "add" ? currentBalance + amount : currentBalance - amount;

    if (type === "subtract" && newBalance < 0) {
      return NextResponse.json(
        { error: "Insufficient balance" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        [balanceField]: newBalance,
      },
    });

    return NextResponse.json({
      [currency]: updatedUser[balanceField],
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error updating balance" },
      { status: 500 }
    );
  }
}
