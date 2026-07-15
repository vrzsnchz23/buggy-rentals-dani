import { NextRequest, NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { db } from "@/lib/db";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { content } = await req.json();
  if (!content?.trim()) return NextResponse.json({ error: "Message required" }, { status: 400 });

  const message = await db.message.create({
    data: { userId: session.userId, content: content.trim(), fromAdmin: false },
  });

  // Notify admin
  resend.emails.send({
    from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
    to: process.env.ADMIN_EMAIL || "dani@buggycozumel.com",
    subject: `💬 New message from ${session.user.email}`,
    html: `<p>New customer message from <strong>${session.user.email}</strong>:</p><blockquote style="border-left:3px solid #E8836A;padding:8px 16px;color:#374151">${content}</blockquote><p><a href="${process.env.NEXTAUTH_URL}/en/admin/messages">View in Admin Panel →</a></p>`,
  }).catch(console.error);

  return NextResponse.json(message);
}
