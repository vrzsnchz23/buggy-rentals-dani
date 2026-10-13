/**
 * The driving guide's hero, measured with the same horizontal-wash maths as
 * the homepage and pricing heroes.
 *
 * A wrapper rather than `PHOTO=... node check-hero-contrast.mjs` because an
 * inline env assignment is not portable to Windows, where this project is
 * developed.
 *
 *   node scripts/check-guide-hero.mjs
 */

process.env.PHOTO = "public/images/guide-east-coast.jpg";

/** The image box is the section width — no widening, so the whole photo is
 *  visible horizontally and only the Y offset crops. */
process.env.BOX_SCALE = "1.0";

/** Measured from the live DOM at 1440px: the hero's copy block (max-w-xl
 *  inside max-w-6xl) ends at x=744. The h1 spans are block-level, so this is
 *  the wrapper edge and therefore a pessimistic bound on the ink. */
process.env.TEXT_RIGHT = "760";

/* ── Which rows of the photo are actually on screen ──
   guide-east-coast.jpg is 2400x1600. At a 1440px viewport the hero measures
   1425x592, so object-cover needs 592 x (2400/1440) = 987 of the 1600 rows,
   leaving 613 of overflow; object-center puts the window at rows 306-1293, or
   19-81% of the frame. Measuring 0-100% would score the text against pixels
   the page never draws. */
process.env.CROP_TOP = "0.191";
process.env.CROP_BOTTOM = "0.808";

process.env.BASE_ALPHA = "0.15";
process.env.STOPS = JSON.stringify([
  [0, 0.95],
  [0.34, 0.9],
  [0.5, 0.7],
  [0.64, 0.3],
  [0.78, 0],
]);

/** The mobile pass in that script is tied to the homepage hero's crop; this
 *  hero's phone layout is covered by check-overlay-contrast.mjs. */
process.env.SKIP_MOBILE = "1";

await import("./check-hero-contrast.mjs");
