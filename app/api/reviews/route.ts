import { NextResponse } from "next/server";
import { getReviews } from "@/lib/reviews";

export const revalidate = 86400; // cache 24h

/**
 * Kept for any client that still polls this endpoint; the homepage now renders
 * reviews on the server via getReviews() directly.
 */
export async function GET() {
  return NextResponse.json(await getReviews());
}
