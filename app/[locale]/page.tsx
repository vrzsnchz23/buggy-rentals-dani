import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { StickyBookBar } from "@/components/StickyBookBar";
import { Hero } from "@/components/sections/Hero";
import { CruiseBanner } from "@/components/sections/CruiseBanner";
import { WhyUs } from "@/components/sections/WhyUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Fleet } from "@/components/sections/Fleet";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import { getTranslations } from "next-intl/server";
import { getReviews } from "@/lib/reviews";
import { pageMetadata, SITE_URL } from "@/lib/seo";
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
  const { rating, total, reviews } = await getReviews();

  const isEs = locale === "es";

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "VehicleRentalBusiness", "TouristAttraction"],
    "@id": `${SITE_URL}/#business`,
    name: "Buggy Rentals with Dani",
    alternateName: "Buggy with Dani",
    description: isEs
      ? "Renta de buggies en Cozumel para pasajeros de crucero y huéspedes de hoteles. $75/día por el buggy completo — menos de $20 por persona. Ubicados justo frente a las terminales de cruceros Puerta Maya y SSA Internacional."
      : "Buggy rental in Cozumel for cruise ship passengers and resort guests. $75/day for the whole buggy — less than $20 per person. Located directly across from Puerta Maya and SSA Internacional cruise terminals.",
    url: `${SITE_URL}/${locale}`,
    telephone: "+52-987-274-3477",
    email: "dani@buggycozumel.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Carr. Costera Sur Km 4.3, Int. Pemex",
      addressLocality: "Cozumel",
      addressRegion: "Q.R.",
      postalCode: "77600",
      addressCountry: "MX",
    },
    geo: { "@type": "GeoCoordinates", latitude: 20.477244, longitude: -86.973638 },
    hasMap: "https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8",
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        opens: "08:00",
        closes: "17:00",
      },
    ],
    priceRange: "$65–$75 USD/day",
    currenciesAccepted: "USD, MXN",
    paymentAccepted: "Cash, Credit Card",
    image: [
      `${SITE_URL}/opengraph-image`,
      `${SITE_URL}/images/buggy10.png`,
      `${SITE_URL}/images/buggy1.jpg`,
    ],
    logo: `${SITE_URL}/logo.png`,
    sameAs: ["https://instagram.com/buggywithdani", "https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8"],
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: isEs ? "Seguro incluido" : "Insurance Included", value: true },
      { "@type": "LocationFeatureSpecification", name: isEs ? "Recogida en el puerto" : "Cruise Port Pickup", value: true },
      { "@type": "LocationFeatureSpecification", name: isEs ? "Entrega a hoteles" : "Hotel Delivery", value: true },
      { "@type": "LocationFeatureSpecification", name: isEs ? "Soporte por WhatsApp" : "WhatsApp Support", value: true },
    ],
    // Driven by the same data the Reviews section renders, so the markup can
    // never drift from what visitors actually see on the page.
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      reviewCount: String(total ?? reviews.length),
      bestRating: "5",
      worstRating: "1",
    },
  };

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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main id="main">
        <Hero />
        <CruiseBanner />
        <WhyUs />
        <Fleet />
        <HowItWorks />
        <Reviews />
        <Location />
        <FAQ />
      </main>
      <Footer />
      <WhatsAppButton />
      <StickyBookBar />
    </>
  );
}
