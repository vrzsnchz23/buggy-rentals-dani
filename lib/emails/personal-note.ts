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

/**
 * The meeting point for guests arriving at the SSA International terminal.
 *
 * Terminal-specific on purpose, and separate from BUSINESS.googleMapsUrl:
 * SSA guests are met at a stand by the Royal Village shopping centre, which
 * is a different place from the main office inside the PEMEX station.
 */
const SSA_STAND_MAPS_URL = "https://maps.app.goo.gl/4GuJT5CGwWSgXJef9";
const WHATSAPP_DISPLAY = "(+52) 987-274-3477";

export const PERSONAL_NOTE_SUBJECT =
  "Quick note from Dani — can't wait to host you in Cozumel!";

const PARAGRAPHS_INTRO = [
  "Hi! This is Dani. I just wanted to personally thank you for booking with us!",
  "I know you already received your confirmation email with all the details of your reservation, but I wanted to send you a quick note myself in case you have any questions before your trip.",
  "We've updated our meeting points to make pickup as easy and convenient as possible. Your meeting point will depend on which cruise terminal your ship arrives at:",
];

/**
 * Ordered the way Dani wrote them: Puerta Maya first, then SSA, then Punta
 * Langosta. `link` is only set where the directions alone are not enough.
 */
const PIERS: Array<{ heading: string; body: string[]; link?: string }> = [
  {
    heading: "📍 If you are arriving at the Puerta Maya Cruise Terminal:",
    body: [
      "Our main office is conveniently located just across the street from the cruise port.",
      "Walk approximately half a block north and cross the street to the PEMEX gas station. Our office is located inside the station. We're the only vehicle rental office there.",
    ],
  },
  {
    heading: "📍 If you are arriving at the SSA International Cruise Terminal:",
    body: [
      "Your meeting point will be our small stand just across the street from the port.",
      "Once you walk out toward the main avenue, you'll see the Royal Village Shopping Center across the street. Look for our stand right next to Diamonds International.",
      "Here's the Google Maps location:",
    ],
    link: SSA_STAND_MAPS_URL,
  },
  {
    heading: "📍 If you are arriving at Punta Langosta Cruise Terminal:",
    body: [
      "Once you get off the ship and enter Punta Langosta Plaza, look for the lighthouse next to Starbucks. Our team will be waiting for you right there, on the sidewalk next to the lighthouse.",
    ],
  },
];

const PARAGRAPHS_CLOSING = [
  "The meeting point is very easy to find, and you can simply walk there from your ship. No taxi or transportation to another port is needed!",
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
  const p = (text: string) => `<p style="margin:0 0 16px">${escapeHtml(text)}</p>`;

  const pierBlocks = PIERS.map((pier) => {
    const body = pier.body
      .map((line, i) =>
        // The last line before a link introduces it, so it sits tight above.
        `<p style="margin:0 0 ${pier.link && i === pier.body.length - 1 ? 8 : 16}px">${escapeHtml(line)}</p>`
      )
      .join("");
    const link = pier.link
      ? `<p style="margin:0 0 24px"><a href="${pier.link}" style="color:#1B4F72">${pier.link}</a></p>`
      : "";
    return (
      `<p style="margin:0 0 8px"><strong>${escapeHtml(pier.heading)}</strong></p>` +
      body +
      link
    );
  }).join("");

  return `<!DOCTYPE html>
<html>
<body style="margin:0;padding:24px;background:#ffffff">
<div style="max-width:600px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;font-size:15px;line-height:1.6;color:#222222">
${PARAGRAPHS_INTRO.map(p).join("")}
${pierBlocks}
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
    ...PIERS.flatMap((pier) => [
      pier.heading,
      ...pier.body,
      ...(pier.link ? [pier.link] : []),
    ]),
    ...PARAGRAPHS_CLOSING,
    "Dani\nBuggy Rentals with Dani",
  ].join("\n\n");
}
