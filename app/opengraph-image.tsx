import { ImageResponse } from "next/og";

export const alt = "Buggy Rentals with Dani — Cozumel · $75/day, insurance included";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview card.
 *
 * The site previously pointed OG at /images/buggy8.png — a cut-out PNG with a
 * transparent background, which WhatsApp and Facebook composite onto black.
 * This renders a flat, on-brand card instead, so the link always looks the same.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #1B4F72 0%, #0d2d42 100%)",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        {/* Top row — eyebrow */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              background: "#C05232",
              color: "white",
              fontSize: 26,
              fontWeight: 700,
              padding: "10px 26px",
              borderRadius: 999,
            }}
          >
            COZUMEL, MEXICO
          </div>
          <div style={{ display: "flex", color: "#A8D5D5", fontSize: 26, fontWeight: 600 }}>
            5.0 / 5 on Google
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              color: "white",
              fontSize: 92,
              fontWeight: 900,
              lineHeight: 1.03,
              letterSpacing: -2,
            }}
          >
            Buggy Rentals
          </div>
          <div
            style={{
              display: "flex",
              color: "#A8D5D5",
              fontSize: 92,
              fontWeight: 900,
              fontStyle: "italic",
              lineHeight: 1.03,
              letterSpacing: -2,
            }}
          >
            with Dani
          </div>
          <div
            style={{
              display: "flex",
              color: "#CBD5E1",
              fontSize: 34,
              marginTop: 20,
            }}
          >
            Steps from Puerta Maya &amp; SSA cruise terminals
          </div>
        </div>

        {/* Bottom row — price strip */}
        <div style={{ display: "flex", alignItems: "flex-end", gap: 40 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
            <div style={{ display: "flex", color: "#E8836A", fontSize: 104, fontWeight: 900, lineHeight: 1 }}>
              $75
            </div>
            <div style={{ display: "flex", color: "#CBD5E1", fontSize: 34, fontWeight: 600 }}>
              USD / day
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              color: "#CBD5E1",
              fontSize: 26,
              lineHeight: 1.45,
              paddingBottom: 10,
            }}
          >
            <div style={{ display: "flex" }}>Up to 5 people · Insurance included</div>
            <div style={{ display: "flex" }}>buggycozumel.com</div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
