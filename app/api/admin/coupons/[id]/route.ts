import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const coupon = await db.coupon.update({
    where: { id },
    data: {
      partnerName: data.partnerName,
      title: data.title,
      description: data.description,
      code: data.code || null,
      imageEmoji: data.imageEmoji,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      active: data.active,
      sortOrder: data.sortOrder,
    },
  });
  return NextResponse.json(coupon);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.coupon.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
