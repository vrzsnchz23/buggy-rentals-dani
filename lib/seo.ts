import type { Metadata } from "next";

export const SITE_URL = "https://buggycozumel.com";
export const LOCALES = ["en", "es"] as const;
export type Locale = (typeof LOCALES)[number];

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Builds the canonical + hreflang block for a page.
 * `path` is the route *without* the locale prefix, e.g. "" or "/book".
 */
export function alternatesFor(locale: string, path = ""): Metadata["alternates"] {
  return {
    canonical: `${SITE_URL}/${locale}${path}`,
    languages: {
      en: `${SITE_URL}/en${path}`,
      es: `${SITE_URL}/es${path}`,
      "x-default": `${SITE_URL}/en${path}`,
    },
  };
}

/**
 * Locale-aware page metadata. Every public page used to ship the same English
 * title and description regardless of locale, which made /es invisible to
 * Spanish-language search.
 */
export function pageMetadata({
  locale,
  path = "",
  title,
  description,
  image = `${SITE_URL}/opengraph-image`,
}: {
  locale: string;
  path?: string;
  title: string;
  description: string;
  image?: string;
}): Metadata {
  const url = `${SITE_URL}/${locale}${path}`;
  return {
    title,
    description,
    alternates: alternatesFor(locale, path),
    openGraph: {
      title,
      description,
      url,
      siteName: "Buggy Rentals with Dani",
      locale: locale === "es" ? "es_MX" : "en_US",
      alternateLocale: locale === "es" ? "en_US" : "es_MX",
      type: "website",
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}
