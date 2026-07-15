import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const data = await req.json();
  const resource = await db.resource.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description || null,
      youtubeUrl: data.youtubeUrl,
      category: data.category,
      active: data.active,
      sortOrder: data.sortOrder,
    },
  });
  return NextResponse.json(resource);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  await db.resource.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
