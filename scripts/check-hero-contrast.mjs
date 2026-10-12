/**
 * Measures white-text contrast over the hero photograph.
 *
 * Text on a photo is the easy place to ship something unreadable, so instead of
 * eyeballing the scrim we sample the actual pixels under the copy, composite
 * the scrim alpha that sits at that x position, and compute the real ratio.
 *
 *   node scripts/check-hero-contrast.mjs
 */
import sharp from "sharp";

const PHOTO = "public/images/hero-coast.jpg";

/** Layout facts from Hero.tsx, at a 1440px-wide viewport. */
const VIEWPORT = 1440;
const IMAGE_BOX = VIEWPORT * 1.32; // sm:w-[138%] / lg:w-[132%], anchored left
const TEXT_LEFT = 112;             // max-w-7xl centered + px-8
/* Measured from the live DOM: the furthest-right inked text at 1440px is the
   description paragraph, ending at x=584. The content wrapper is wider than
   that, so measuring the wrapper would flag a band that holds no text. */
const TEXT_RIGHT = Number(process.env.TEXT_RIGHT || 600);

/** The flat wash under everything. */
const BASE_ALPHA = Number(process.env.BASE_ALPHA || 0.12);

/** Stops of the 96deg gradient, as fractions of the viewport width. */
const STOPS = JSON.parse(process.env.STOPS || `[[0,0.94],[0.26,0.86],[0.42,0.55],[0.58,0.18],[0.72,0]]`);

const SCRIM_RGB = [8, 28, 44];

function gradientAlphaAt(fraction) {
  if (fraction <= STOPS[0][0]) return STOPS[0][1];
  for (let i = 0; i < STOPS.length - 1; i++) {
    const [x0, a0] = STOPS[i];
    const [x1, a1] = STOPS[i + 1];
    if (fraction >= x0 && fraction <= x1) {
      const t = (fraction - x0) / (x1 - x0);
      return a0 + (a1 - a0) * t;
    }
  }
  return STOPS[STOPS.length - 1][1];
}

/** Two stacked translucent layers of the same colour. */
function totalAlphaAt(fraction) {
  const g = gradientAlphaAt(fraction);
  return 1 - (1 - g) * (1 - BASE_ALPHA);
}

function relLum([r, g, b]) {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

function contrastWithWhite(rgb) {
  const l = relLum(rgb);
  return (1.0 + 0.05) / (l + 0.05);
}

const meta = await sharp(PHOTO).metadata();
const scale = meta.width / IMAGE_BOX; // photo px per CSS px

// Walk the copy area in columns; for each, take a pessimistic (bright)
// sample of the photo and composite the scrim that covers it.
const COLUMNS = 14;
const results = [];

for (let i = 0; i < COLUMNS; i++) {
  const cssX = TEXT_LEFT + ((TEXT_RIGHT - TEXT_LEFT) * i) / (COLUMNS - 1);
  const photoX = Math.min(meta.width - 2, Math.round(cssX * scale));
  const stripW = Math.max(2, Math.round(((TEXT_RIGHT - TEXT_LEFT) / COLUMNS) * scale));

  const { data, info } = await sharp(PHOTO)
    .extract({
      left: Math.max(0, Math.min(photoX, meta.width - stripW)),
      top: 0,
      width: Math.min(stripW, meta.width - photoX),
      height: meta.height,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  // 95th-percentile luminance: ignore a few specular pixels but stay pessimistic.
  const lums = [];
  for (let p = 0; p < data.length; p += info.channels) {
    lums.push(relLum([data[p], data[p + 1], data[p + 2]]));
  }
  lums.sort((a, b) => a - b);
  const p95 = lums[Math.floor(lums.length * 0.95)];

  // Recover an equivalent grey for that luminance, then composite the scrim.
  const inv = (l) => {
    const s = l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
    return s * 255;
  };
  const bright = inv(p95);
  const alpha = totalAlphaAt(cssX / VIEWPORT);
  const composited = [0, 1, 2].map((k) => SCRIM_RGB[k] * alpha + bright * (1 - alpha));

  results.push({
    cssX: Math.round(cssX),
    scrimAlpha: +alpha.toFixed(3),
    ratio: +contrastWithWhite(composited).toFixed(2),
  });
}

console.log("white text over hero photo, 1440px viewport\n");
console.log(" css x   scrim   contrast   AA body (4.5)  AA large (3.0)");
let worstBody = Infinity;
for (const r of results) {
  worstBody = Math.min(worstBody, r.ratio);
  console.log(
    `${String(r.cssX).padStart(6)}   ${r.scrimAlpha.toFixed(2)}   ${String(r.ratio).padStart(7)}` +
      `       ${r.ratio >= 4.5 ? "PASS" : "FAIL"}            ${r.ratio >= 3 ? "PASS" : "FAIL"}`
  );
}
console.log(`\nworst case across the copy area: ${worstBody.toFixed(2)}:1`);
console.log(worstBody >= 4.5 ? "OK — passes AA for body text everywhere" : "NEEDS WORK — strengthen the scrim");

/* ── Mobile ──
   Different geometry: the gradient runs bottom-to-top and the visible slice of
   the photo is a narrow vertical window (object-position 62%), so we sample by
   row instead of by column. */
const M_VIEWPORT_W = 375;
const M_VIEWPORT_H = 812;
const M_STOPS = [
  [0.0, 0.08], // top of the section
  [0.16, 0.3],
  [0.34, 0.74],
  [0.52, 0.94],
  [1.0, 0.96], // bottom
];
const M_OBJECT_X = 0.62;

function mobileAlphaAtFromTop(fracFromTop) {
  for (let i = 0; i < M_STOPS.length - 1; i++) {
    const [y0, a0] = M_STOPS[i];
    const [y1, a1] = M_STOPS[i + 1];
    if (fracFromTop >= y0 && fracFromTop <= y1) {
      const t = (fracFromTop - y0) / (y1 - y0);
      return a0 + (a1 - a0) * t;
    }
  }
  return M_STOPS[M_STOPS.length - 1][1];
}

// object-cover on a tall box: scale by height, so we see a narrow x window.
const mDrawnW = meta.height * (M_VIEWPORT_W / M_VIEWPORT_H);
const mLeft = Math.round(
  Math.max(0, Math.min(meta.width - mDrawnW, M_OBJECT_X * (meta.width - mDrawnW)))
);

const invLum = (l) => {
  const s = l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055;
  return s * 255;
};

console.log("\n\nwhite text over hero photo, 375px mobile viewport\n");
console.log(" y (css)  scrim   contrast   AA body (4.5)");
let mWorst = Infinity;
const ROWS = 12;
for (let i = 1; i < ROWS; i++) {
  const frac = i / ROWS;
  const photoY = Math.round(frac * meta.height);
  const sliceH = Math.max(2, Math.round(meta.height / ROWS));

  const { data, info } = await sharp(PHOTO)
    .extract({
      left: mLeft,
      top: Math.min(photoY, meta.height - sliceH),
      width: Math.round(mDrawnW),
      height: sliceH,
    })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const lums = [];
  for (let p = 0; p < data.length; p += info.channels) {
    lums.push(relLum([data[p], data[p + 1], data[p + 2]]));
  }
  lums.sort((a, b) => a - b);
  const p95 = lums[Math.floor(lums.length * 0.95)];

  const alpha = 1 - (1 - mobileAlphaAtFromTop(frac)) * (1 - BASE_ALPHA);
  const bright = invLum(p95);
  const composited = [0, 1, 2].map((k) => SCRIM_RGB[k] * alpha + bright * (1 - alpha));
  const ratio = +contrastWithWhite(composited).toFixed(2);

  // Copy starts below the navbar and runs to the bottom of the section.
  const isCopyZone = frac >= 0.22;
  if (isCopyZone) mWorst = Math.min(mWorst, ratio);

  console.log(
    `${String(Math.round(frac * M_VIEWPORT_H)).padStart(7)}   ${alpha.toFixed(2)}   ${String(ratio).padStart(7)}` +
      `       ${isCopyZone ? (ratio >= 4.5 ? "PASS" : "FAIL") : "— (photo only)"}`
  );
}
console.log(`\nworst case in the mobile copy zone: ${mWorst.toFixed(2)}:1`);
console.log(mWorst >= 4.5 ? "OK — passes AA for body text" : "NEEDS WORK — strengthen the mobile scrim");
