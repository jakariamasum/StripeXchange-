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
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const withdrawalRequest = await prisma.withdrawalRequest.findUnique({
      where: { id },
    });

    if (!withdrawalRequest) {
      return NextResponse.json(
        { error: "Withdrawal request not found" },
        { status: 404 }
      );
    }

    // Process the withdrawal using Stripe
    const payout = await stripe.payouts.create({
      amount: withdrawalRequest.amount * 100, // Stripe expects amounts in cents
      currency: withdrawalRequest.currency,
      method: "standard",
    });

    // Update the withdrawal request status
    const updatedWithdrawalRequest = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: "approved" },
    });

    // Create a transaction record
    // await prisma.transaction.create({
    //   data: {
    //     type: "withdrawal",
    //     amount: withdrawalRequest.amount,
    //     currency: withdrawalRequest.currency,
    //     status: "completed",
    //     stripePayoutId: payout.id,
    //   },
    // });

    return NextResponse.json(updatedWithdrawalRequest);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error approving withdrawal request" },
      { status: 500 }
    );
  }
}
