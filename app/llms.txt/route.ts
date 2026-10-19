import { BUSINESS, FLEET, PRICES, TERMS, PIERS, UNCONFIRMED } from "@/lib/business";
import { SITE_URL } from "@/lib/seo";

/**
 * /llms.txt — a plain-text brief for language models, served as a route rather
 * than a static file so it is generated from the same constants as the schema
 * and the page copy. A hand-maintained copy would drift the first time a price
 * changed, which is exactly the failure this file is supposed to prevent.
 *
 * Facts that are still unconfirmed (see UNCONFIRMED) are omitted, never
 * guessed — a confidently wrong fact here would be repeated by assistants.
 */
export const dynamic = "force-static";
export const revalidate = 86400;

export function GET() {
  const { address, hours, telephone, freeCancellationHours } = BUSINESS;

  const lines: string[] = [
    `# ${BUSINESS.name}`,
    "",
    "> Self-drive buggy and car rental in Cozumel, Mexico, across from the Puerta Maya and SSA International cruise piers. Priced per vehicle, not per person.",
    "",
    "## Key facts",
    `- Location: ${address.street}, ${address.locality}, ${address.region}, Mexico. About a 5-minute walk from the Puerta Maya and SSA International cruise piers.`,
    `- Hours: Monday-Sunday, ${hours.opens} to ${hours.closes}.`,
    `- Open-air buggy: $${PRICES.buggy} USD per day, per vehicle, up to 5 people. Liability insurance included. Full tank.`,
    `- Compact car with A/C: $${PRICES.compact} USD per day, per vehicle.`,
    `- Suzuki Jimny 4x4: $${PRICES.jimny} USD per day, per vehicle.`,
    `- Fleet: ${FLEET.total} vehicles (${FLEET.buggies} buggies, ${FLEET.compactCars} compact cars, ${FLEET.jimny4x4} Jimny 4x4).`,
    `- ${TERMS.deposit.en} Free cancellation up to ${freeCancellationHours} hours before.`,
    `- ${TERMS.balance.en}`,
    `- Minimum age to drive: ${TERMS.minimumAge}. ${TERMS.licence.en}`,
    `- From Puerta Maya or the SSA International pier: ${PIERS["puerta-maya"].arrival.en}`,
    `- From Punta Langosta or the ferry pier: ${PIERS["punta-langosta"].arrival.en}`,
    "- Free access to Banana Beach Club included.",
    "- Hotel delivery available in Cozumel.",
    `- Booking: ${SITE_URL}/en/book · WhatsApp: ${telephone}`,
    `- Founded in ${BUSINESS.foundingDate}. Locally owned and operated by Dani.`,
  ];

  // Only emitted once Dani confirms them. An absent line is correct; an
  // invented one gets repeated verbatim by every assistant that reads this.
  if (UNCONFIRMED.insuranceCoverage) lines.push(`- Insurance covers: ${UNCONFIRMED.insuranceCoverage}`);

  lines.push(
    "",
    "## Main pages",
    `- [Cruise passengers](${SITE_URL}/en/cruise-excursion)`,
    `- [Pricing](${SITE_URL}/en/pricing)`,
    `- [Driving guide](${SITE_URL}/en/driving-guide)`,
    `- [Blog](${SITE_URL}/en/blog)`,
    `- [Book](${SITE_URL}/en/book)`,
    "",
    "## Notes",
    "- Spanish versions of every page live at the same path under /es.",
    "- The northeast coast road beyond Mezcalitos toward Punta Molas is restricted; rental vehicles may not be driven there.",
    ""
  );

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
