/**
 * Single source of truth for the business facts that have to agree everywhere:
 * schema.org markup, llms.txt, the footer, the contact blocks and the page copy.
 *
 * Before this existed the same fact was typed by hand in several places and
 * drifted — the fleet was "16 vehicles" in one section and "10 buggies" in
 * another, and booking took "under 3 minutes" in English but "dos minutos" in
 * Spanish. Anything a visitor or a crawler can read as a number or a claim
 * belongs here, not inline in a component.
 *
 * UNCONFIRMED VALUES ARE `null`, NEVER GUESSED.
 * A `null` here must make the consuming code omit the fact entirely rather than
 * print a placeholder. Dani confirms it, someone fills it in, and it appears in
 * every surface at once. Search for TODO(dani) to see what is still open.
 */

import { VEHICLES } from "@/lib/utils";

export const BUSINESS = {
  /** Exact legal/display name. Must match Google Business Profile character for character. */
  name: "Buggy Rentals with Dani",
  alternateName: ["Buggy with Dani", "@buggywithdani"],
  foundingDate: "2023",

  telephone: "+52 987 274 3477",
  /** E.164, for tel: links and schema. */
  telephoneE164: "+529872743477",
  email: "dani@buggycozumel.com",

  address: {
    street: "Carretera Costera Sur Km 4.3 (inside Pemex station)",
    locality: "Cozumel",
    region: "Quintana Roo",
    // TODO(dani): confirm postal code. 77600 is what the site has published so
    // far; the SEO brief suggests it may be 77675. Left as published until
    // confirmed rather than swapped for an unverified value.
    postalCode: "77600",
    country: "MX",
  },

  // TODO(dani): confirm these are the exact pin coordinates on the Google
  // Business Profile. These are the values the site has published so far.
  geo: { latitude: 20.477244, longitude: -86.973638 },

  hours: { opens: "08:00", closes: "17:00" },

  /**
   * TODO(dani): two different Google Maps short links exist across the site
   * and printed material (.../QYZiN1rf1vXbhR8g8 and .../Sx4ZJZburo8YdWjE9).
   * This is the one already published in the schema. Confirm which one is the
   * real Business Profile and delete the other everywhere.
   */
  googleMapsUrl: "https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8",

  /** Google review shortcut, used by the /review redirect and the counter QR. */
  googleReviewUrl: "https://g.page/r/CfS3VjCYpjOMEBM/review",

  currenciesAccepted: "USD, MXN",
  paymentAccepted: "Cash, Credit Card",

  depositUsd: 25,
  freeCancellationHours: 48,
} as const;

/**
 * Profiles that are the *same* business. This is what tells Google and the
 * assistants that the Instagram account, the Maps listing and this site are one
 * entity. Only confirmed, live URLs belong here — a 404 in `sameAs` is worse
 * than an absent one.
 *
 * TODO(dani): add TripAdvisor, Facebook, TikTok, Bing Places, Apple Maps and
 * Yelp here as each profile goes live (see brief section 7).
 */
export const SAME_AS: string[] = [
  "https://instagram.com/buggywithdani",
  BUSINESS.googleMapsUrl,
];

/**
 * Fleet breakdown, derived from the booking config so the marketing number can
 * never disagree with what is actually rentable. `stock` is the real count.
 */
export const FLEET = {
  buggies: VEHICLES.buggy.stock,
  compactCars: VEHICLES.compact.stock,
  jimny4x4: VEHICLES.jimny.stock,
  get total() {
    return this.buggies + this.compactCars + this.jimny4x4;
  },
} as const;

/** Per-vehicle daily rates, in USD. Mirrors the booking engine. */
export const PRICES = {
  buggy: VEHICLES.buggy.price,
  compact: VEHICLES.compact.price,
  jimny: VEHICLES.jimny.price,
} as const;

export const PRICE_RANGE_USD = `$${Math.min(...Object.values(PRICES))}–$${Math.max(
  ...Object.values(PRICES)
)} USD per vehicle/day`;

/**
 * Facts that are still unverified. Every one of these is `null` on purpose:
 * consuming code must check and omit, so an unconfirmed claim can never reach
 * a visitor or a crawler. Fill in, and the fact appears site-wide.
 */
export const UNCONFIRMED = {
  /** TODO(dani): how is the $25 deposit actually paid? Card, PayPal, link? */
  depositMethod: null as string | null,
  /** TODO(dani): how is the remaining balance paid at pickup? Cash, card, both? */
  balanceMethod: null as string | null,
  /** TODO(dani): do you meet guests at the pier exit, or do they walk to the office? */
  portArrival: null as string | null,
  /** TODO(dani): minimum age to drive. */
  minimumAge: null as number | null,
  /** TODO(dani): is a home-country licence enough, or is an IDP required? */
  licenceRequirement: null as string | null,
  /** TODO(dani): what exactly does the included liability insurance cover? */
  insuranceCoverage: null as string | null,
  /** TODO(dani): Suzuki Jimny seating. Site copy says "up to 5"; a Jimny is normally 4. */
  jimnySeats: null as number | null,
  /** TODO(dani): what the Back-to-Ship Promise guarantees if something fails. */
  backToShipRemedy: null as string | null,
} as const;
