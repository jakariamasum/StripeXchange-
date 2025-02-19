/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import Stripe from "stripe";

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-01-27.acacia",
});

export async function POST(
  request: Request,
  { params }: { params: { id: string }; request: Request }
) {
  const { id } = params;
  const { userId } = await request.json();

  try {
    const withdrawalRequest = await prisma.withdrawalRequest.findUnique({
      where: { id },
    });

    console.log("withdraw req: ", withdrawalRequest);

    if (!withdrawalRequest) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    // console.log("stripe payout: ", stripe.payouts);
    // Process the withdrawal using Stripe
    const payout = await stripe.payouts.create(
      {
        amount: withdrawalRequest.amount * 100,
        currency: withdrawalRequest.currency,
        method: "standard",
        // destination: withdrawalRequest.accountNumber,
      },
      {
        stripeAccount: withdrawalRequest.accountNumber,
      }
    );
    console.log("payout: ", payout);

    // Update the withdrawal request status
    const updatedWithdrawalRequest = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: "approved" },
    });

    //  Create a transaction record
    await prisma.transaction.create({
      data: {
        type: "withdrawal",
        amount: withdrawalRequest.amount,
        currency: withdrawalRequest.currency,
        status: "completed",
        stripePayoutId: payout.id,
        userId,
      },
    });

    return NextResponse.json(updatedWithdrawalRequest);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error approving withdrawal request" },
      { status: 500 }
    );
  }
}
