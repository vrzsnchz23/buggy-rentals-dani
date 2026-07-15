import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { SessionProvider } from "next-auth/react";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: {
    default: "Buggy Rental Cozumel | $75/day · Up to 5 People | Buggy with Dani",
    template: "%s | Buggy Rentals with Dani – Cozumel",
  },
  description: "Rent a buggy in Cozumel for $75/day — less than $20/person. Across from Puerta Maya & SSA cruise terminals. Insurance included. Book in 3 minutes.",
  keywords: ["buggy rental cozumel","cozumel buggy rental","rent a buggy cozumel","cozumel cruise excursion","buggy cozumel cruise port","puerta maya buggy rental","cozumel dune buggy","buggy with dani"],
  metadataBase: new URL("https://buggycozumel.com"),
  alternates: {
    canonical: undefined,
    languages: { "en": "/en", "es": "/es" },
  },
  openGraph: {
    title: "Buggy Rental Cozumel | $75/day · Up to 5 People | Buggy with Dani",
    description: "Rent a buggy in Cozumel for just $75/day — less than $20 per person. Directly across from Puerta Maya cruise terminal. Insurance included.",
    url: "https://buggycozumel.com",
    siteName: "Buggy Rentals with Dani",
    locale: "en_US",
    type: "website",
    images: [{ url: "/images/buggy8.png", width: 1200, height: 630, alt: "Buggy Rental in Cozumel – Buggy Rentals with Dani" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buggy Rental Cozumel | $75/day – Buggy with Dani",
    description: "Less than $20/person. Right across from Puerta Maya cruise terminal. Book in 3 minutes.",
    images: ["/images/buggy8.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const locales = ["en", "es"];

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale)) notFound();

  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
