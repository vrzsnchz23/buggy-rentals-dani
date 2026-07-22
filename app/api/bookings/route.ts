import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import Stripe from "stripe";
import { Resend } from "resend";
import { formatCurrency, formatDate, VEHICLES, parseItems, type CartItem } from "@/lib/utils";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  apiVersion: "2026-05-27.dahlia",
});

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      customerType = "cruise",
      rentalDate,
      returnDate,
      items,
      totalAmount,
      depositAmount,
      deliveryType,
      hotelName,
      hotelAddress,
      guestName,
      guestEmail,
      guestPhone,
      driversLicense,
      cruiseName,
      cruiseShip,
      cruiseArrival,
      notes,
      paymentMethod,
      waiverAccepted,
      locale = "en",
    } = body;

    if (!guestName || !guestEmail || !guestPhone || !rentalDate) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!waiverAccepted) {
      return NextResponse.json({ error: "You must accept the rental agreement" }, { status: 400 });
    }

    const cartItems = (items as CartItem[]).filter((i) => i.qty > 0);
    if (cartItems.length === 0) {
      return NextResponse.json({ error: "Please select at least one vehicle" }, { status: 400 });
    }

    const rentalDay = new Date(rentalDate);
    rentalDay.setHours(0, 0, 0, 0);
    // For multi-day stays use returnDate, otherwise just the one day
    const lastDay = returnDate ? new Date(returnDate + "T00:00:00") : new Date(rentalDay);
    lastDay.setHours(0, 0, 0, 0);
    const checkoutDay = new Date(lastDay);
    checkoutDay.setDate(checkoutDay.getDate() + 1);

    // Check blocked dates across entire rental window
    const blocked = await db.blockedDate.findFirst({
      where: { date: { gte: rentalDay, lt: checkoutDay } },
    });
    if (blocked) {
      return NextResponse.json(
        { error: `This date is unavailable: ${blocked.reason || "Blocked by admin"}` },
        { status: 409 }
      );
    }

    // Check availability per vehicle type across entire rental window
    const existingBookings = await db.booking.findMany({
      where: {
        rentalDate: { lt: checkoutDay },
        OR: [
          { returnDate: null, rentalDate: { gte: rentalDay } },
          { returnDate: { gt: rentalDay } },
        ],
        status: { not: "cancelled" },
      },
      select: { items: true },
    });

    for (const cartItem of cartItems) {
      const stock = VEHICLES[cartItem.type].stock;
      const booked = existingBookings.reduce((sum: number, b: any) => {
        const bItems = parseItems(b.items);
        return sum + bItems.filter((i: any) => i.type === cartItem.type).reduce((s: number, i: any) => s + i.qty, 0);
      }, 0);
      if (booked + cartItem.qty > stock) {
        const label = VEHICLES[cartItem.type].label;
        return NextResponse.json(
          { error: `Not enough ${label}s available for those dates. Please choose different dates or fewer vehicles.` },
          { status: 409 }
        );
      }
    }

    // Create booking
    const booking = await db.booking.create({
      data: {
        customerType,
        guestName,
        guestEmail,
        guestPhone,
        items: JSON.stringify(cartItems),
        totalAmount,
        depositAmount,
        rentalDate: new Date(rentalDate),
        returnDate: returnDate ? new Date(returnDate) : undefined,
        deliveryType,
        hotelName,
        hotelAddress,
        driversLicense,
        cruiseName,
        cruiseShip,
        cruiseArrival: (() => {
          if (!cruiseArrival) return undefined;
          const match = cruiseArrival.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
          if (!match) return undefined;
          let h = parseInt(match[1]);
          const m = match[2];
          const ampm = match[3].toUpperCase();
          if (ampm === "PM" && h !== 12) h += 12;
          if (ampm === "AM" && h === 12) h = 0;
          const d = new Date(`${rentalDate}T${String(h).padStart(2, "0")}:${m}:00`);
          return isNaN(d.getTime()) ? undefined : d;
        })(),
        notes,
        paymentMethod,
        waiverAccepted,
        waiverSignedAt: new Date(),
        locale,
        status: "pending",
        paymentStatus: "unpaid",
      },
    });

    // For cash payments, await the email before returning so Vercel
    // doesn't terminate the function before the send completes.
    // For Stripe payments, the webhook sends it after payment succeeds.
    if (paymentMethod !== "online_full" && paymentMethod !== "online_deposit") {
      await sendConfirmationEmail(booking, cartItems, locale);
    }

    if (paymentMethod === "online_full" || paymentMethod === "online_deposit") {
      const chargeAmount = paymentMethod === "online_full" ? totalAmount : depositAmount;
      const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
      const orderSummary = cartItems.map((i) => `${i.qty}× ${VEHICLES[i.type].label}`).join(", ");

      const session = await stripe.checkout.sessions.create({
        automatic_payment_methods: { enabled: true },
        mode: "payment",
        customer_email: guestEmail,
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: `Vehicle Rental – ${formatDate(rentalDate)}`,
                description: `${orderSummary} · Buggy Rentals with Dani`,
              },
              unit_amount: Math.round(chargeAmount * 100),
            },
            quantity: 1,
          },
        ],
        metadata: { bookingId: booking.id },
        success_url: `${baseUrl}/${locale}/book/confirmation?id=${booking.id}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${baseUrl}/${locale}/book?cancelled=${booking.id}`,
      });

      await db.booking.update({
        where: { id: booking.id },
        data: { stripePaymentId: session.id },
      });

      return NextResponse.json({ id: booking.id, stripeUrl: session.url });
    }

    return NextResponse.json({ id: booking.id });
  } catch (error) {
    console.error("Booking error:", error);
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: "Failed to create booking", detail: msg }, { status: 500 });
  }
}

async function sendConfirmationEmail(
  booking: {
    id: string;
    customerType?: string | null;
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

  // Send emails independently so one failure doesn't block the other
  await resend.emails.send({
    from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
    to: booking.guestEmail,
    subject,
    html,
  }).catch((err) => console.error("Customer confirmation email failed:", err));

  const orderSummary = cartItems.map((i) => `${i.qty}× ${VEHICLES[i.type].label}`).join(", ");
  await resend.emails.send({
    from: "Buggy Rentals with Dani <dani@buggycozumel.com>",
    to: process.env.ADMIN_EMAIL || "dani@buggycozumel.com",
    subject: `🚗 New Booking #${confirmNum} – ${booking.guestName} – ${formatDate(booking.rentalDate)}`,
    html: `<p>New booking received!</p><p>Name: ${booking.guestName}<br>Date: ${formatDate(booking.rentalDate)}<br>Vehicles: ${orderSummary}<br>${booking.cruiseArrival ? `Port Arrival Time: ${new Date(booking.cruiseArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}<br>` : ""}Payment: ${booking.paymentMethod}<br>Total: ${formatCurrency(booking.totalAmount)}</p>`,
  }).catch((err) => console.error("Admin notification email failed:", err));
}
