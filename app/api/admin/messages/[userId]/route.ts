import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId } = await params;
  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const message = await db.message.create({
    data: { userId, content: content.trim(), fromAdmin: true },
  });

  // Notify customer by email
  const baseUrl = process.env.NEXTAUTH_URL || "https://buggycozumel.com";
  resend.emails.send({
    from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
    to: user.email,
    subject: "💬 New message from Dani – Buggy Rentals",
    html: `
<div style="font-family:system-ui,sans-serif;background:#F5F0EB;padding:20px">
<div style="max-width:480px;margin:0 auto;background:white;border-radius:16px;overflow:hidden">
  <div style="background:#1B4F72;padding:24px 32px;text-align:center">
    <h1 style="color:white;margin:0;font-size:18px">Buggy Rentals with Dani</h1>
  </div>
  <div style="padding:28px 32px">
    <p style="color:#374151;margin:0 0 16px">You have a new message from Dani:</p>
    <blockquote style="border-left:3px solid #E8836A;padding:10px 16px;margin:0 0 20px;color:#1a1a1a;background:#FFF8F6;border-radius:0 8px 8px 0">${content}</blockquote>
    <a href="${baseUrl}/en/dashboard" style="display:inline-block;background:#E8836A;color:white;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:600">Reply in Dashboard →</a>
  </div>
</div>
</div>`,
  }).catch(console.error);

  return NextResponse.json(message);
}
