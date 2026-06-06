import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

export function Footer() {
  const t = useTranslations("footer");
  const locale = useLocale();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+529872743477";

  return (
    <footer className="bg-[#1B4F72] text-white">
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
                className="h-14 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-gray-300 text-sm mb-4 max-w-xs">{t("tagline")}</p>
            <p className="text-[#7FB5B5] text-xs">{t("established")}</p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-[#7FB5B5] text-sm uppercase tracking-wide">{t("links")}</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li><a href={`/${locale}#fleet`} className="hover:text-white transition-colors">Our Fleet</a></li>
              <li><a href={`/${locale}#how-it-works`} className="hover:text-white transition-colors">How It Works</a></li>
              <li><a href={`/${locale}#pricing`} className="hover:text-white transition-colors">Pricing</a></li>
              <li><a href={`/${locale}#faq`} className="hover:text-white transition-colors">FAQ</a></li>
              <li><Link href={`/${locale}/book`} className="hover:text-white transition-colors text-[#E8836A] font-semibold">Book Now</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 text-[#7FB5B5] text-sm uppercase tracking-wide">{t("contact")}</h4>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 text-[#7FB5B5] shrink-0" />
                <a
                  href="https://maps.app.goo.gl/Sx4ZJZburo8YdWjE9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Carr. Costera Sur Km 4.3 (Int. Pemex), Cozumel, Q.R.
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#7FB5B5] shrink-0" />
                <span>Mon–Sun · 8:00 AM – 5:00 PM</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#7FB5B5] shrink-0" />
                <a
                  href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  WhatsApp Us
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#7FB5B5] shrink-0" />
                <a href="mailto:hello@buggyrentalsdani.com" className="hover:text-white transition-colors">
                  hello@buggyrentalsdani.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#7FB5B5] shrink-0 text-sm font-bold">IG</span>
                <a
                  href="https://instagram.com/buggywithdani"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  @buggywithdani
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-gray-400">
          <p>© {new Date().getFullYear()} Buggy Rentals with Dani. {t("rights")}</p>
          <div className="flex gap-4">
            <Link href={`/${locale}/terms`} className="hover:text-white transition-colors">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
