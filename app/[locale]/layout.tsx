import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Buggy Rentals with Dani | Cozumel, Mexico",
  description:
    "Rent open-air buggies in Cozumel from $75/day — up to 5 people, insurance included. Walking distance from Puerta Maya & SSA cruise ports. Book online in 2 minutes.",
  openGraph: {
    title: "Buggy Rentals with Dani",
    description: "Rent open-air buggies in Cozumel from $75/day — up to 5 people, insurance included. Walking distance from Puerta Maya & SSA cruise ports.",
    locale: "en_US",
    type: "website",
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
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
