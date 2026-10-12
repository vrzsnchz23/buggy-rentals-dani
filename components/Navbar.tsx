"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Menu, X, Map, User } from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const other = locale === "en" ? "es" : "en";
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const otherLocalePath = pathname.replace(`/${locale}`, `/${other}`);

  const links = [
    { href: `/${locale}#fleet`, label: t("fleet") },
    { href: `/${locale}#how-it-works`, label: t("howItWorks") },
    { href: `/${locale}/pricing`, label: t("pricing") },
    { href: `/${locale}/blog`, label: t("blog") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo */}
          <Link
            href={`/${locale}#`}
            className="flex items-center shrink-0 min-h-11"
            scroll={false}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <Image
              src="/logo.png"
              alt="Buggy Rentals with Dani"
              width={180}
              height={48}
              sizes="180px"
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-gray-600 hover:text-[#1B4F72] font-medium text-sm transition-colors py-2"
              >
                {l.label}
              </a>
            ))}
            {/* Driving Guide — accent, separated */}
            <a
              href={`/${locale}/driving-guide`}
              className="inline-flex items-center gap-1.5 text-[#C05232] hover:text-[#A8411F] font-bold text-sm transition-colors border-l border-gray-200 pl-6 py-2"
            >
              <Map className="w-4 h-4" aria-hidden="true" />
              {t("drivingGuide")}
            </a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Language toggle */}
            <Link
              href={otherLocalePath}
              aria-label={t("switchLanguage")}
              className="text-xs font-bold text-gray-600 hover:text-[#1B4F72] hover:border-gray-400 border border-gray-300 rounded-full min-w-11 h-11 sm:min-w-0 sm:h-auto sm:px-2.5 sm:py-1 flex items-center justify-center transition-colors"
            >
              {other.toUpperCase()}
            </Link>

            {/* Dashboard link */}
            <Link
              href={`/${locale}/dashboard`}
              className="hidden sm:inline-flex items-center gap-1.5 text-[#1B4F72] hover:text-[#0e3557] font-semibold text-sm transition-colors"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              {t("myAccount")}
            </Link>

            {/* CTA — visible at every width: this is the conversion button. */}
            <Link
              href={`/${locale}/book`}
              className="inline-flex items-center bg-[#C05232] hover:bg-[#A8411F] text-white font-bold text-sm px-4 h-11 sm:h-auto sm:py-2 rounded-full transition-all hover:shadow-md whitespace-nowrap"
            >
              {t("book")}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden w-11 h-11 flex items-center justify-center text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setOpen(!open)}
              aria-label={t("toggleMenu")}
              aria-expanded={open}
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center text-gray-700 font-medium min-h-11 py-2"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`/${locale}/driving-guide`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-[#C05232] font-bold min-h-11 py-2 border-t border-gray-100 mt-2 pt-3"
          >
            <Map className="w-4 h-4" aria-hidden="true" />
            {t("drivingGuide")}
          </a>
          <Link
            href={`/${locale}/dashboard`}
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-[#1B4F72] font-semibold min-h-11 py-2"
          >
            <User className="w-4 h-4" aria-hidden="true" />
            {t("myAccount")}
          </Link>
        </div>
      )}
    </nav>
  );
}
