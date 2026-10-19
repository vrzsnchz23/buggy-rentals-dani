import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";
import { validateManualBooking, toBookingRow } from "@/lib/bookings/manual";

/**
 * Registers a booking taken over WhatsApp, by phone, or at the module.
 *
 * Behind the same admin session as the rest of /api/admin, and re-validates
 * every field server-side: the quick-entry form is built for speed on a
 * phone, so the browser is not the place to enforce anything that ends up as
 * revenue on the dashboard.
 */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !(session.user as { isAdmin?: boolean })?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Cuerpo de la petición no válido." }, { status: 400 });
  }

  const result = validateManualBooking(body);
  if (result.ok === false) {
    return NextResponse.json(
      { error: result.errors.join(" "), errors: result.errors },
      { status: 400 }
    );
  }

  const booking = await db.booking.create({ data: toBookingRow(result.value) });

  return NextResponse.json({ id: booking.id, totalAmount: booking.totalAmount }, { status: 201 });
}
