import "server-only";
import type { StaticImageData } from "next/image";
import { db } from "@/lib/db";
import { blogPosts, type BlogPost as SeedPost } from "@/lib/blog/posts";
import { resolveCover } from "@/lib/blog/photo-library";
import { isUploadKey, uploadId, uploadToImageData, type UploadMeta } from "@/lib/blog/uploads";

/**
 * Where the blog gets its articles.
 *
 * Two sources, deliberately: the five original articles are code in
 * lib/blog/posts.ts, and anything written in the admin panel is a row in the
 * BlogPost table. A row wins on a slug collision.
 *
 * That shape was chosen over migrating the five into the database because it
 * has no failure mode that loses an article. The table starts empty and the
 * blog is byte-identical to what is live today; if the table does not exist at
 * all — the window between deploying this and creating it — every read below
 * falls back to the five and the site stays up. Editing one of the five in the
 * admin writes a row holding its full text, so the first save is the
 * migration, and it only ever happens for an article Dani actually opened.
 *
 * "Deleting" one of the five therefore cannot remove it from the code. It
 * writes a row with published = false, which is what `hidden` means below.
 */

export {
  UPLOAD_PREFIX,
  isUploadKey,
  uploadId,
  uploadKey,
  uploadToImageData,
  type UploadMeta,
} from "@/lib/blog/uploads";

export interface Article {
  slug: string;
  title: string;
  titleEs: string;
  excerpt: string;
  excerptEs: string;
  content: string;
  contentEs: string;
  category: string;
  categoryEs: string;
  /** A photo-library key, or `upload:<id>`. */
  coverImage: string;
  /** The resolved image, with its blur placeholder either way. */
  cover: StaticImageData;
  /** YYYY-MM-DD the article was first published. */
  date: string;
  /** YYYY-MM-DD of the last revision, when there has been one. */
  updated?: string;
  readTime: number;
  published: boolean;
  /** Whether the text being shown comes from the code or the database. */
  source: "seed" | "db";
  /** A code article that a database row is now overriding. */
  overridden: boolean;
}

/** A date-only value, stored at noon UTC so no timezone can shift the day. */
export function toStoredDate(ymd: string) {
  return new Date(`${ymd}T12:00:00.000Z`);
}

function toYmd(d: Date) {
  return d.toISOString().slice(0, 10);
}

function fromSeed(p: SeedPost): Article {
  return {
    ...p,
    cover: resolveCover(p.coverImage),
    published: true,
    source: "seed",
    overridden: false,
  };
}

type Row = {
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
  date: Date;
  readTime: number;
  published: boolean;
};

function fromRow(r: Row, overridden: boolean, uploads: Map<string, UploadMeta>): Article {
  const upload = isUploadKey(r.coverImage) ? uploads.get(uploadId(r.coverImage)) : undefined;
  return {
    slug: r.slug,
    title: r.title,
    titleEs: r.titleEs,
    excerpt: r.excerpt,
    excerptEs: r.excerptEs,
    content: r.content,
    contentEs: r.contentEs,
    category: r.category,
    categoryEs: r.categoryEs,
    coverImage: r.coverImage,
    /* A missing upload falls back to the default cover rather than rendering a
       broken image: the article itself is still fine. */
    cover: upload ? uploadToImageData(upload) : resolveCover(r.coverImage),
    date: toYmd(r.date),
    readTime: r.readTime,
    published: r.published,
    source: "db",
    overridden,
  };
}

let tableWarned = false;

/**
 * Every row, or an empty list if the table is not there yet.
 *
 * The blog is the one part of the site a database problem must not be allowed
 * to take down: it is static content that already exists in the bundle.
 */
async function rows(): Promise<Row[]> {
  try {
    return await db.blogPost.findMany({ orderBy: { date: "desc" } });
  } catch (e) {
    if (!tableWarned) {
      tableWarned = true;
      console.warn(
        "[blog] could not read the BlogPost table; serving the articles in lib/blog/posts.ts only.",
        e instanceof Error ? e.message : e
      );
    }
    return [];
  }
}

/** Metadata for uploaded covers. Never the bytes. */
export async function getUploads(): Promise<UploadMeta[]> {
  try {
    return await db.blogImage.findMany({
      select: { id: true, filename: true, width: true, height: true, blurDataURL: true },
      orderBy: { createdAt: "desc" },
    });
  } catch {
    return [];
  }
}

async function uploadsFor(rs: Row[]): Promise<Map<string, UploadMeta>> {
  const ids = rs.filter((r) => isUploadKey(r.coverImage)).map((r) => uploadId(r.coverImage));
  if (ids.length === 0) return new Map();
  try {
    const found = await db.blogImage.findMany({
      where: { id: { in: ids } },
      select: { id: true, filename: true, width: true, height: true, blurDataURL: true },
    });
    return new Map(found.map((m) => [m.id, m]));
  } catch {
    return new Map();
  }
}

/** Whether a cover key points at something that exists. */
export async function coverExists(key: string): Promise<boolean> {
  if (!isUploadKey(key)) return true; // the library is checked at parse time
  try {
    const found = await db.blogImage.findUnique({ where: { id: uploadId(key) }, select: { id: true } });
    return found !== null;
  } catch {
    return false;
  }
}

const byNewest = (a: Article, b: Article) => new Date(b.date).getTime() - new Date(a.date).getTime();

/** Both sources merged, drafts and hidden articles included. For the admin. */
export async function getAllArticles(): Promise<Article[]> {
  const rs = await rows();
  const uploads = await uploadsFor(rs);
  const seedSlugs = new Set(blogPosts.map((p) => p.slug));
  const merged = new Map<string, Article>();
  for (const p of blogPosts) merged.set(p.slug, fromSeed(p));
  for (const r of rs) merged.set(r.slug, fromRow(r, seedSlugs.has(r.slug), uploads));
  return [...merged.values()].sort(byNewest);
}

/** What the public blog shows. */
export async function getArticles(): Promise<Article[]> {
  return (await getAllArticles()).filter((a) => a.published);
}

export async function getArticle(slug: string): Promise<Article | undefined> {
  return (await getArticles()).find((a) => a.slug === slug);
}

/** Including drafts. For the editor. */
export async function getArticleForAdmin(slug: string): Promise<Article | undefined> {
  return (await getAllArticles()).find((a) => a.slug === slug);
}

/** Whether a slug is taken by either source. */
export async function slugExists(slug: string): Promise<boolean> {
  return (await getAllArticles()).some((a) => a.slug === slug);
}

/** The code article behind a slug, if there is one. */
export function seedArticle(slug: string): Article | undefined {
  const p = blogPosts.find((x) => x.slug === slug);
  return p ? fromSeed(p) : undefined;
}

export function isSeedSlug(slug: string) {
  return blogPosts.some((p) => p.slug === slug);
}
