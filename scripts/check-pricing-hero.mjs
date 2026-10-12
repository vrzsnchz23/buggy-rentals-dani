/**
 * The pricing page's hero, measured with the same horizontal-wash maths as the
 * homepage hero.
 *
 * This is a wrapper rather than `PHOTO=... node check-hero-contrast.mjs`
 * because an inline env assignment is not portable to Windows, where this
 * project is developed.
 *
 *   node scripts/check-pricing-hero.mjs
 */

/** Measured in the browser at a 1440px viewport: the furthest-right inked
 *  text in this hero is the first line of the h1, ending at x=598. */
process.env.PHOTO = "public/images/pricing-hero.jpg";
process.env.BOX_SCALE = "1.0"; // the image box is the section width
process.env.TEXT_RIGHT = "620";
process.env.BASE_ALPHA = "0.15";
process.env.STOPS = JSON.stringify([
  [0, 0.95],
  [0.3, 0.88],
  [0.46, 0.6],
  [0.62, 0.2],
  [0.76, 0],
]);
/** The mobile pass in that script is tied to the homepage hero's crop; the
 *  pricing hero's phone layout is covered by check-overlay-contrast.mjs. */
process.env.SKIP_MOBILE = "1";

await import("./check-hero-contrast.mjs");
