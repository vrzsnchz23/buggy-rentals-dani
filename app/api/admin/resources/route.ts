import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const resources = await db.resource.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json(resources);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const resource = await db.resource.create({
    data: {
      title: data.title,
      description: data.description || null,
      youtubeUrl: data.youtubeUrl,
      category: data.category || "general",
      active: data.active ?? true,
      sortOrder: data.sortOrder ?? 0,
    },
  });
  return NextResponse.json(resource);
}
