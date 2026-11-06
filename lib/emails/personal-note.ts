/**
 * Dani's personal welcome note.
 *
 * Deliberately NOT built on the confirmation email's template. That one has a
 * navy header bar, a logo, a rounded card and a footer — the visual language
 * of a system message. The whole point of this note is that it reads as
 * something Dani typed, so it is plain left-aligned text on white with no
 * branding furniture, the way a message from a person actually looks in an
 * inbox.
 *
 * Sent by hand from the admin panel rather than queued after the confirmation,
 * for the same reason: two emails landing seconds apart read as one automation.
 */

/** The office pin Dani uses for this note. */
const MAPS_URL = "https://maps.app.goo.gl/1QbDsUUStUe1U65G8";
const WHATSAPP_DISPLAY = "(+52) 987-274-3477";

export const PERSONAL_NOTE_SUBJECT =
  "Quick note from Dani — can't wait to host you in Cozumel!";

const PARAGRAPHS_INTRO = [
  "Hi! This is Dani. I just wanted to personally thank you for booking with us!",
  "I know you already received your confirmation email with all the details of your reservation, but I wanted to send you a quick note myself in case you have any questions before your trip.",
  "Our main office is conveniently located between the SSA International and Puerta Maya Cruise Terminals. However, if you're arriving at Punta Langosta, we also have a separate meeting point right at the cruise plaza, so there's no need to travel to our main office.",
];

const PIERS = [
  {
    heading: "📍 If you are arriving at the SSA International Cruise Terminal:",
    body: "After exiting the terminal, walk one block south and cross the street. You'll find a PEMEX gas station. Our office is located inside the station. We're the only vehicle rental office there.",
  },
  {
    heading: "📍 If you are arriving at the Puerta Maya Cruise Terminal:",
    body: "Walk approximately half a block north and cross the street to the same PEMEX gas station. Our office is located inside.",
  },
  {
    heading: "📍 If you are arriving at Punta Langosta Cruise Terminal:",
    body: "Once you get off the ship and enter Punta Langosta Plaza, look for the lighthouse next to Starbucks. Our team will be waiting for you right there, on the sidewalk next to the lighthouse.",
  },
];

const PARAGRAPHS_OUTRO = [
  "The meeting point is very easy to find, and you can simply walk there from your ship. No taxi or transportation to another port is needed!",
];

const PARAGRAPHS_CLOSING = [
  "Once you arrive, our team will take care of everything and get you ready to start your day in Cozumel.",
  `If you have any questions about the pickup, your route around the island, the best beaches, restaurants, or anything else about your day in Cozumel, just reply to this email or send me a WhatsApp/Text anytime at ${WHATSAPP_DISPLAY}.`,
  "We're a small, family-run business, so when you book with us, you're never just another reservation number. We genuinely care about making sure your day on the island is one of the highlights of your vacation.",
  "Looking forward to meeting you soon!",
];

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function personalNoteHtml() {
  const p = (text: string) =>
    `<p style="margin:0 0 16px">${escapeHtml(text)}</p>`;

  const pierBlocks = PIERS.map(
    (pier) =>
      `<p style="margin:0 0 8px"><strong>${escapeHtml(pier.heading)}</strong></p>` +
      `<p style="margin:0 0 20px">${escapeHtml(pier.body)}</p>`
  ).join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#ffffff">
<div style="max-width:600px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:#222222">
${PARAGRAPHS_INTRO.map(p).join("")}
${pierBlocks}
${PARAGRAPHS_OUTRO.map(p).join("")}
<p style="margin:0 0 20px">
  <strong>Google Maps &ndash; Main Office (SSA International / Puerta Maya):</strong><br>
  <a href="${MAPS_URL}" style="color:#1B4F72">${MAPS_URL}</a>
</p>
${PARAGRAPHS_CLOSING.map(p).join("")}
<p style="margin:0">Dani<br>Buggy Rentals with Dani 🚙🌴</p>
</div>
</body>
</html>`;
}

/**
 * Plain-text alternative. Worth sending: a message with no text part is more
 * likely to be filed as bulk mail, and this one has to land in the inbox.
 */
export function personalNoteText() {
  return [
    ...PARAGRAPHS_INTRO,
    ...PIERS.flatMap((pier) => [pier.heading, pier.body]),
    ...PARAGRAPHS_OUTRO,
    "Google Maps - Main Office (SSA International / Puerta Maya):",
    MAPS_URL,
    ...PARAGRAPHS_CLOSING,
    "Dani\nBuggy Rentals with Dani",
  ].join("\n\n");
}
