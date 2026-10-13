/**
 * The blog index hero, measured with the same horizontal-wash maths as the
 * other heroes.
 *
 * A wrapper rather than `PHOTO=... node check-hero-contrast.mjs` because an
 * inline env assignment is not portable to Windows, where this project is
 * developed.
 *
 *   node scripts/check-blog-hero.mjs
 */

process.env.PHOTO = "public/images/blog-hero.jpg";

/** The image box is the section width — no widening. */
process.env.BOX_SCALE = "1.0";

/** Measured from the live DOM at 1440px: the hero is 1425x448 and the copy
 *  block runs x 168-744, with the furthest-right ink at 744. */
process.env.TEXT_RIGHT = "760";

/* ── Which rows of the photo are actually on screen ──
   blog-hero.jpg is 2400x1600. At a 1440px viewport the hero measures 1425x448,
   so object-cover needs 448 x (2400/1440) = 747 of the 1600 rows, leaving 853
   of overflow; object-center puts the window at rows 426-1173, or 27-73% of the
   frame. Measuring 0-100% would score the text against pixels the page never
   draws. */
process.env.CROP_TOP = "0.266";
process.env.CROP_BOTTOM = "0.733";

process.env.BASE_ALPHA = "0.15";

/** Same stops as the driving guide's hero — this frame needs 0.41-0.53 across
 *  the copy area, which these clear comfortably. */
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
