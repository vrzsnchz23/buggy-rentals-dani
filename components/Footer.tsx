import Link from "next/link";
import { BUSINESS } from "@/lib/business";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

function InstagramIcon({ className }: { className?: string }) {
  // lucide dropped brand glyphs, so this one is inline.
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+529872743477";

  return (
    <footer className="on-dark bg-[#1B4F72] text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="mb-4">
              <Image
                src="/logo.png"
                alt="Buggy Rentals with Dani"
                width={200}
                height={54}
                sizes="200px"
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-[#CBD5E1] text-sm mb-4 max-w-xs">{t("tagline")}</p>
            <p className="text-[#A8D5D5] text-xs">{t("established")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-bold mb-4 text-[#A8D5D5] text-sm uppercase tracking-wide">{t("links")}</h2>
            <ul className="space-y-1 text-sm text-[#CBD5E1]">
              <li><a href={`/${locale}#fleet`} className="flex items-center min-h-11 hover:text-white transition-colors">{t("ourFleet")}</a></li>
              <li><a href={`/${locale}#how-it-works`} className="flex items-center min-h-11 hover:text-white transition-colors">{t("howItWorks")}</a></li>
              {/* Was /#pricing — that anchor lives on the Pricing page, not the home page. */}
              <li><Link href={`/${locale}/pricing`} className="flex items-center min-h-11 hover:text-white transition-colors">{t("pricing")}</Link></li>
              <li><a href={`/${locale}#faq`} className="flex items-center min-h-11 hover:text-white transition-colors">{t("faq")}</a></li>
              <li><Link href={`/${locale}/book`} className="flex items-center min-h-11 hover:text-white transition-colors text-[#F7B9A6] font-semibold">{t("bookNow")}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h2 className="font-bold mb-4 text-[#A8D5D5] text-sm uppercase tracking-wide">{t("contact")}</h2>
            <ul className="space-y-2 text-sm text-[#CBD5E1]">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-3.5 text-[#A8D5D5] shrink-0" aria-hidden="true" />
                <a
                  href={BUSINESS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center min-h-11 hover:text-white transition-colors"
                >
                  Carr. Costera Sur Km 4.3 (Int. Pemex), Cozumel, Q.R.
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A8D5D5] shrink-0" aria-hidden="true" />
                <span>{t("hoursValue")}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A8D5D5] shrink-0" aria-hidden="true" />
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center min-h-11 hover:text-white transition-colors"
                >
                  {t("whatsappUs")}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#A8D5D5] shrink-0" aria-hidden="true" />
                <a href="mailto:dani@buggycozumel.com" className="flex items-center min-h-11 hover:text-white transition-colors">
                  dani@buggycozumel.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <InstagramIcon className="w-4 h-4 text-[#A8D5D5] shrink-0" />
                <a
                  href="https://instagram.com/buggywithdani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center min-h-11 hover:text-white transition-colors"
                >
                  @buggywithdani
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/15 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-[#CBD5E1]">
          <p>© {new Date().getFullYear()} Buggy Rentals with Dani. {t("rights")}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/terms`} className="flex items-center min-h-11 hover:text-white transition-colors">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
