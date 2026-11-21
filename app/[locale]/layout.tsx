import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import localFont from "next/font/local";
import "@/app/globals.css";
import { isLocale, alternatesFor, SITE_URL } from "@/lib/seo";
import { businessGraph, jsonLd } from "@/lib/schema";
import { Suspense } from "react";
import { Analytics } from "@/components/Analytics";
import { AnalyticsEvents } from "@/components/AnalyticsEvents";
import { ScrollReveal } from "@/components/ScrollReveal";

/**
 * The fonts live in the repository instead of coming from `next/font/google`.
 *
 * `next/font/google` downloads the woff2 files from fonts.gstatic.com during
 * the build. That download is a network call inside the bundler, and when it
 * failed the whole deploy failed with "Can't resolve
 * '@vercel/turbopack-next/internal/font/google/font'" — once on Vercel, once
 * here, both times with a perfectly correct codebase. Serving a rental site
 * should not depend on Google answering a request at build time.
 *
 * These are the same files Google would have served, committed once: the
 * variable versions, so a single 32–48 KB file carries every weight from 100
 * to 900 instead of one file per weight. Only the `latin` subset is kept —
 * it covers U+0000–00FF, which is all of English and all of Spanish
 * (á é í ó ú ñ ü ¿ ¡). `latin-ext` only adds glyphs for languages the site
 * does not publish in.
 *
 * They are also faster for the guest: no DNS lookup, TLS handshake and round
 * trip to a third-party host before the first word can be painted in the real
 * typeface.
 */
const outfit = localFont({
  src: "../fonts/outfit-latin.woff2",
  variable: "--font-outfit",
  display: "swap",
  weight: "100 900",
  // Measured against the real Outfit metrics so the fallback occupies the same
  // space: swapping to the webfont must not shove the layout around.
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
});

const inter = localFont({
  src: "../fonts/inter-latin.woff2",
  variable: "--font-inter",
  display: "swap",
  weight: "100 900",
  fallback: ["system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "sans-serif"],
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: {
      default: t("homeTitle"),
      template: `%s | Buggy Rentals with Dani – Cozumel`,
    },
    description: t("homeDescription"),
    // No `keywords`: every search engine has ignored the meta keywords tag for
    // over a decade, and publishing it only hands competitors our target list.
    metadataBase: new URL(SITE_URL),
    alternates: alternatesFor(locale),
    openGraph: {
      title: t("homeTitle"),
      description: t("homeDescription"),
      url: `${SITE_URL}/${locale}`,
      siteName: "Buggy Rentals with Dani",
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_MX",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image`, width: 1200, height: 630, alt: t("homeTitle") }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("homeTitle"),
      description: t("homeDescription"),
      images: [`${SITE_URL}/opengraph-image`],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const messages = await getMessages();
  const skipLabel = locale === "es" ? "Ir al contenido" : "Skip to content";

  return (
    <html lang={locale} className={`${outfit.variable} ${inter.variable}`}>
      <body>
        {/* Site-wide entity graph. Lives here so every page carries the same
            business @id, and page-level markup only has to reference it. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(businessGraph(locale))}
        />
        <a href="#main" className="skip-link">
          {skipLabel}
        </a>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <ScrollReveal />
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
        <Analytics />
        <Suspense fallback={null}>
          <AnalyticsEvents />
        </Suspense>
      </body>
    </html>
  );
}
