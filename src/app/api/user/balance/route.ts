import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { cookies } from "next/headers";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const cookieStore = cookies();
    const userEmail = cookieStore.get("userEmail")?.value;

    const user = await prisma.user.findUnique({
      where: { email: userEmail },
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
