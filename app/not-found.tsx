import Link from "next/link";
import "@/app/globals.css";

/**
 * Fallback 404 for URLs that never reach a locale segment.
 *
 * The real root layout is app/[locale]/layout.tsx — app/layout.tsx just passes
 * children through — so this page supplies its own <html>/<body>, and keeps to
 * plain markup since there is no locale and therefore no translations here.
 */
export default function RootNotFound() {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(160deg, #1B4F72 0%, #0d2d42 100%)",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ color: "#A8D5D5", fontSize: "5rem", fontWeight: 900, lineHeight: 1, margin: 0 }}>
              404
            </p>
            <h1 style={{ color: "#fff", fontSize: "1.875rem", fontWeight: 900, margin: "1rem 0 0.75rem" }}>
              Page not found
            </h1>
            <p style={{ color: "#CBD5E1", fontSize: "1.0625rem", margin: "0 0 2rem" }}>
              Esta página no existe · This page doesn&apos;t exist
            </p>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href="/en"
                style={{
                  display: "inline-flex", alignItems: "center", background: "#C05232", color: "#fff",
                  fontWeight: 800, padding: "0.85rem 1.75rem", borderRadius: 999, textDecoration: "none",
                }}
              >
                English
              </Link>
              <Link
                href="/es"
                style={{
                  display: "inline-flex", alignItems: "center", border: "1px solid rgba(255,255,255,0.35)",
                  color: "#fff", fontWeight: 600, padding: "0.85rem 1.75rem", borderRadius: 999, textDecoration: "none",
                }}
              >
                Español
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
