#!/usr/bin/env node
/**
 * Ping IndexNow with the site's URLs so Bing (and, through Bing, the search
 * index ChatGPT reaches for) picks up new and changed pages without waiting
 * for a crawl.
 *
 * Run after a production deploy:
 *   node scripts/indexnow.mjs
 *
 * Submits every URL in the live sitemap. IndexNow accepts up to 10,000 URLs
 * per request and ignores repeats, so resubmitting the full set is fine and
 * much simpler than diffing — this site has well under a hundred pages.
 *
 * The key is public by design: IndexNow verifies ownership by fetching
 * https://buggycozumel.com/<key>.txt and checking it contains <key>.
 */

const KEY = process.env.INDEXNOW_KEY ?? "8a211299d44f51034d19a69485a29dda";
const HOST = "buggycozumel.com";
const SITEMAP = `https://${HOST}/sitemap.xml`;

async function sitemapUrls() {
  const res = await fetch(SITEMAP);
  if (!res.ok) throw new Error(`sitemap fetch failed: ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const urlList = await sitemapUrls();
  if (urlList.length === 0) throw new Error("sitemap contained no <loc> entries");

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: HOST,
      key: KEY,
      keyLocation: `https://${HOST}/${KEY}.txt`,
      urlList,
    }),
  });

  // 200 and 202 both mean accepted; 422 usually means the key file is missing
  // or does not match, which is the failure worth shouting about.
  if (!res.ok) {
    throw new Error(`IndexNow rejected the submission: ${res.status} ${await res.text()}`);
  }
  console.log(`IndexNow: submitted ${urlList.length} URLs (HTTP ${res.status})`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
