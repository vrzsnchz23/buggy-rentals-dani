import { BUSINESS, SAME_AS, PRICES, PRICE_RANGE_USD } from "@/lib/business";
import { SITE_URL } from "@/lib/seo";
import { VEHICLES } from "@/lib/utils";

/** Stable node ids, so every page can point at the same entities. */
export const BUSINESS_ID = `${SITE_URL}/#business`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

function offers(isEs: boolean) {
  return (Object.keys(VEHICLES) as Array<keyof typeof VEHICLES>).map((key) => {
    const v = VEHICLES[key];
    return {
      "@type": "Offer",
      name: isEs ? v.labelEs : v.label,
      description: isEs ? v.descriptionEs : v.description,
      price: String(PRICES[key as keyof typeof PRICES] ?? v.price),
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      /** Rentals are priced per vehicle per day, which is the whole pitch. */
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: String(v.price),
        priceCurrency: "USD",
        unitText: isEs ? "por vehículo, por día" : "per vehicle, per day",
      },
    };
  });
}

/**
 * The site-wide entity graph: who the business is, and what site this is.
 *
 * Rendered once in the locale layout so every page carries it and every page's
 * page-specific markup (FAQPage, BlogPosting, BreadcrumbList) can reference
 * `BUSINESS_ID` instead of repeating the business block.
 *
 * Deliberately omits `aggregateRating`/`review`. The ratings we have live on
 * Google, and marking up reviews collected on another platform as our own is
 * against Google's review-snippet guidelines; for a local business it earns no
 * stars in search anyway, so it is pure risk.
 */
export function businessGraph(locale: string) {
  const isEs = locale === "es";

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": ["AutoRental", "LocalBusiness"],
        "@id": BUSINESS_ID,
        name: BUSINESS.name,
        alternateName: [...BUSINESS.alternateName],
        description: isEs
          ? "Renta de buggies y autos en Cozumel, frente a las terminales de cruceros Puerta Maya y SSA Internacional. Precio por vehículo, no por persona."
          : "Self-drive buggy and car rental in Cozumel, across from the Puerta Maya and SSA International cruise piers. Priced per vehicle, not per person.",
        url: `${SITE_URL}/${locale}`,
        telephone: BUSINESS.telephone,
        email: BUSINESS.email,
        foundingDate: BUSINESS.foundingDate,
        address: {
          "@type": "PostalAddress",
          streetAddress: BUSINESS.address.street,
          addressLocality: BUSINESS.address.locality,
          addressRegion: BUSINESS.address.region,
          postalCode: BUSINESS.address.postalCode,
          addressCountry: BUSINESS.address.country,
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: BUSINESS.geo.latitude,
          longitude: BUSINESS.geo.longitude,
        },
        hasMap: BUSINESS.googleMapsUrl,
        areaServed: {
          "@type": "Place",
          name: "Cozumel, Quintana Roo, Mexico",
        },
        openingHoursSpecification: [
          {
            "@type": "OpeningHoursSpecification",
            dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            opens: BUSINESS.hours.opens,
            closes: BUSINESS.hours.closes,
          },
        ],
        priceRange: PRICE_RANGE_USD,
        currenciesAccepted: BUSINESS.currenciesAccepted,
        paymentAccepted: BUSINESS.paymentAccepted,
        image: [
          `${SITE_URL}/opengraph-image`,
          `${SITE_URL}/images/buggy10.png`,
          `${SITE_URL}/images/buggy1.jpg`,
        ],
        logo: `${SITE_URL}/logo.png`,
        sameAs: SAME_AS,
        makesOffer: offers(isEs),
        amenityFeature: [
          { "@type": "LocationFeatureSpecification", name: isEs ? "Seguro de responsabilidad incluido" : "Liability insurance included", value: true },
          { "@type": "LocationFeatureSpecification", name: isEs ? "Tanque lleno" : "Full tank of gas", value: true },
          { "@type": "LocationFeatureSpecification", name: isEs ? "Acceso gratuito a Banana Beach Club" : "Free Banana Beach Club access", value: true },
          { "@type": "LocationFeatureSpecification", name: isEs ? "Entrega a hoteles" : "Hotel delivery", value: true },
          { "@type": "LocationFeatureSpecification", name: isEs ? "Soporte por WhatsApp" : "WhatsApp support", value: true },
        ],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        url: SITE_URL,
        name: BUSINESS.name,
        publisher: { "@id": BUSINESS_ID },
        inLanguage: ["en", "es"],
      },
    ],
  };
}

/** Breadcrumbs for an internal page. `trail` is ordered, excluding Home. */
export function breadcrumbGraph(
  locale: string,
  trail: Array<{ name: string; path: string }>
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: locale === "es" ? "Inicio" : "Home",
        item: `${SITE_URL}/${locale}`,
      },
      ...trail.map((crumb, i) => ({
        "@type": "ListItem",
        position: i + 2,
        name: crumb.name,
        item: `${SITE_URL}/${locale}${crumb.path}`,
      })),
    ],
  };
}

/** Convenience for `dangerouslySetInnerHTML`. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data) };
}
