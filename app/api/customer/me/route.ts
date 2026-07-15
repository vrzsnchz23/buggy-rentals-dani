import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer-auth";
import { db } from "@/lib/db";
import { parseItems, VEHICLES, formatCurrency, formatDate } from "@/lib/utils";

export async function GET() {
  const session = await getCustomerSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [bookings, messages, coupons, resources] = await Promise.all([
    db.booking.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
    }),
    db.message.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "asc" },
    }),
    db.coupon.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
    db.resource.findMany({
      where: { active: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    }),
  ]);

  // Mark admin messages as read
  await db.message.updateMany({
    where: { userId: session.userId, fromAdmin: true, read: false },
    data: { read: true },
  });

  return NextResponse.json({
    user: { id: session.user.id, email: session.user.email, name: session.user.name },
    bookings: bookings.map((b) => ({
      ...b,
      items: parseItems(b.items).filter((i) => i.qty > 0).map((i) => ({
        label: VEHICLES[i.type]?.label ?? i.type,
        labelEs: VEHICLES[i.type]?.labelEs ?? i.type,
        qty: i.qty,
        subtotal: formatCurrency(i.subtotal),
      })),
      rentalDate: formatDate(b.rentalDate),
      returnDate: b.returnDate ? formatDate(b.returnDate) : null,
      totalAmount: formatCurrency(b.totalAmount),
    })),
    messages,
    coupons,
    resources,
  });
}
