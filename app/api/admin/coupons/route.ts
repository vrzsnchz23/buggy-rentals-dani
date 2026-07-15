import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const coupons = await db.coupon.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(coupons);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const coupon = await db.coupon.create({
    data: {
      partnerName: data.partnerName,
      title: data.title,
      description: data.description,
      code: data.code || null,
      imageEmoji: data.imageEmoji || "🎟️",
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return NextResponse.json(coupon);
}
