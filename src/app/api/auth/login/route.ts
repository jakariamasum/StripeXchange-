import { getUserByEmail, verifyPassword } from "@/services/authServices";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: "No user exists" }, { status: 400 });
    }

    const isValid = await verifyPassword(user, password);
    if (!isValid) {
      return NextResponse.json(
        { error: "Password incorrect" },
        { status: 400 }
      );
    }

    const response = NextResponse.json(user, { status: 200 });

    response.cookies.set("userId", user.id, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    response.cookies.set("userEmail", user.email, {
      httpOnly: true,
      path: "/",
      sameSite: "strict",
    });

    return response;
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    );
  }
}
