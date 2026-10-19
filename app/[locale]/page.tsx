import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StickyBookBar } from "@/components/StickyBookBar";
import { Hero } from "@/components/sections/Hero";
import { CruiseBanner } from "@/components/sections/CruiseBanner";
import { WhyUs } from "@/components/sections/WhyUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Fleet } from "@/components/sections/Fleet";
import { Gallery } from "@/components/sections/Gallery";
import { IslandMap } from "@/components/sections/IslandMap";
import { Stats } from "@/components/sections/Stats";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { SunsetCTA } from "@/components/sections/SunsetCTA";
import { getTranslations } from "next-intl/server";
import { getReviews } from "@/lib/reviews";
import { pageMetadata } from "@/lib/seo";
import { jsonLd } from "@/lib/schema";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });
  return pageMetadata({
    locale,
    path: "",
    title: t("homeTitle"),
    description: t("homeDescription"),
  });
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "faq" });
  // Only the rating is needed here now: the business entity (which used to
  // carry an aggregateRating built from these) moved to the locale layout.
  const { rating } = await getReviews();

  const faqItems = t.raw("items") as Array<{ q: string; a: string }>;
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={jsonLd(faqSchema)}
      />
      <Navbar />
      <main id="main">
        <Hero />
        <CruiseBanner />
        <WhyUs />
        <Fleet />
        <Gallery />
        <Stats rating={rating} />
        <IslandMap />
        <HowItWorks />
        <Reviews />
        <Location />
        <FAQ />
        <SunsetCTA />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyBookBar />
    </>
  );
}
