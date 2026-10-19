"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { track, aiReferrer } from "@/lib/analytics";

/**
 * Site-wide event tracking.
 *
 * WhatsApp clicks are caught with one delegated listener on the document
 * instead of an onClick on each link — there are wa.me links in the footer,
 * the floating button, the FAQ, the location block and four separate pages,
 * and any new one would otherwise be silently untracked.
 */
export function AnalyticsEvents() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      const target = e.target as HTMLElement | null;
      const link = target?.closest?.("a");
      if (!link) return;

      const href = link.getAttribute("href") ?? "";
      if (href.includes("wa.me") || href.includes("api.whatsapp.com")) {
        track("whatsapp_click", { page_path: pathname, link_text: link.innerText?.slice(0, 80) });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [pathname]);

  // Entering the booking wizard is the top of the funnel we actually control.
  useEffect(() => {
    if (/^\/(en|es)\/book\/?$/.test(pathname)) {
      track("begin_checkout", { page_path: pathname });
    }
  }, [pathname]);

  // Visits from the physical signage QR, and from AI assistants.
  useEffect(() => {
    if (searchParams.get("utm_source") === "signage") {
      track("signage_visit", { page_path: pathname, medium: searchParams.get("utm_medium") ?? undefined });
    }
    const ai = aiReferrer();
    if (ai) track("ai_referral", { page_path: pathname, assistant: ai });
    // Only on first load of a given path; params are stable per navigation.
  }, [pathname, searchParams]);

  return null;
}
