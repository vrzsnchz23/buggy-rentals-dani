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
  "https://www.instagram.com/buggywithdani/",
  "https://www.facebook.com/profile.php?id=61590110266126",
  "https://www.tripadvisor.com/Attraction_Review-g150809-d34428679-Reviews-Buggy_Rentals_With_Dani-Cozumel_Yucatan_Peninsula.html",
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
  /**
   * TODO(dani): Dani agreed to publish a surname but has not given it yet.
   * Until it is here the Person schema and the About byline use "Dani" alone,
   * which is correct but weaker as an entity signal.
   */
  founderSurname: null as string | null,
  /** TODO(dani): what the optional collision coverage costs per day. */
  collisionCoveragePrice: null as number | null,
  /** TODO(dani): still deciding what returning guests get. Omitted until defined. */
  returningGuestPerk: null as string | null,
} as const;

/**
 * What the rental actually covers. Confirmed by Dani, 18 Oct 2026.
 *
 * The distinction matters commercially and legally: liability is included and
 * covers other people, while damage to the rental vehicle itself is only
 * covered if the guest takes the optional collision product. Saying just
 * "insurance included" invites exactly the dispute this wording avoids.
 */
export const INSURANCE = {
  included: {
    en: "Liability insurance is included: damage and injury to other people and their property is fully covered.",
    es: "El seguro de responsabilidad civil va incluido: los daños y lesiones a terceros y a su propiedad están cubiertos al 100%.",
  },
  /** Optional add-on. Does not cover the full value — 90% by design. */
  collisionOptional: {
    en: "Optional collision coverage is available for the vehicle itself, covering 90% of its value.",
    es: "Hay cobertura opcional de colisión para el vehículo, que cubre el 90% de su valor.",
  },
} as const;

/**
 * The Back-to-Ship Promise. Every clause here is something Dani confirmed the
 * business actually does — no invented compensation.
 *
 * Deliberately does NOT claim a ship will wait. We can tell the pier a guest
 * is on the way; whether the ship holds is the cruise line's call, and
 * promising otherwise would be the one failure that ruins someone's holiday.
 */
export const BACK_TO_SHIP = {
  maxMinutesAway: 20,
  points: {
    en: [
      "Wherever you are on the island, you are about 20 minutes from us.",
      "If the vehicle fails, we drive out to you with a replacement so you can carry on with your day.",
      "We work with the piers every day, so we can call ahead and let them know you are running late and on your way.",
      "We ask for your all-aboard time when you book, and we recommend heading back at least an hour before it.",
    ],
    es: [
      "Estés donde estés en la isla, estás a unos 20 minutos de nosotros.",
      "Si el vehículo falla, vamos por ti con otro vehículo para que sigas tu camino.",
      "Trabajamos con los muelles todos los días, así que podemos avisarles que vienes en camino con retraso.",
      "Te pedimos tu hora de all-aboard al reservar y te recomendamos regresar al menos una hora antes.",
    ],
  },
} as const;

/**
 * Dani's own story, for the About page and the Person schema. Being a
 * third-generation local is the strongest trust signal the business has
 * against street sellers and out-of-town operators.
 */
export const FOUNDER = {
  firstName: "Dani",
  bornInCozumel: true,
  /** Dani, his mother and his grandmother were all born on the island. */
  generationsOnIsland: 3,
} as const;

/**
 * Competing options, for the "how much does it cost" comparison table.
 * Only rows Dani could actually source are here — an invented range would
 * undermine the one page whose whole job is to be the trustworthy reference.
 *
 * Checked October 2026. Re-verify every 3-6 months.
 */
export const MARKET_PRICES = {
  checkedOn: "2026-10",
  scooter: {
    usd: 45,
    pricedBy: "vehicle",
    capacity: 2,
    note: { en: "Per scooter, fits 2 people.", es: "Por scooter, para 2 personas." },
  },
  taxiToBeach: {
    usdMin: 10,
    usdMax: 20,
    pricedBy: "person",
    note: {
      en: "Per person, one way, and many taxis do not post fixed prices.",
      es: "Por persona, solo de ida, y muchos taxis no tienen precios fijos.",
    },
  },
} as const;

/**
 * Official source for the cruise calendar page (brief 4.1): the Quintana Roo
 * port authority's published schedule. Captured by hand each month into a
 * JSON file rather than scraped, so we are reading a public official listing
 * rather than republishing a third party's compiled data.
 */
export const CRUISE_SCHEDULE_SOURCE = "https://servicios.apiqroo.com.mx/programacion/";

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
