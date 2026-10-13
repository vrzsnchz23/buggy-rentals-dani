import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' https://js.stripe.com https://www.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://*.stripe.com https://img.youtube.com https://*.googleusercontent.com https://maps.googleapis.com https://maps.gstatic.com https://www.google-analytics.com",
      "font-src 'self'",
      "connect-src 'self' https://api.stripe.com https://r.stripe.com https://www.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com",
      "frame-src https://js.stripe.com https://hooks.stripe.com https://www.google.com https://www.youtube-nocookie.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(self), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  images: {
    // Default ends at 3840. A 2x-DPR laptop asking for a full-bleed hero then
    // pulls the 3840 candidate (~450KB) when 2048 (~300KB) is indistinguishable
    // at that size. Capping here protects every image on the site, not just one.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    // Next 16 defaults this to [75] and coerces any other quality prop to the
    // nearest allowed value — so an undeclared quality={78} silently served 75.
    // 50 is for photos that only ever appear under a heavy colour wash, where
    // the artefacts are invisible and the bytes are not.
    qualities: [50, 75],
    remotePatterns: [
      { protocol: "https", hostname: "*.googleusercontent.com" },
      { protocol: "https", hostname: "maps.googleapis.com" },
      // YouTube thumbnails in the admin resources list.
      { protocol: "https", hostname: "img.youtube.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
