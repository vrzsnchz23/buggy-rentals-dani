"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Nothing stays hidden longer than this, whatever goes wrong. */
const FAILSAFE_MS = 2500;

/**
 * Reveals any element marked with `data-reveal` as it scrolls into view.
 *
 * Three deliberate safety properties, because the failure mode here is
 * invisible content:
 *
 *  1. The `.reveal-ready` class that arms the hiding CSS is added from JS, so
 *     if the script never runs nothing is ever hidden.
 *  2. It re-scans on every route change. This component lives in the layout,
 *     which does not remount on client-side navigation — without the pathname
 *     dependency, a page reached via <Link> would keep its sections at
 *     opacity 0 forever.
 *  3. A failsafe timer reveals whatever is left after 2.5s, covering browsers
 *     or conditions where IntersectionObserver never fires.
 */
export function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
      .filter((el) => el.dataset.reveal !== "visible");

    if (!targets.length) return;

    const revealAll = () => targets.forEach((el) => (el.dataset.reveal = "visible"));

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced || typeof IntersectionObserver === "undefined") {
      revealAll();
      return;
    }

    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          el.dataset.reveal = "visible";
          observer.unobserve(el);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );

    // Anything already on screen shows immediately — no pop-in for the content
    // the visitor is looking at right now.
    targets.forEach((el) => {
      if (el.getBoundingClientRect().top < window.innerHeight) {
        el.dataset.reveal = "visible";
      } else {
        observer.observe(el);
      }
    });

    const failsafe = window.setTimeout(revealAll, FAILSAFE_MS);

    return () => {
      window.clearTimeout(failsafe);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
