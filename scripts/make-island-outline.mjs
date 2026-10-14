/**
 * Generates lib/island-outline.ts from scripts/data/cozumel-outline.svg.
 *
 *   npm run island:map
 *
 * Three jobs, in order.
 *
 * 1. Shrink it. The source is 3756 cubic segments drawn for a 960x1056 frame;
 *    on the homepage it renders about 450px wide, so most of that detail is
 *    finer than a device pixel. The curves are flattened to their endpoints and
 *    thinned with Douglas–Peucker, which takes 46KB down to under 5KB.
 *
 * 2. Crop the frame to the island, so the drawing fills its box instead of
 *    floating in a square of empty sea.
 *
 * 3. Place the pins. This is the part that matters: the stops are projected
 *    from real coordinates rather than dropped by eye. The source carried a
 *    5 km scale bar spanning 137 px, which calibrates both axes under an
 *    equirectangular projection, and the southernmost point of the outline —
 *    Punta Celarain — anchors them. The check that the whole transform is
 *    sound: projecting Punta Molas from that anchor lands within ~19px, about
 *    700 m, of where the outline actually puts the northern tip.
 *
 *    Any stop that projects into the water is reported rather than quietly
 *    moved. The east-coast longitudes were wrong by 5 to 12 km on the first
 *    pass — the island is tilted, so its east coast at southern latitudes sits
 *    much further west than it feels like it should — and the fix was to
 *    correct the coordinates, not to lean on the snap.
 */
import { readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "scripts/data/cozumel-outline.svg");
const target = path.join(root, "lib/island-outline.ts");

/* ── The stops, by coordinate ────────────────────────────────────────────── */

const STOPS = [
  ["office", 20.4772, -86.9736], // from the business's own schema.org data
  ["sanMiguel", 20.51, -86.947],
  // On the Carretera Transversal, mid-island: Dani corrected this one, and
  // the maths agreed — it had been 3.6 km west of the island's centre at that
  // latitude, and 1.2 km north of the road.
  ["sanGervasio", 20.5085, -86.8587],
  ["mezcalitos", 20.461, -86.8022],
  ["elCedral", 20.383, -86.988],
  ["palancar", 20.362, -87.023],
  ["playaBonita", 20.396, -86.8679],
  ["puntaSur", 20.289, -86.9692],
];

/* ── 1. Flatten and simplify ─────────────────────────────────────────────── */

const svg = readFileSync(source, "utf8");
const d = svg.match(/<path id="cozumel" d="([^"]+)"/)[1];

/* Every command in the source is absolute, and a cubic's last pair is the point
   the curve arrives at — the only one actually on the coastline. */
const flattened = [];
for (const token of d.trim().split(/(?=[MCLZz])/)) {
  if (token[0] === "Z" || token[0] === "z") continue;
  const nums = [...token.matchAll(/(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g)].map((m) => [
    parseFloat(m[1]),
    parseFloat(m[2]),
  ]);
  if (nums.length) flattened.push(nums[nums.length - 1]);
}

function perpendicular(p, a, b) {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const len = Math.hypot(dx, dy);
  if (len === 0) return Math.hypot(p[0] - a[0], p[1] - a[1]);
  return Math.abs(dy * p[0] - dx * p[1] + b[0] * a[1] - b[1] * a[0]) / len;
}

function simplify(points, tolerance) {
  if (points.length < 3) return points;
  let worst = 0;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const dist = perpendicular(points[i], points[0], points[points.length - 1]);
    if (dist > worst) {
      worst = dist;
      index = i;
    }
  }
  if (worst <= tolerance) return [points[0], points[points.length - 1]];
  return [
    ...simplify(points.slice(0, index + 1), tolerance).slice(0, -1),
    ...simplify(points.slice(index), tolerance),
  ];
}

const ring = simplify(flattened, 1.2);
const pathData = "M" + ring.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join("L") + "Z";

/* ── 2. Crop to the island ───────────────────────────────────────────────── */

const minX = Math.min(...ring.map((p) => p[0]));
const maxX = Math.max(...ring.map((p) => p[0]));
const minY = Math.min(...ring.map((p) => p[1]));
const maxY = Math.max(...ring.map((p) => p[1]));

/* Enough sea that a pin on the shoreline is not clipped. */
const PAD = 26;
const vb = {
  x: Math.round(minX - PAD),
  y: Math.round(minY - PAD),
  w: Math.round(maxX - minX + PAD * 2),
  h: Math.round(maxY - minY + PAD * 2),
};

/* ── 3. Project the stops ────────────────────────────────────────────────── */

const PX_PER_KM = 137 / 5; // the scale bar: M43,79 H180, labelled 5km
const PX_PER_DEG_LAT = PX_PER_KM * 110.95;
const PX_PER_DEG_LON = PX_PER_KM * 111.32 * Math.cos((20.43 * Math.PI) / 180);

const south = ring.reduce((a, b) => (b[1] > a[1] ? b : a));
const north = ring.reduce((a, b) => (b[1] < a[1] ? b : a));
const ANCHOR = { lat: 20.2667, lon: -86.9906, x: south[0], y: south[1] };

const project = (lat, lon) => ({
  x: ANCHOR.x + (lon - ANCHOR.lon) * PX_PER_DEG_LON,
  y: ANCHOR.y - (lat - ANCHOR.lat) * PX_PER_DEG_LAT,
});

const molas = project(20.588, -86.7271);
const anchorError = Math.round(Math.hypot(molas.x - north[0], molas.y - north[1]));

/* One closed ring of straight segments, so a ray cast is exact. */
function inside([x, y]) {
  let hit = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
  }
  return hit;
}

const positions = {};
const strays = [];

for (const [id, lat, lon] of STOPS) {
  const p = project(lat, lon);
  if (!inside([p.x, p.y])) {
    strays.push(`${id} projects into the water at ${Math.round(p.x)},${Math.round(p.y)}`);
  }
  positions[id] = {
    x: Math.round(((p.x - vb.x) / vb.w) * 1000) / 10,
    y: Math.round(((p.y - vb.y) / vb.h) * 1000) / 10,
  };
}

/* ── Write it out ────────────────────────────────────────────────────────── */

writeFileSync(
  target,
  `/* GENERATED by scripts/make-island-outline.mjs — do not edit by hand.
 *
 * The coastline of Cozumel, from scripts/data/cozumel-outline.svg: ${flattened.length}
 * curve endpoints thinned to ${ring.length}, which is about half a device pixel of
 * error at the size this is drawn.
 *
 * The pins are projected from real coordinates, calibrated by the 5 km scale
 * bar in the source and anchored on the southern tip. Projecting Punta Molas
 * from that anchor lands ${anchorError}px — roughly ${(anchorError / PX_PER_KM).toFixed(1)} km — from where the outline puts
 * the northern tip, which is the check that the transform holds.
 *
 * PROVENANCE: supplied by Dani. Location maps in this style usually originate
 * on Wikimedia under CC BY-SA, which would require attribution — worth
 * confirming before anyone relies on it.
 */

/** Cropped to the island, with a little sea left around the shoreline pins. */
export const ISLAND_VIEWBOX = "${vb.x} ${vb.y} ${vb.w} ${vb.h}";

/** Each stop as a percentage of that viewBox, from its real coordinates. */
export const ISLAND_POSITIONS: Record<string, { x: number; y: number }> = ${JSON.stringify(positions, null, 2)};

export const ISLAND_PATH =
  "${pathData}";
`,
  "utf8"
);

console.log(`outline: ${flattened.length} -> ${ring.length} points, ${(pathData.length / 1024).toFixed(1)}KB`);
console.log(`viewBox: ${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
console.log(`anchor check: Punta Molas is ${anchorError}px (${(anchorError / PX_PER_KM).toFixed(1)}km) from the outline's north tip`);
if (strays.length) {
  console.error("\nSTOPS IN THE WATER — fix the coordinates above:");
  for (const line of strays) console.error("  " + line);
  process.exitCode = 1;
} else {
  console.log(`all ${STOPS.length} stops project onto land`);
}
