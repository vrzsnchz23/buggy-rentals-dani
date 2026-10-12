import { notFound } from "next/navigation";

/**
 * Catch-all for unknown paths inside a locale.
 *
 * Without it, /es/anything-wrong fell through to the app-level not-found,
 * which has no navbar, footer or translations. Real routes (/es/book,
 * /es/pricing…) still win — Next matches specific segments before a catch-all
 * — so this only ever runs for URLs that genuinely do not exist, and
 * notFound() renders app/[locale]/not-found.tsx with a 404 status.
 */
export default function LocaleCatchAll(): never {
  notFound();
}
