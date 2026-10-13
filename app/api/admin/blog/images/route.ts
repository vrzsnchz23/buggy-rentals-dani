import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

/**
 * Receives a cover photo from Dani's computer.
 *
 * The browser has already done the heavy part: it shrinks the photo to at most
 * 2000px wide, re-encodes it as JPEG and computes the tiny blur placeholder,
 * which is why a 6MB photo off a phone arrives here as a few hundred
 * kilobytes. It also means the upload stays well under the body-size limit a
 * serverless function has, and that nothing on the server has to decode an
 * image.
 *
 * Everything the browser claims is still checked here. A route is reachable
 * without the form, and `width`/`height` are not cosmetic — they are what
 * next/image uses to reserve the space, so a wrong pair is a layout bug on a
 * live page.
 */

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

/** Comfortably above a 2000px JPEG and well under the 4.5MB body limit. */
const MAX_BYTES = 4 * 1024 * 1024;

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const images = await db.blogImage.findMany({
      /* Never the bytes: this list only has to draw thumbnails. */
      select: { id: true, filename: true, width: true, height: true, blurDataURL: true, createdAt: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(images);
  } catch {
    return NextResponse.json([]);
  }
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "The upload was not readable" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No photo was attached" }, { status: 400 });

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json({ error: "Only JPG, PNG and WebP photos can be used" }, { status: 400 });
  }
  if (file.size === 0) return NextResponse.json({ error: "That file is empty" }, { status: 400 });
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "That photo is too large even after shrinking" }, { status: 413 });
  }

  const width = Number(form.get("width"));
  const height = Number(form.get("height"));
  if (!Number.isInteger(width) || !Number.isInteger(height) || width < 1 || height < 1 || width > 10000 || height > 10000) {
    return NextResponse.json({ error: "The photo's dimensions were not readable" }, { status: 400 });
  }

  const blurDataURL = String(form.get("blurDataURL") ?? "");
  if (!blurDataURL.startsWith("data:image/") || blurDataURL.length > 6000) {
    return NextResponse.json({ error: "The photo's placeholder was not readable" }, { status: 400 });
  }

  /* Only ever shown as text in the admin, but there is no reason for a
     filename from a stranger's disk to carry a path in it. */
  const filename = (String(form.get("filename") ?? file.name) || "photo")
    .replace(/[/\\]+/g, "-")
    .slice(0, 120);

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const image = await db.blogImage.create({
      data: { filename, mimeType: file.type, bytes, width, height, blurDataURL },
      select: { id: true, filename: true, width: true, height: true, blurDataURL: true, createdAt: true },
    });
    return NextResponse.json(image);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (/does not exist|P2021/i.test(msg)) {
      return NextResponse.json(
        { error: "The photo table has not been created on this database yet. Run prisma/sql/add-blog-post-table.sql." },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: "The photo could not be saved" }, { status: 500 });
  }
}
