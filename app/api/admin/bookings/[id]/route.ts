import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Resend } from "resend";
import { formatDate, formatCurrency } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await req.json();

  const allowed = ["status", "paymentStatus", "adminNotes", "rentalDate", "returnDate"];
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) {
      if ((key === "rentalDate" || key === "returnDate") && body[key]) {
        data[key] = new Date(body[key] + "T12:00:00");
      } else {
        data[key] = body[key];
      }
    }
  }

  const booking = await db.booking.update({ where: { id }, data });

  if (body.status === "completed") {
    sendReviewRequestEmail(booking).catch(console.error);
  }

  return NextResponse.json(booking);
}

async function sendReviewRequestEmail(booking: {
  guestName: string;
  guestEmail: string;
  rentalDate: Date;
  totalAmount: number;
  locale?: string | null;
}) {
  const isEs = booking.locale === "es";
  const subject = isEs
    ? "¿Cómo estuvo tu experiencia con Buggy Rentals con Dani? 🌴"
    : "How was your experience with Buggy Rentals with Dani? 🌴";

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family:system-ui,sans-serif;background:#F5F0EB;margin:0;padding:20px">
<div style="max-width:560px;margin:0 auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:#1B4F72;padding:32px;text-align:center">
    <h1 style="color:white;margin:0;font-size:24px">Buggy Rentals with Dani</h1>
    <p style="color:#7FB5B5;margin:8px 0 0">Cozumel, Mexico</p>
  </div>
  <div style="padding:32px">
    <h2 style="color:#1B4F72;margin:0 0 16px">${isEs ? `¡Gracias, ${booking.guestName}! 🙏` : `Thank you, ${booking.guestName}! 🙏`}</h2>
    <p style="color:#6b7280;line-height:1.6;margin:0 0 24px">
      ${isEs
        ? `Esperamos que hayas disfrutado tu experiencia en Cozumel el <strong>${formatDate(booking.rentalDate)}</strong>. Fue un placer tenerte con nosotros.`
        : `We hope you had an amazing time exploring Cozumel on <strong>${formatDate(booking.rentalDate)}</strong>. It was a pleasure having you with us!`
      }
    </p>

    <p style="color:#6b7280;line-height:1.6;margin:0 0 24px">
      ${isEs
        ? "Si tuvieras un momento, nos ayudaría muchísimo que nos dejaras una reseña en Google. Solo toma 2 minutos y hace una gran diferencia para nosotros. 🌟"
        : "If you have a moment, it would mean the world to us if you could leave us a Google review. It only takes 2 minutes and makes a huge difference for our small business. 🌟"
      }
    </p>

    <div style="text-align:center;margin:32px 0">
      <a
        href="https://g.page/r/CfS3VjCYpjOMEBM/review"
        style="background:#E8836A;color:white;text-decoration:none;padding:16px 32px;border-radius:12px;font-weight:900;font-size:16px;display:inline-block"
      >
        ⭐ ${isEs ? "Dejar una reseña en Google" : "Leave a Google Review"}
      </a>
    </div>

    <p style="color:#9ca3af;font-size:13px;text-align:center;margin:0">
      ${isEs
        ? "Si tuviste algún problema durante tu renta, por favor responde a este correo y lo resolveremos de inmediato."
        : "If you experienced any issues during your rental, please reply to this email and we'll make it right."
      }
    </p>
  </div>
  <div style="padding:16px 32px;text-align:center;color:#9ca3af;font-size:12px;background:#f9fafb">
    © ${new Date().getFullYear()} Buggy Rentals with Dani · Cozumel, Mexico
  </div>
</div>
</body>
</html>`;

  await resend.emails.send({
    from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
    to: booking.guestEmail,
    subject,
    html,
  });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  // Only allow deleting cancelled bookings
  const booking = await db.booking.findUnique({ where: { id }, select: { status: true } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (booking.status !== "cancelled") {
    return NextResponse.json({ error: "Only cancelled bookings can be deleted" }, { status: 400 });
  }

  await db.booking.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
