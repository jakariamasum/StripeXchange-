import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        balanceUSD: true,
        balanceEUR: true,
        balanceGBP: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      USD: user.balanceUSD,
      EUR: user.balanceEUR,
      GBP: user.balanceGBP,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Error fetching balance" },
      { status: 500 }
    );
  }
}
