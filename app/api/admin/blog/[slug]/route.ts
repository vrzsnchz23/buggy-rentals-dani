import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { coverExists, isSeedSlug, seedArticle, toStoredDate } from "@/lib/blog/store";
import { parseArticle } from "@/lib/blog/validate";
import { revalidateBlog } from "@/lib/blog/revalidate";
import { dbMessage } from "../route";

/**
 * Saves an article.
 *
 * An upsert rather than an update, because of the two sources: the five
 * original articles have no row until the first time one is saved, and that
 * first save is what copies it into the database. The slug is the key and the
 * editor does not let it change after creation — renaming it would break a
 * published URL and every link pointing at it.
 */
export async function PUT(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;
  const parsed = parseArticle(await req.json(), { slugFrom: slug });
  if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: 400 });
  const a = parsed.value;

  if (!(await coverExists(a.coverImage))) {
    return NextResponse.json({ error: "That cover photo is no longer available. Pick another." }, { status: 400 });
  }

  try {
    await db.blogPost.upsert({
      where: { slug },
      update: { ...a, date: toStoredDate(a.date) },
      create: { ...a, date: toStoredDate(a.date) },
    });
    revalidateBlog(slug);
    return NextResponse.json({ slug });
  } catch (e) {
    return NextResponse.json({ error: dbMessage(e) }, { status: 500 });
  }
}

/**
 * Takes an article off the site.
 *
 * For an article written in the admin this deletes the row. For one of the
 * five that live in the code it cannot: the text is in the bundle, and a
 * delete would simply bring it back on the next read. So it writes the
 * article's own text into a row with published = false, which hides it and
 * leaves it recoverable — the editor can publish it again.
 */
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { slug } = await params;

  try {
    if (isSeedSlug(slug)) {
      const seed = seedArticle(slug);
      await db.blogPost.upsert({
        where: { slug },
        update: { published: false },
        create: {
          slug: seed.slug,
          title: seed.title,
          titleEs: seed.titleEs,
          excerpt: seed.excerpt,
          excerptEs: seed.excerptEs,
          content: seed.content,
          contentEs: seed.contentEs,
          category: seed.category,
          categoryEs: seed.categoryEs,
          coverImage: seed.coverImage,
          date: toStoredDate(seed.date),
          readTime: seed.readTime,
          published: false,
        },
      });
      revalidateBlog(slug);
      return NextResponse.json({ hidden: true });
    }

    await db.blogPost.delete({ where: { slug } });
    revalidateBlog(slug);
    return NextResponse.json({ deleted: true });
  } catch (e) {
    return NextResponse.json({ error: dbMessage(e) }, { status: 500 });
  }
}
