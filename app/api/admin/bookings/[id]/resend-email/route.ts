import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { Resend } from "resend";
import { formatCurrency, formatDate, VEHICLES, parseItems, type CartItem } from "@/lib/utils";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const cartItems = parseItems(booking.items).filter((i: CartItem) => i.qty > 0);
  const locale = booking.locale ?? "en";

  try {
    await sendConfirmationEmail(booking, cartItems, locale);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Resend email error:", err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

async function sendConfirmationEmail(
  booking: {
    id: string;
    guestName: string;
    guestEmail: string;
    rentalDate: Date;
    returnDate?: Date | null;
    totalAmount: number;
    depositAmount: number;
    paymentMethod: string;
    deliveryType: string;
    hotelName?: string | null;
    cruiseArrival?: Date | null;
  },
  cartItems: CartItem[],
  locale: string
) {
  const confirmNum = booking.id.slice(-8).toUpperCase();
  const isEs = locale === "es";

  const subject = isEs
    ? `✅ Confirmación de Reserva #${confirmNum} – Buggy Rentals con Dani`
    : `✅ Booking Confirmation #${confirmNum} – Buggy Rentals with Dani`;

  const itemsHtml = cartItems
    .map((i) => {
      const label = isEs ? VEHICLES[i.type].labelEs : VEHICLES[i.type].label;
      return `<tr><td style="padding:8px 0;color:#9ca3af;border-bottom:1px solid #f3f4f6">${i.qty}× ${label}</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;text-align:right;border-bottom:1px solid #f3f4f6">${formatCurrency(i.subtotal)}</td></tr>`;
    })
    .join("");

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
    <h2 style="color:#1B4F72;margin:0 0 8px">${isEs ? "¡Tu reserva está confirmada!" : "Your booking is confirmed!"} ✅</h2>
    <p style="color:#6b7280;margin:0 0 24px">${isEs ? "Hola" : "Hi"} ${booking.guestName},</p>

    <div style="background:#F5F0EB;border-radius:12px;padding:20px;margin-bottom:24px">
      <div style="font-size:12px;color:#9ca3af;margin-bottom:4px">${isEs ? "Número de Confirmación" : "Confirmation Number"}</div>
      <div style="font-size:28px;font-weight:900;color:#1B4F72;letter-spacing:4px">#${confirmNum}</div>
    </div>

    <table style="width:100%;border-collapse:collapse;font-size:14px">
      <tr><td style="padding:8px 0;color:#9ca3af;border-bottom:1px solid #f3f4f6">${isEs ? "Fecha" : "Date"}</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;text-align:right;border-bottom:1px solid #f3f4f6">${booking.returnDate ? `${formatDate(booking.rentalDate)} → ${formatDate(booking.returnDate)}` : formatDate(booking.rentalDate)}</td></tr>
      ${itemsHtml}
      <tr><td style="padding:8px 0;color:#9ca3af;border-bottom:1px solid #f3f4f6">${isEs ? "Recogida" : "Pickup"}</td><td style="padding:8px 0;font-weight:600;color:#1a1a1a;text-align:right;border-bottom:1px solid #f3f4f6">${booking.deliveryType === "pickup" ? (isEs ? "Punto de encuentro frente al puerto" : "Meeting Point across the Street from the port") : `Hotel: ${booking.hotelName}`}</td></tr>
      ${booking.cruiseArrival ? `<tr><td style="padding:8px 0;color:#9ca3af;border-bottom:1px solid #f3f4f6">${isEs ? "Hora de llegada al puerto" : "Port Arrival Time"}</td><td style="padding:8px 0;font-weight:600;color:#E8836A;text-align:right;border-bottom:1px solid #f3f4f6">${new Date(booking.cruiseArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</td></tr>` : ""}
      <tr><td style="padding:8px 0;color:#9ca3af">${isEs ? "Total" : "Total"}</td><td style="padding:8px 0;font-weight:900;color:#E8836A;text-align:right;font-size:18px">${formatCurrency(booking.totalAmount)}</td></tr>
    </table>

    <div style="background:#1B4F72;border-radius:12px;padding:16px;margin-top:24px;color:white;font-size:13px">
      <strong>${isEs ? "¿Qué sigue?" : "What's next?"}</strong><br><br>
      📍 <a href="https://maps.app.goo.gl/YxRLudbthWJQLQwv9" style="color:#7FB5B5">${isEs ? "Punto de encuentro frente al puerto (ver en Google Maps)" : "Meeting Point across the Street from the port (view on Google Maps)"}</a><br>
      🕗 ${isEs ? "Horario: 8:00 AM – 5:00 PM" : "Hours: 8:00 AM – 5:00 PM"}<br>
      🪪 ${isEs ? "Trae tu licencia de conducir" : "Bring your driver's license"}<br>
      📱 ${isEs ? "Te enviaremos un WhatsApp el día anterior" : "We'll WhatsApp you the day before"}
    </div>
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

  const orderSummary = cartItems.map((i) => `${i.qty}× ${VEHICLES[i.type].label}`).join(", ");
  await resend.emails.send({
    from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
    to: process.env.ADMIN_EMAIL || "dani@buggycozumel.com",
    subject: `🚗 [RESENT] Booking #${confirmNum} – ${booking.guestName} – ${formatDate(booking.rentalDate)}`,
    html: `<p>Confirmation email manually resent from admin panel.</p><p>Name: ${booking.guestName}<br>Email: ${booking.guestEmail}<br>Date: ${formatDate(booking.rentalDate)}<br>Vehicles: ${orderSummary}<br>Payment: ${booking.paymentMethod}<br>Total: ${formatCurrency(booking.totalAmount)}</p>`,
  });
}
