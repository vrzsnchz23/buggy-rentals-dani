"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Records `review_click` and then sends the visitor to the review form.
 *
 * A client-side hop rather than a server redirect, because the whole point of
 * the short URL is to measure how many people the QR and the WhatsApp message
 * actually bring — a 302 would leave nothing to count. The anchor is rendered
 * too, so the link still works with JS disabled or if the redirect is slow.
 */
export function ReviewRedirect({ href, platform }: { href: string; platform: string }) {
  useEffect(() => {
    track("review_click", { platform });
    const timer = setTimeout(() => window.location.replace(href), 150);
    return () => clearTimeout(timer);
  }, [href, platform]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F5F0EB] px-6">
      <div className="text-center">
        <p className="text-[#1B4F72] font-bold text-lg mb-2">Taking you to the review page…</p>
        <a href={href} className="text-[#C05232] font-semibold underline">
          Tap here if nothing happens
        </a>
      </div>
    </main>
  );
}
