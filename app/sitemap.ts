import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog/posts";

const BASE_URL = "https://buggycozumel.com";
const locales = ["en", "es"];

const staticPages = [
  "",
  "/book",
  "/pricing",
  "/driving-guide",
  "/blog",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  // Static pages for each locale
  for (const locale of locales) {
    for (const page of staticPages) {
      entries.push({
        url: `${BASE_URL}/${locale}${page}`,
        lastModified: new Date(),
        changeFrequency: page === "" ? "weekly" : "monthly",
        priority: page === "" ? 1.0 : page === "/book" ? 0.9 : 0.7,
      });
    }
  }

  // Blog posts for each locale
  for (const locale of locales) {
    for (const post of blogPosts) {
      entries.push({
        url: `${BASE_URL}/${locale}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }

  return entries;
}
