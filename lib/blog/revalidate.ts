import "server-only";
import { revalidatePath } from "next/cache";
import { LOCALES } from "@/lib/seo";

/**
 * Pushes a published change out to the live site.
 *
 * The blog pages are prerendered and their data comes from Prisma, not from
 * `fetch`, so Next has no way to know a post changed — without this, writing
 * an article in the admin would change nothing a visitor can see until the
 * next deploy. Called after every mutation.
 */
export function revalidateBlog(slug?: string) {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}/blog`);
    if (slug) revalidatePath(`/${locale}/blog/${slug}`);
  }
  revalidatePath("/sitemap.xml");
}
