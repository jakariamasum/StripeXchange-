import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    const updatedWithdrawalRequest = await prisma.withdrawalRequest.update({
      where: { id },
      data: { status: "rejected" },
    });

    return NextResponse.json(updatedWithdrawalRequest);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error rejecting withdrawal request" },
      { status: 500 }
    );
  }
}
