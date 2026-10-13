import { NextResponse } from "next/server";
import { db } from "@/lib/db";

/**
 * Serves an uploaded cover photo.
 *
 * Public on purpose: these are the cover images of published articles, and
 * next/image fetches this URL to produce its resized variants.
 *
 * The bytes behind an id never change — a new upload is a new row with a new
 * id — so the response is immutable and gets cached for a year. Without that
 * header every visitor would wake a function and a database query to see a
 * photo that has not moved since it was uploaded.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  /* cuid, which is what every id in this schema is. Anything else cannot
     match a row, so it is not worth a round trip. */
  if (!/^[a-z0-9]{10,40}$/i.test(id)) return new NextResponse("Not found", { status: 404 });

  try {
    const image = await db.blogImage.findUnique({
      where: { id },
      select: { bytes: true, mimeType: true },
    });
    if (!image) return new NextResponse("Not found", { status: 404 });

    return new NextResponse(new Uint8Array(image.bytes), {
      headers: {
        "Content-Type": image.mimeType,
        "Content-Length": String(image.bytes.length),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
