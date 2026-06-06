import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { date, reason } = await req.json();
  const blocked = await db.blockedDate.create({
    data: { date: new Date(date), reason },
  });
  return NextResponse.json(blocked);
}
