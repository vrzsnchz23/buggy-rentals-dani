import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import { Outfit, Inter } from "next/font/google";
import "@/app/globals.css";
import { isLocale, alternatesFor, SITE_URL } from "@/lib/seo";
import { Analytics } from "@/components/Analytics";
import { ScrollReveal } from "@/components/ScrollReveal";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
  weight: ["500", "600", "700", "800", "900"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
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
    keywords:
      locale === "es"
        ? ["renta de buggies cozumel", "buggy cozumel", "rentar buggy cozumel", "excursion crucero cozumel", "buggy puerta maya", "renta de autos cozumel", "buggy with dani"]
        : ["buggy rental cozumel", "cozumel buggy rental", "rent a buggy cozumel", "cozumel cruise excursion", "buggy cozumel cruise port", "puerta maya buggy rental", "cozumel dune buggy", "buggy with dani"],
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
      </body>
    </html>
  );
}
