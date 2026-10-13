import { PHOTO_LIBRARY } from "@/lib/blog/photo-library";
import { estimateReadTime, slugify } from "@/lib/blog/render";

/**
 * Checks what the editor sends before it reaches the database.
 *
 * The admin form does its own checking, but the form is not the only way to
 * reach the route — and more to the point, a half-filled article that gets
 * published is a real failure mode here: the site is bilingual, and a post
 * missing its Spanish text would render an empty page at /es/blog/... So the
 * bilingual requirement is enforced on publish and relaxed for a draft, which
 * is the whole reason drafts exist.
 */

export interface ArticleInput {
  slug: string;
  title: string;
  titleEs: string;
  excerpt: string;
  excerptEs: string;
  content: string;
  contentEs: string;
  category: string;
  categoryEs: string;
  coverImage: string;
  date: string;
  readTime: number;
  published: boolean;
}

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/** The fields an article cannot be published without, in both languages. */
const REQUIRED_BOTH = [
  ["title", "titleEs", "a title"],
  ["excerpt", "excerptEs", "a summary"],
  ["content", "contentEs", "the article text"],
  ["category", "categoryEs", "a category"],
] as const;

/** The project compiles with `strict: false`, so a discriminated union on a
 *  boolean literal does not narrow — hence one shape with optional fields. */
export interface ParseResult {
  ok: boolean;
  value?: ArticleInput;
  error?: string;
}

export function parseArticle(body: Record<string, unknown>, opts: { slugFrom?: string } = {}): ParseResult {
  const published = body.published === true;

  const slug = opts.slugFrom ?? slugify(str(body.slug) || str(body.title));
  if (!slug) return { ok: false, error: "This article needs a title before it can be saved" };
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return { ok: false, error: "The web address can only use lowercase letters, numbers and dashes" };
  }
  if (slug.length > 80) return { ok: false, error: "The web address is too long" };

  const title = str(body.title);
  if (!title) return { ok: false, error: "This article needs a title" };

  if (published) {
    for (const [en, es, what] of REQUIRED_BOTH) {
      if (!str(body[en])) return { ok: false, error: `Add ${what} in English before publishing` };
      if (!str(body[es])) return { ok: false, error: `Add ${what} in Spanish before publishing` };
    }
  }

  /* Either a photo from the site's own library or one uploaded from the
     admin. That the uploaded one still exists is checked by the route, which
     is the only place that can ask the database. */
  const coverImage = str(body.coverImage);
  if (!coverImage) return { ok: false, error: "Pick a cover photo" };
  if (coverImage.startsWith("upload:")) {
    if (!/^upload:[a-z0-9]{10,40}$/i.test(coverImage)) {
      return { ok: false, error: "That uploaded photo could not be identified" };
    }
  } else if (!(coverImage in PHOTO_LIBRARY)) {
    return { ok: false, error: `"${coverImage}" is not a photo in the library` };
  }

  const date = str(body.date);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return { ok: false, error: "The date is not a valid date" };
  if (Number.isNaN(new Date(`${date}T12:00:00.000Z`).getTime())) {
    return { ok: false, error: "The date is not a valid date" };
  }

  const content = str(body.content);
  const raw = Number(body.readTime);
  const readTime = Number.isFinite(raw) && raw >= 1 && raw <= 90 ? Math.round(raw) : estimateReadTime(content);

  return {
    ok: true,
    value: {
      slug,
      title,
      titleEs: str(body.titleEs),
      excerpt: str(body.excerpt),
      excerptEs: str(body.excerptEs),
      content,
      contentEs: str(body.contentEs),
      category: str(body.category) || "Travel Guide",
      categoryEs: str(body.categoryEs) || "Guía de Viaje",
      coverImage,
      date,
      readTime,
      published,
    },
  };
}
