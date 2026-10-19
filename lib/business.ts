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
    /** Confirmed by Dani, 18 Oct 2026. */
    postalCode: "77600",
    country: "MX",
  },

  // TODO(dani): confirm these are the exact pin coordinates on the Google
  // Business Profile. These are the values the site has published so far.
  geo: { latitude: 20.477244, longitude: -86.973638 },

  hours: { opens: "08:00", closes: "17:00" },

  /**
   * The real Business Profile, confirmed by Dani 18 Oct 2026. A second link
   * (.../Sx4ZJZburo8YdWjE9) used to be published in the footer and is wrong —
   * if it turns up in printed material or another profile, replace it.
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
  /** TODO(dani): what exactly does the included liability insurance cover? */
  insuranceCoverage: null as string | null,
  /** TODO(dani): what the Back-to-Ship Promise guarantees if something fails. */
  backToShipRemedy: null as string | null,
  /** TODO(dani): does Dani want a surname published in the Person schema? */
  founderSurname: null as string | null,
  /** TODO(dani): how long Dani has lived in Cozumel, for the About page. */
  yearsInCozumel: null as number | null,
} as const;

/**
 * Rental terms, all confirmed by Dani on 18 Oct 2026.
 *
 * These are published facts: they appear in llms.txt, the facts page and the
 * booking copy, so changing one here changes the promise the business makes.
 */
export const TERMS = {
  minimumAge: 18,
  /** A valid licence from the guest's own country. No IDP required. */
  licence: {
    en: "Any valid driver's licence from your own country. No international permit needed.",
    es: "Cualquier licencia de conducir vigente de tu país. No se necesita permiso internacional.",
  },
  /** The deposit is optional: guests can also reserve and settle everything at pickup. */
  deposit: {
    en: "Reserve with a $25 card deposit, or book with nothing upfront and pay in full at pickup.",
    es: "Aparta con $25 de depósito con tarjeta, o reserva sin pagar nada y liquida todo al recoger.",
  },
  balance: {
    en: "The balance is paid at pickup, in cash or by card.",
    es: "El saldo se paga al recoger, en efectivo o con tarjeta.",
  },
} as const;

/**
 * How guests reach their vehicle, which depends on where their ship docks.
 *
 * This is why the old "Port pickup included" line was wrong site-wide: it is
 * true for Punta Langosta and misleading for Puerta Maya and SSA, whose guests
 * simply walk. Each pier page states its own arrival method.
 */
export const PIERS = {
  "puerta-maya": {
    name: "Puerta Maya",
    arrival: {
      en: "About a 5-minute walk from the pier exit to our office at the Pemex station.",
      es: "Unos 5 minutos caminando desde la salida del muelle hasta nuestra oficina en la Pemex.",
    },
  },
  "international-pier": {
    name: "SSA International Pier",
    arrival: {
      en: "About a 5-minute walk from the pier exit to our office at the Pemex station.",
      es: "Unos 5 minutos caminando desde la salida del muelle hasta nuestra oficina en la Pemex.",
    },
  },
  "punta-langosta": {
    name: "Punta Langosta",
    arrival: {
      en: "We meet you at the port exit — Punta Langosta is downtown, further from the office.",
      es: "Te esperamos a la salida del puerto — Punta Langosta está en el centro, lejos de la oficina.",
    },
  },
  "ferry-pier": {
    name: "Cozumel Ferry Pier",
    arrival: {
      en: "We meet you at the port exit if you arrive on the ferry from Playa del Carmen.",
      es: "Te esperamos a la salida del puerto si llegas en el ferry desde Playa del Carmen.",
    },
  },
} as const;
