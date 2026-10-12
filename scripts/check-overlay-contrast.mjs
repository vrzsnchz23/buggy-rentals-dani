/**
 * Measures white-text contrast over any photo-plus-wash panel on the site.
 *
 * There are now four places where white copy sits on a photograph, and
 * "it looks dark enough" is exactly how an unreadable panel ships. This samples
 * the real pixels in the crop each panel actually shows, composites the wash
 * that covers them, and reports the worst case inside the text zone.
 *
 *   node scripts/check-overlay-contrast.mjs
 *
 * Each PANEL below mirrors one component. When a wash or a crop changes there,
 * change it here too and re-run — the numbers in the review notes came from
 * this script, not from looking at the screen.
 */
import sharp from "sharp";

const SCRIM = [8, 28, 44];

/** A vertical wash, as [fractionFromTop, alpha] pairs. */
function alphaAt(stops, frac) {
  if (frac <= stops[0][0]) return stops[0][1];
  for (let i = 0; i < stops.length - 1; i++) {
    const [y0, a0] = stops[i];
    const [y1, a1] = stops[i + 1];
    if (frac >= y0 && frac <= y1) return a0 + ((a1 - a0) * (frac - y0)) / (y1 - y0);
  }
  return stops[stops.length - 1][1];
}

function relLum([r, g, b]) {
  const c = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
}

const greyFor = (l) => (l <= 0.0031308 ? l * 12.92 : 1.055 * Math.pow(l, 1 / 2.4) - 0.055) * 255;

const PANELS = [
  {
    name: "WhyUs band (desktop, 1088x526)",
    photo: "public/images/cozumel-sign.jpg",
    box: [1088, 526],
    objectPosition: [0.55, 0.38],
    // Written top-to-bottom; the component declares it as `to top`.
    stops: [[0, 0.06], [0.28, 0.22], [0.5, 0.72], [0.72, 0.93], [1, 0.95]],
    // Measured in the browser at a 1440px viewport: pt-56 puts the first line
    // of copy 42.6% down the panel.
    textZone: [0.42, 0.98],
  },
  {
    name: "WhyUs band (mobile strip is photo-only — copy sits on solid navy)",
    skip: true,
  },
  {
    name: "Fleet mix & match (desktop, 1216x300)",
    photo: "public/images/fleet-lineup.jpg",
    box: [1216, 300],
    objectPosition: [0.5, 0.58],
    stops: [[0, 0.62], [0.52, 0.86], [1, 0.95]],
    textZone: [0.1, 0.95],
  },
  {
    name: "Fleet mix & match (mobile, 392x290)",
    photo: "public/images/fleet-lineup.jpg",
    box: [392, 290],
    objectPosition: [0.5, 0.58],
    stops: [[0, 0.62], [0.52, 0.86], [1, 0.95]],
    textZone: [0.1, 0.95],
  },
  {
    name: "Pricing hero (mobile, 375x512)",
    photo: "public/images/pricing-hero.jpg",
    box: [375, 512],
    objectPosition: [0.64, 0.5],
    stops: [[0, 0.06], [0.15, 0.28], [0.34, 0.72], [0.54, 0.93], [1, 0.96]],
    // Copy starts below the navbar and runs to the bottom of the section.
    textZone: [0.42, 0.98],
  },
  {
    name: "Pricing closing CTA (1440x480)",
    photo: "public/images/pricing-water.jpg",
    box: [1440, 480],
    objectPosition: [0.5, 0.6],
    stops: [[0, 0.84], [0.55, 0.9], [1, 0.95]],
    textZone: [0.08, 0.95],
  },
  {
    // The plan cards photo bands carry no text directly on the photo: the two
    // pills on them ("Most popular", "Air conditioning") have their own solid
    // fills, so they are measured as flat colour pairs instead —
    // white on #C05232 is 4.67:1 and #1B4F72 on white is 8.07:1.
    name: "Pricing plan card bands (no text on the photo — pills are solid-filled)",
    skip: true,
  },
  {
    name: "CruiseBanner (photo at 45% opacity under a horizontal wash)",
    photo: "public/images/cruise-downtown.jpg",
    box: [1440, 170],
    objectPosition: [0.5, 0.62],
    // Flattened to its lightest end, which is the pessimistic case: 0.72 wash
    // over a photo that is itself only 45% opaque on navy.
    stops: [[0, 1 - (1 - 0.72) * 0.45], [1, 1 - (1 - 0.72) * 0.45]],
    textZone: [0.05, 0.95],
  },
];

let worstOverall = Infinity;

for (const p of PANELS) {
  if (p.skip) {
    console.log(`— ${p.name}\n`);
    continue;
  }

  const meta = await sharp(p.photo).metadata();
  const [boxW, boxH] = p.box;

  // object-cover: scale so the photo covers the box, then crop around
  // objectPosition. Whichever axis overflows is the one we crop.
  const scale = Math.max(boxW / meta.width, boxH / meta.height);
  const drawnW = meta.width * scale;
  const drawnH = meta.height * scale;
  const cropW = Math.round(boxW / scale);
  const cropH = Math.round(boxH / scale);
  const left = Math.round(Math.max(0, Math.min(meta.width - cropW, p.objectPosition[0] * (meta.width - cropW))));
  const top = Math.round(Math.max(0, Math.min(meta.height - cropH, p.objectPosition[1] * (meta.height - cropH))));

  const ROWS = 12;
  const sliceH = Math.max(2, Math.floor(cropH / ROWS));
  let worst = Infinity;
  let worstAt = 0;

  for (let i = 0; i < ROWS; i++) {
    const frac = (i + 0.5) / ROWS;
    if (frac < p.textZone[0] || frac > p.textZone[1]) continue;

    const { data, info } = await sharp(p.photo)
      .extract({
        left,
        top: Math.min(top + i * sliceH, meta.height - sliceH),
        width: cropW,
        height: sliceH,
      })
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 95th-percentile luminance: ignore a handful of specular pixels but stay
    // pessimistic about the bright band the text has to survive.
    const lums = [];
    for (let q = 0; q < data.length; q += info.channels) {
      lums.push(relLum([data[q], data[q + 1], data[q + 2]]));
    }
    lums.sort((a, b) => a - b);
    const bright = greyFor(lums[Math.floor(lums.length * 0.95)]);

    const a = alphaAt(p.stops, frac);
    const composited = [0, 1, 2].map((k) => SCRIM[k] * a + bright * (1 - a));
    const ratio = (1.05) / (relLum(composited) + 0.05);

    if (ratio < worst) {
      worst = ratio;
      worstAt = frac;
    }
  }

  worstOverall = Math.min(worstOverall, worst);
  console.log(
    `${worst >= 4.5 ? "PASS" : "FAIL"}  ${worst.toFixed(2)}:1  ${p.name}` +
      `   (worst at ${(worstAt * 100).toFixed(0)}% down, drawn ${Math.round(drawnW)}x${Math.round(drawnH)})`
  );
}

console.log(
  `\nworst case across every photo panel: ${worstOverall.toFixed(2)}:1 — ` +
    (worstOverall >= 4.5 ? "all pass WCAG AA for body text" : "NEEDS WORK")
);
