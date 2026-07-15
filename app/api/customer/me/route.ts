import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { parseItems, VEHICLES, formatCurrency, formatDate } from "@/lib/utils";

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const userId = (session.user as any).id as string;
  const email = session.user.email;

  const [bookings, messages, coupons, resources] = await Promise.all([
    db.booking.findMany({
      where: { OR: [{ userId }, { guestEmail: email }] },
      orderBy: { createdAt: "desc" },
    }),
    db.message.findMany({
      where: { userId },
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
    where: { userId, fromAdmin: true, read: false },
    data: { read: true },
  });

  return NextResponse.json({
    user: { id: userId, email, name: session.user.name, image: session.user.image },
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
