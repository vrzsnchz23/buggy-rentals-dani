"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const other = locale === "en" ? "es" : "en";
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}#fleet`, label: t("fleet") },
    { href: `/${locale}#how-it-works`, label: locale === "es" ? "Cómo Funciona" : "How It Works" },
    { href: `/${locale}/pricing`, label: locale === "es" ? "Precios" : "Pricing" },
    { href: `/${locale}/blog`, label: "Blog" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={`/${locale}#`} className="flex items-center" scroll={false} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <Image
              src="/logo.png"
              alt="Buggy Rentals with Dani"
              width={180}
              height={48}
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-gray-600 hover:text-[#1B4F72] font-medium text-sm transition-colors"
              >
                {l.label}
              </a>
            ))}
            {/* Driving Guide — coral, separated */}
            <a
              href={`/${locale}/driving-guide`}
              className="text-[#E8836A] hover:text-[#d4724f] font-bold text-sm transition-colors border-l border-gray-200 pl-6"
            >
              🗺️ {locale === "es" ? "Guía de Manejo" : "Driving Guide"}
            </a>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Language toggle */}
            <Link
              href={`/${other}`}
              className="text-xs font-semibold text-gray-500 hover:text-[#1B4F72] border border-gray-200 rounded-full px-2.5 py-1 transition-colors"
            >
              {other.toUpperCase()}
            </Link>

            {/* CTA */}
            <Link
              href={`/${locale}/book`}
              className="hidden sm:inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-bold text-sm px-4 py-2 rounded-full transition-all hover:shadow-md"
            >
              {t("book")}
            </Link>

            {/* Mobile menu */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block text-gray-700 font-medium py-1.5"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`/${locale}/driving-guide`}
            onClick={() => setOpen(false)}
            className="block text-[#E8836A] font-bold py-1.5 border-t border-gray-100 pt-3"
          >
            🗺️ {locale === "es" ? "Guía de Manejo" : "Driving Guide"}
          </a>
          <Link
            href={`/${locale}/book`}
            onClick={() => setOpen(false)}
            className="block w-full text-center bg-[#E8836A] text-white font-bold py-3 rounded-full mt-2"
          >
            {t("book")}
          </Link>
        </div>
      )}
    </nav>
  );
}
