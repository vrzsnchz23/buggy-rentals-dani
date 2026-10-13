import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coverExists, getAllArticles, slugExists, toStoredDate } from "@/lib/blog/store";
import { parseArticle } from "@/lib/blog/validate";
import { revalidateBlog } from "@/lib/blog/revalidate";

export async function GET() {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const articles = await getAllArticles();
  /* The resolved StaticImageData is not useful over the wire. */
  return NextResponse.json(articles.map(({ cover, ...rest }) => ({ ...rest, coverSrc: cover.src })));
}

/** A new article. */
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const parsed = parseArticle(await req.json());
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const a = parsed.value;

  /* Checked against both sources, not just the table: the five articles in
     the code own their URLs too, and a row that shadowed one of them would
     quietly replace a live article. */
  if (await slugExists(a.slug)) {
    return NextResponse.json(
      { error: `There is already an article at /blog/${a.slug}. Change the web address.` },
      { status: 409 }
    );
  }

  if (!(await coverExists(a.coverImage))) {
    return NextResponse.json({ error: "That cover photo is no longer available. Pick another." }, { status: 400 });
  }

  try {
    const created = await db.blogPost.create({
      data: { ...a, date: toStoredDate(a.date) },
    });
    revalidateBlog(a.slug);
    return NextResponse.json({ slug: created.slug });
  } catch (e) {
    return NextResponse.json({ error: dbMessage(e) }, { status: 500 });
  }
}

/**
 * The one database error worth translating: the table is created by
 * `npm run db:blog`, and until that has run against this database every write
 * fails with a Postgres error about a missing relation.
 */
export function dbMessage(e: unknown) {
  const msg = e instanceof Error ? e.message : String(e);
  if (/does not exist|relation .* does not exist|P2021/i.test(msg)) {
    return "The blog table has not been created on this database yet. Run `npm run db:blog`.";
  }
  return "The article could not be saved. Nothing was changed.";
}
