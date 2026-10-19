import { MetadataRoute } from "next";
import { getArticles } from "@/lib/blog/store";
import { SITE_URL, LOCALES } from "@/lib/seo";

/**
 * `contentUpdated` is the date the page's *content* last changed, as a literal
 * date — not the build date.
 *
 * Every entry used to report `new Date()`, so a rebuild with no content change
 * stamped the whole sitemap with a fresh timestamp. When every page claims to
 * have changed at the same instant on every deploy, Google stops trusting
 * lastmod from the site at all, which costs us the signal exactly when a page
 * really is updated.
 *
 * Bump the date by hand when you meaningfully change a page.
 */
const staticPages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const, contentUpdated: "2026-10-18" },
  { path: "/book", priority: 0.9, changeFrequency: "monthly" as const, contentUpdated: "2026-10-12" },
  { path: "/cruise-excursion", priority: 0.9, changeFrequency: "monthly" as const, contentUpdated: "2026-10-18" },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const, contentUpdated: "2026-10-12" },
  { path: "/driving-guide", priority: 0.7, changeFrequency: "monthly" as const, contentUpdated: "2026-10-12" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const, contentUpdated: "2026-10-13" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const, contentUpdated: "2026-10-12" },
];

/** Every entry declares its counterpart in the other language, so Google
 *  serves the right one per visitor instead of treating them as duplicates. */
function languagesFor(path: string) {
  return {
    en: `${SITE_URL}/en${path}`,
    es: `${SITE_URL}/es${path}`,
    "x-default": `${SITE_URL}/en${path}`,
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: new Date(`${page.contentUpdated}T12:00:00Z`),
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: { languages: languagesFor(page.path) },
      });
    }
  }

  const posts = await getArticles();

  for (const locale of LOCALES) {
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languagesFor(`/blog/${post.slug}`) },
      });
    }
  }

  return entries;
}
