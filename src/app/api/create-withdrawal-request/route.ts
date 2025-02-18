import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { amount, currency, accountNumber, userId } = await request.json();
  try {
    const withdrawalRequest = await prisma.withdrawalRequest.create({
      data: {
        amount,
        currency,
        accountNumber,
        status: "pending",
        userId,
      },
    });

    return NextResponse.json(withdrawalRequest);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error creating withdrawal request" },
      { status: 500 }
    );
  }
}
