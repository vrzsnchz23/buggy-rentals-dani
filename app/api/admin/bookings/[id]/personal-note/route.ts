import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Resend } from "resend";
import {
  PERSONAL_NOTE_SUBJECT,
  personalNoteHtml,
  personalNoteText,
} from "@/lib/emails/personal-note";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends Dani's personal welcome note to one guest.
 *
 * Triggered by hand from the booking panel, never automatically: arriving
 * moments after the confirmation is exactly what would make it read as an
 * autoresponder.
 *
 * `personalNoteSentAt` is only written after Resend accepts the message, so a
 * failed send leaves the booking marked as not-yet-sent and the button stays
 * available.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (!booking.guestEmail) {
    return NextResponse.json(
      { error: "This booking has no email address — reach the guest on WhatsApp instead." },
      { status: 400 }
    );
  }

  // Resending is allowed, but only when the panel asks for it explicitly, so a
  // double click or a stale tab cannot write to the same guest twice.
  let resend_requested = false;
  try {
    const body = await req.json();
    resend_requested = body?.resend === true;
  } catch {
    /* no body is the normal first-send case */
  }

  if (booking.personalNoteSentAt && !resend_requested) {
    return NextResponse.json(
      {
        error: "The personal note was already sent for this booking.",
        sentAt: booking.personalNoteSentAt,
      },
      { status: 409 }
    );
  }

  try {
    await resend.emails.send({
      from: "Dani <dani@buggycozumel.com>",
      to: booking.guestEmail,
      // Replies should reach Dani directly — the note invites them.
      replyTo: "dani@buggycozumel.com",
      subject: PERSONAL_NOTE_SUBJECT,
      html: personalNoteHtml(),
      text: personalNoteText(),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Personal note send error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  const updated = await db.booking.update({
    where: { id },
    data: { personalNoteSentAt: new Date() },
  });

  return NextResponse.json({ ok: true, sentAt: updated.personalNoteSentAt });
}
