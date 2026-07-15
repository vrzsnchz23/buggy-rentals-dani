import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateToken, sessionCookieOptions } from "@/lib/customer-auth";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();
    if (!email || !code) {
      return NextResponse.json({ error: "Email and code required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const otp = await db.otpCode.findFirst({
      where: {
        email: normalizedEmail,
        code,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
    }

    // Mark OTP used
    await db.otpCode.update({ where: { id: otp.id }, data: { used: true } });

    // Find or create user
    let user = await db.user.findUnique({ where: { email: normalizedEmail } });
    if (!user) {
      user = await db.user.create({ data: { email: normalizedEmail } });
      // Link existing bookings by email
      await db.booking.updateMany({
        where: { guestEmail: normalizedEmail, userId: null },
        data: { userId: user.id },
      });
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    await db.userSession.create({ data: { userId: user.id, token, expiresAt } });

    const res = NextResponse.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
    const cookieOpts = sessionCookieOptions(token);
    res.cookies.set(cookieOpts);
    return res;
  } catch (error) {
    console.error("verify-otp error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
