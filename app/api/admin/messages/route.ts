import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Get all users who have messages, with their latest message
  const users = await db.user.findMany({
    where: { messages: { some: {} } },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      bookings: { select: { id: true, rentalDate: true, status: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(users);
}
