import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Only cancel bookings that are still pending (never paid)
  await db.booking.updateMany({
    where: { id, status: "pending", paymentStatus: "unpaid" },
    data: { status: "cancelled" },
  });

  return NextResponse.json({ ok: true });
}
