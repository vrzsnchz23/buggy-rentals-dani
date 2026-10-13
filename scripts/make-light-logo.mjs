/**
 * Builds a light version of the wordmark for dark surfaces.
 *
 * public/logo.png is navy artwork on transparency, drawn for the white public
 * navbar. The admin sidebar and its mobile top bar are #0F2035, so the logo was
 * navy on navy and effectively invisible — the previous code happened to hide
 * the problem by cropping a 2201x593 wordmark into a 40x40 box.
 *
 * This keeps the alpha channel exactly as it is and repaints every visible
 * pixel white, so the shape and the anti-aliased edges survive.
 *
 *   node scripts/make-light-logo.mjs
 */
import sharp from "sharp";

const SRC = "public/logo.png";
const OUT = "public/logo-light.png";

const { data, info } = await sharp(SRC).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height, channels } = info;
if (channels !== 4) throw new Error(`expected RGBA, got ${channels} channels`);

const out = Buffer.alloc(data.length);
for (let i = 0; i < data.length; i += 4) {
  out[i] = 255;
  out[i + 1] = 255;
  out[i + 2] = 255;
  out[i + 3] = data[i + 3];
}

await sharp(out, { raw: { width, height, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(OUT);

const meta = await sharp(OUT).metadata();
console.log(`${SRC} -> ${OUT}  ${meta.width}x${meta.height}  ${(meta.size / 1024).toFixed(0)}KB`);
