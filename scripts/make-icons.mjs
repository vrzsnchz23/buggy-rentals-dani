/**
 * Generates the browser/app icons from the brand mark.
 *
 * The source (public/images/favicon1.png) is 1556x1204 — browsers squash a
 * non-square favicon, so we letterbox the mark onto a square cream canvas
 * with a little breathing room. Apple icons must be opaque or iOS composites
 * them onto black, hence the flat background rather than transparency.
 *
 *   node scripts/make-icons.mjs
 */
import sharp from "sharp";

const SRC = "public/images/favicon1.png";
const CREAM = { r: 0xf5, g: 0xf0, b: 0xeb, alpha: 1 };

/** @param {string} out @param {number} size @param {number} padRatio */
async function square(out, size, padRatio) {
  const inner = Math.round(size * (1 - padRatio * 2));
  const mark = await sharp(SRC)
    .trim()
    .resize(inner, inner, { fit: "inside", withoutEnlargement: false })
    .toBuffer();
  const { width, height } = await sharp(mark).metadata();

  await sharp({
    create: { width: size, height: size, channels: 4, background: CREAM },
  })
    .composite([
      {
        input: mark,
        left: Math.round((size - width) / 2),
        top: Math.round((size - height) / 2),
      },
    ])
    .png({ compressionLevel: 9 })
    .toFile(out);

  console.log(`✓ ${out} — ${size}x${size}`);
}

// 512 gives browsers and the PWA manifest a crisp source to downscale from.
await square("app/icon.png", 512, 0.08);
await square("app/apple-icon.png", 180, 0.1);
await square("public/icon-512.png", 512, 0.08);
await square("public/icon-192.png", 192, 0.08);
