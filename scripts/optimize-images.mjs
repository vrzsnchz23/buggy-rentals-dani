/**
 * Shrinks the source images in public/images in place.
 *
 * These were straight camera/export files — several were 9–13 MB each, which
 * bloats every deploy and makes the first on-demand optimization of each one
 * very slow. Nothing here is served raw (next/image resizes at request time),
 * so the only thing we lose by capping the source is detail nobody can see.
 *
 *   npm run images:report    — show what would change, write nothing
 *   npm run images:optimize  — rewrite the files
 *
 * Originals are copied to .image-originals/ (gitignored) the first time a file is
 * touched, so a bad run is always reversible.
 */
import sharp from "sharp";
import { readdirSync, statSync, mkdirSync, copyFileSync, existsSync, renameSync, unlinkSync, writeFileSync } from "node:fs";
import { join, extname, basename } from "node:path";

const DIR = "public/images";
const BACKUP = ".image-originals"; // outside public/ so backups never ship in a deploy

/** Longest edge we keep. next/image never serves above 3840 and these are
 *  decorative photos, so 2400 is already generous. */
const MAX_EDGE = 2400;
const JPEG_QUALITY = 82;
/** Files at or under this are left alone — recompressing them gains nothing. */
const SKIP_UNDER_BYTES = 400 * 1024;
/** Within MAX_EDGE and under this, treat the file as already done. */
const ALREADY_OPTIMIZED_BYTES = 900 * 1024;

const apply = process.argv.includes("--apply");

const kb = (n) => `${(n / 1024).toFixed(0)}KB`;

async function run() {
  const files = readdirSync(DIR).filter((f) => {
    if (statSync(join(DIR, f)).isDirectory()) return false;
    return [".jpg", ".jpeg", ".png"].includes(extname(f).toLowerCase());
  });

  let before = 0;
  let after = 0;
  let touched = 0;

  for (const file of files.sort()) {
    const path = join(DIR, file);
    const size = statSync(path).size;
    before += size;

    if (size <= SKIP_UNDER_BYTES) {
      after += size;
      continue;
    }

    const meta = await sharp(path).metadata();
    const needsResize = Math.max(meta.width, meta.height) > MAX_EDGE;
    const ext = extname(file).toLowerCase();

    // Already within budget: leave it alone. A second lossy pass over a file
    // this script already processed costs real quality for a few percent of
    // size, so re-running the script is idempotent in practice.
    if (!needsResize && size < ALREADY_OPTIMIZED_BYTES) {
      after += size;
      continue;
    }

    let pipeline = sharp(path).rotate();
    if (needsResize) {
      pipeline = pipeline.resize({
        width: meta.width >= meta.height ? MAX_EDGE : undefined,
        height: meta.height > meta.width ? MAX_EDGE : undefined,
        fit: "inside",
        withoutEnlargement: true,
      });
    }

    pipeline =
      ext === ".png"
        ? pipeline.png({ compressionLevel: 9, palette: !meta.hasAlpha, effort: 8 })
        : pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, progressive: true });

    const buf = await pipeline.toBuffer();

    // Never write a file that got bigger.
    if (buf.length >= size) {
      after += size;
      continue;
    }

    touched++;
    after += buf.length;
    const pct = (100 - (buf.length / size) * 100).toFixed(0);
    console.log(
      `${apply ? "✓" : "·"} ${file.padEnd(18)} ${kb(size).padStart(7)} → ${kb(buf.length).padStart(7)}  (-${pct}%)` +
        (needsResize ? `  resized from ${meta.width}x${meta.height}` : "")
    );

    if (apply) {
      if (!existsSync(BACKUP)) mkdirSync(BACKUP, { recursive: true });
      const backupPath = join(BACKUP, file);
      if (!existsSync(backupPath)) copyFileSync(path, backupPath);
      // Write the encoded buffer verbatim. Passing it back through
      // sharp().toFile() would re-encode it with default settings, which for
      // PNG produced a *larger* file than the one we just measured — the
      // reported saving never actually landed on disk.
      // Temp name then swap, so an aborted run can't truncate a file.
      const tmp = join(DIR, `.tmp-${basename(file)}`);
      writeFileSync(tmp, buf);
      unlinkSync(path);
      renameSync(tmp, path);
    }
  }

  console.log(
    `\n${touched} file(s) ${apply ? "rewritten" : "would change"} · ` +
      `${(before / 1024 / 1024).toFixed(1)}MB → ${(after / 1024 / 1024).toFixed(1)}MB`
  );
  if (!apply) console.log("Dry run. Re-run with --apply to write.");
  else console.log(`Originals kept in ${BACKUP}/`);
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
