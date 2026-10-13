import type { StaticImageData } from "next/image";

/**
 * The pure half of uploaded cover photos.
 *
 * Separate from lib/blog/store.ts because that module is `server-only` — it
 * talks to the database — and the editor runs in the browser, where it needs
 * exactly these four things to draw a thumbnail of a photo that was just
 * uploaded.
 */

/** A cover stored in the database rather than imported from public/images. */
export const UPLOAD_PREFIX = "upload:";

export interface UploadMeta {
  id: string;
  filename: string;
  width: number;
  height: number;
  blurDataURL: string;
}

export function isUploadKey(key: string | null | undefined) {
  return typeof key === "string" && key.startsWith(UPLOAD_PREFIX);
}

export function uploadId(key: string) {
  return key.slice(UPLOAD_PREFIX.length);
}

export function uploadKey(id: string) {
  return `${UPLOAD_PREFIX}${id}`;
}

/**
 * An uploaded photo in the shape a static import would have had.
 *
 * This is the whole reason uploads work at all: next/image accepts an object
 * with a src, an intrinsic size and a placeholder, and cannot tell whether
 * that object came from a build-time import or from a database row. Every page
 * that renders a cover keeps working untouched.
 */
export function uploadToImageData(m: {
  id: string;
  width: number;
  height: number;
  blurDataURL: string;
}): StaticImageData {
  return {
    src: `/api/blog-image/${m.id}`,
    width: m.width,
    height: m.height,
    blurDataURL: m.blurDataURL,
  };
}
