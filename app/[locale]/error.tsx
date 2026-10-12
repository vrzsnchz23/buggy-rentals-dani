"use client";
import { useEffect } from "react";
import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { RotateCw } from "lucide-react";

export default function LocaleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errorPage");
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className="on-dark min-h-screen flex items-center relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0d2d42 100%)" }}
    >
      <div className="absolute top-10 right-0 w-80 h-80 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative text-center">
        <div className="text-5xl mb-6" aria-hidden="true">🛠️</div>
        <h1 className="text-3xl sm:text-4xl font-black text-white mb-4">{t("title")}</h1>
        <p className="text-[#CBD5E1] text-lg leading-relaxed mb-8">{t("desc")}</p>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#C05232] hover:bg-[#A8411F] text-white font-black px-7 min-h-12 rounded-full transition-all hover:-translate-y-0.5"
          >
            <RotateCw className="w-4 h-4" aria-hidden="true" />
            {t("retry")}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center border border-white/30 hover:border-white/60 hover:bg-white/5 text-white font-semibold px-7 min-h-12 rounded-full transition-all"
          >
            {t("home")}
          </Link>
        </div>

        {error.digest && (
          <p className="text-white/50 text-xs mt-8 font-mono">ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}
