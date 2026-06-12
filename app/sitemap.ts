import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/posts";

const BASE_URL = "https://buggycozumel.com";
const locales = ["en", "es"];
const staticPages = ["", "/book", "/pricing", "/driving-guide", "/cruise-excursion", "/blog"];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];
  entries.push({ url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 });
  for (const locale of locales) {
    for (const page of staticPages) {
      const isHome = page === "";
      const isBuy = page === "/book" || page === "/cruise-excursion";
      entries.push({ url: `${BASE_URL}/${locale}${page}`, lastModified: new Date(), changeFrequency: isHome ? "weekly" : "monthly", priority: isHome ? 1.0 : isBuy ? 0.9 : page === "/pricing" ? 0.8 : 0.7 });
    }
  }
  for (const locale of locales) {
    for (const post of blogPosts) {
      entries.push({ url: `${BASE_URL}/${locale}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "monthly", priority: 0.6 });
    }
  }
  return entries;
}
