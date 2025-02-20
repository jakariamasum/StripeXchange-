import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "Logged out" });

  response.cookies.set("userId", "", { expires: new Date(0) });
  response.cookies.set("userEmail", "", { expires: new Date(0) });

  return response;
}
