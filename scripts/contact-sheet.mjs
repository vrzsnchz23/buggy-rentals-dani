/**
 * Builds a labelled contact sheet of public/images so a whole shoot can be
 * reviewed in one look instead of opening multi-megabyte originals.
 *
 *   node scripts/contact-sheet.mjs [outPath] [--landscape|--portrait]
 */
import sharp from "sharp";
import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = "public/images";
const out = process.argv[2] || "contact-sheet.jpg";
const onlyLandscape = process.argv.includes("--landscape");
const onlyPortrait = process.argv.includes("--portrait");

const CELL_W = 420;
const CELL_H = 300;
const COLS = 4;
const LABEL_H = 26;

const files = readdirSync(DIR).filter((f) => /\.(jpg|jpeg|png)$/i.test(f));

const entries = [];
for (const f of files) {
  const p = join(DIR, f);
  const m = await sharp(p).metadata();
  const ratio = m.width / m.height;
  if (onlyLandscape && ratio < 1.2) continue;
  if (onlyPortrait && ratio >= 1.2) continue;
  entries.push({ file: f, path: p, ratio, mb: statSync(p).size / 1024 / 1024, w: m.width, h: m.height });
}
entries.sort((a, b) => a.file.localeCompare(b.file));

const rows = Math.ceil(entries.length / COLS);
const sheetW = COLS * CELL_W;
const sheetH = rows * (CELL_H + LABEL_H);

const composites = [];
for (let i = 0; i < entries.length; i++) {
  const e = entries[i];
  const col = i % COLS;
  const row = Math.floor(i / COLS);
  const x = col * CELL_W;
  const y = row * (CELL_H + LABEL_H);

  const thumb = await sharp(e.path)
    .resize(CELL_W - 8, CELL_H - 8, { fit: "cover" })
    .jpeg({ quality: 78 })
    .toBuffer();
  composites.push({ input: thumb, left: x + 4, top: y + 4 });

  const label = `${i + 1}. ${e.file}  ${e.w}x${e.h}`;
  const svg = `<svg width="${CELL_W}" height="${LABEL_H}">
    <rect width="100%" height="100%" fill="#1B4F72"/>
    <text x="6" y="18" font-family="sans-serif" font-size="13" fill="#ffffff">${label.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</text>
  </svg>`;
  composites.push({ input: Buffer.from(svg), left: x, top: y + CELL_H });
}

await sharp({
  create: { width: sheetW, height: sheetH, channels: 3, background: "#0d2d42" },
})
  .composite(composites)
  .jpeg({ quality: 80 })
  .toFile(out);

console.log(`${entries.length} images → ${out} (${sheetW}x${sheetH})`);
entries.forEach((e, i) => console.log(`${String(i + 1).padStart(2)}. ${e.file}`));
