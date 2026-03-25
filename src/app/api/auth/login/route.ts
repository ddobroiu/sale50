import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, message: "Missing email" }, { status: 400 });

    const cookieStore = await cookies();
    cookieStore.set("client_auth", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: "/",
    });

    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ ok: false, message: e.message }, { status: 500 });
  }
}

export async function DELETE() {
    const cookieStore = await cookies();
    cookieStore.delete("client_auth");
    return NextResponse.json({ ok: true });
}
