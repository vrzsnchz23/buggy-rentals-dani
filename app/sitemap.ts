import { MetadataRoute } from "next";
import { getArticles } from "@/lib/blog/store";
import { SITE_URL, LOCALES } from "@/lib/seo";

const staticPages = [
  { path: "", priority: 1.0, changeFrequency: "weekly" as const },
  { path: "/book", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/cruise-excursion", priority: 0.9, changeFrequency: "monthly" as const },
  { path: "/pricing", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/driving-guide", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" as const },
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
  const now = new Date();

  for (const locale of LOCALES) {
    for (const page of staticPages) {
      entries.push({
        url: `${SITE_URL}/${locale}${page.path}`,
        lastModified: now,
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
