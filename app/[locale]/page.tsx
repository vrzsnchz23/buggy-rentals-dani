import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { Hero } from "@/components/sections/Hero";
import { CruiseBanner } from "@/components/sections/CruiseBanner";
import { WhyUs } from "@/components/sections/WhyUs";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Fleet } from "@/components/sections/Fleet";
import { Reviews } from "@/components/sections/Reviews";
import { Location } from "@/components/sections/Location";
import { FAQ } from "@/components/sections/FAQ";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Buggy Rental Cozumel | $75/day · Up to 5 People | Buggy with Dani",
  description: "Rent a buggy in Cozumel for $75/day — less than $20/person. Across from Puerta Maya & SSA cruise terminals. Insurance included. Book in 3 minutes.",
  alternates: {
    canonical: "https://buggycozumel.com/en",
    languages: { "en": "https://buggycozumel.com/en", "es": "https://buggycozumel.com/es" },
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": ["LocalBusiness", "VehicleRentalBusiness", "TouristAttraction"],
  "name": "Buggy Rentals with Dani",
  "alternateName": "Buggy with Dani",
  "description": "Buggy rental in Cozumel for cruise ship passengers and resort guests. $75/day for the whole buggy — less than $20 per person. Located directly across from Puerta Maya and SSA Internacional cruise terminals.",
  "url": "https://buggycozumel.com",
  "telephone": "+52-987-274-3477",
  "email": "dani@buggycozumel.com",
  "address": { "@type": "PostalAddress", "streetAddress": "Carr. Costera Sur Km 4.3, Int. Pemex", "addressLocality": "Cozumel", "addressRegion": "Q.R.", "postalCode": "77600", "addressCountry": "MX" },
  "geo": { "@type": "GeoCoordinates", "latitude": 20.477244, "longitude": -86.973638 },
  "hasMap": "https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8",
  "openingHoursSpecification": [{ "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"], "opens": "08:00", "closes": "17:00" }],
  "priceRange": "$75 USD/day",
  "currenciesAccepted": "USD, MXN",
  "paymentAccepted": "Cash, Credit Card",
  "image": ["https://buggycozumel.com/images/buggy8.png","https://buggycozumel.com/images/buggy1.jpg","https://buggycozumel.com/images/buggy2.jpg"],
  "logo": "https://buggycozumel.com/logo.png",
  "sameAs": ["https://instagram.com/buggywithdani","https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8"],
  "amenityFeature": [
    { "@type": "LocationFeatureSpecification", "name": "Insurance Included", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Cruise Port Pickup", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "Hotel Delivery", "value": true },
    { "@type": "LocationFeatureSpecification", "name": "WhatsApp Support", "value": true }
  ],
  "aggregateRating": { "@type": "AggregateRating", "ratingValue": "5.0", "reviewCount": "4", "bestRating": "5", "worstRating": "1" }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need a driver's license?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, the driver must have a valid driver's license. We'll collect the license number at booking." }
    },
    {
      "@type": "Question",
      "name": "Can I book for my cruise stop?",
      "acceptedAnswer": { "@type": "Answer", "text": "Absolutely! We're located right across from the main cruise ports. Just enter your arrival date and cruise ship info and we'll coordinate with your schedule." }
    },
    {
      "@type": "Question",
      "name": "What if it rains?",
      "acceptedAnswer": { "@type": "Answer", "text": "Cozumel weather is usually sunny! In the rare case of severe weather, we'll work with you to reschedule." }
    },
    {
      "@type": "Question",
      "name": "How many people fit in a buggy?",
      "acceptedAnswer": { "@type": "Answer", "text": "Up to 5 people per buggy. If your group is larger, we'll assign multiple buggies at the same rate." }
    },
    {
      "@type": "Question",
      "name": "Is insurance included?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes! Liability insurance is included in the $75/day price. This covers third-party damages." }
    },
    {
      "@type": "Question",
      "name": "Can you deliver to my hotel?",
      "acceptedAnswer": { "@type": "Answer", "text": "Yes, we offer delivery to select resorts on the island. Just enter your hotel at checkout and we'll confirm availability." }
    }
  ]
};

export default function HomePage() {
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
      <main>
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
    </>
  );
}
