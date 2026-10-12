import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * The real root layout is app/[locale]/layout.tsx — this one only passes
 * children through. metadataBase lives here so routes rendered outside a
 * locale (the global 404, the metadata routes) can still resolve relative
 * social image URLs.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
