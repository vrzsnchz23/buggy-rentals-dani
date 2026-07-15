import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOtp } from "@/lib/customer-auth";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { email, locale = "en" } = await req.json();
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email required" }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limit: max 3 OTPs per email per 10 min
    const recent = await db.otpCode.count({
      where: {
        email: normalizedEmail,
        createdAt: { gte: new Date(Date.now() - 10 * 60 * 1000) },
      },
    });
    if (recent >= 3) {
      return NextResponse.json({ error: "Too many attempts. Try again in 10 minutes." }, { status: 429 });
    }

    // Invalidate old codes
    await db.otpCode.updateMany({
      where: { email: normalizedEmail, used: false },
      data: { used: true },
    });

    const code = generateOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min

    await db.otpCode.create({
      data: { email: normalizedEmail, code, expiresAt },
    });

    const isEs = locale === "es";
    await resend.emails.send({
      from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
      to: normalizedEmail,
      subject: isEs ? `Tu código de acceso: ${code}` : `Your access code: ${code}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#F5F0EB;margin:0;padding:20px">
<div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:#1B4F72;padding:28px 32px;text-align:center">
    <h1 style="color:white;margin:0;font-size:20px">Buggy Rentals with Dani</h1>
    <p style="color:#7FB5B5;margin:6px 0 0;font-size:13px">Cozumel, Mexico</p>
  </div>
  <div style="padding:32px;text-align:center">
    <p style="color:#6b7280;margin:0 0 24px;font-size:15px">
      ${isEs ? "Tu código de acceso al dashboard:" : "Your dashboard access code:"}
    </p>
    <div style="background:#F5F0EB;border-radius:12px;padding:20px;display:inline-block;margin-bottom:24px">
      <div style="font-size:42px;font-weight:900;color:#1B4F72;letter-spacing:12px">${code}</div>
    </div>
    <p style="color:#9ca3af;font-size:13px;margin:0">
      ${isEs ? "Este código expira en 15 minutos." : "This code expires in 15 minutes."}
    </p>
  </div>
  <div style="padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px;background:#f9fafb">
    © ${new Date().getFullYear()} Buggy Rentals with Dani · Cozumel, Mexico
  </div>
</div>
</body>
</html>`,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json({ error: "Failed to send code" }, { status: 500 });
  }
}
