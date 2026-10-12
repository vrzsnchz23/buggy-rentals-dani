"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";

/**
 * Bottom booking bar for phones.
 *
 * The home page is ~12,000px tall on a 375px screen, so for most of the scroll
 * there was no call to action anywhere on screen. This keeps the price and a
 * book button permanently reachable once the visitor is past the hero.
 */
export function StickyBookBar({ price = 75 }: { price?: number }) {
  const locale = useLocale();
  const t = useTranslations("stickyBar");
  const [shown, setShown] = useState(false);

  useEffect(() => {
    function onScroll() {
      // Appears once the hero is behind you, hides again at the very bottom so
      // it never covers the footer's own links.
      const y = window.scrollY;
      const nearBottom =
        window.innerHeight + y >= document.documentElement.scrollHeight - 220;
      setShown(y > window.innerHeight * 0.85 && !nearBottom);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      className="sticky-book-bar sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      data-shown={shown}
      aria-hidden={!shown}
    >
      <div className="flex items-center gap-3">
        <div className="min-w-0">
          <div className="flex items-baseline gap-1">
            <span className="text-[#5A616B] text-xs">{t("from")}</span>
            <span className="text-[#1B4F72] font-black text-xl leading-none">${price}</span>
            <span className="text-[#5A616B] text-xs">{t("perDay")}</span>
          </div>
          <div className="flex items-center gap-1 text-[#5A616B] text-[11px] mt-0.5">
            <ShieldCheck className="w-3 h-3 text-[#3F7878]" aria-hidden="true" />
            {t("insurance")}
          </div>
        </div>
        <Link
          href={`/${locale}/book`}
          tabIndex={shown ? undefined : -1}
          className="flex-1 flex items-center justify-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-base min-h-12 rounded-xl transition-colors"
        >
          {t("cta")} →
        </Link>
      </div>
    </div>
  );
}
