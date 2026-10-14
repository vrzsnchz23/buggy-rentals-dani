import { useTranslations } from "next-intl";
import Image from "next/image";
import { MapPin, Clock, MessageCircle, Navigation } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { SectionWave } from "@/components/ui/SectionWave";

const WHATSAPP = "529872743477";

export function Location() {
  const t = useTranslations("location");

  return (
    <section id="location" className="on-dark pt-12 pb-20 sm:pt-16 sm:pb-24 bg-[#1B4F72] relative overflow-hidden">

      {/* Background dots */}
      <div className="absolute inset-0 opacity-5" aria-hidden="true"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Decorative mark — bottom-left corner, desktop only */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none buggy-float hidden lg:block"
           style={{ width: "320px", marginLeft: "-30px", marginBottom: "-20px", opacity: 0.5 }}
           aria-hidden="true">
        <Image
          src="/images/buggy12.png"
          alt=""
          width={320}
          height={320}
          sizes="320px"
          className="brightness-0 invert"
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <SectionHeading tone="dark" eyebrow={t("badge")} title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch" data-reveal>

          {/* Map — 3 cols */}
          <div className="lg:col-span-3 relative flex flex-col">
            <div className="rounded-3xl overflow-hidden shadow-2xl flex-1" style={{ minHeight: "420px" }}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d934.4266246801086!2d-86.97363803044728!3d20.477244598814863!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8f4e57c063bfbbf1%3A0x8c33a6983056b7f4!2sBuggy%20Rentals%20With%20Dani!5e0!3m2!1sen!2smx!4v1780684091536!5m2!1sen!2smx"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={t("mapTitle")}
              />
            </div>

            {/* Floating address card */}
            <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-4 flex items-center justify-between gap-3 shadow-xl">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-[#1B4F72] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="font-black text-[#1B4F72] text-sm truncate">{t("businessName")}</p>
                  <p className="text-[#5A616B] text-xs truncate">{t("addressShort")}</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#C05232] text-white text-xs font-bold px-3 min-h-11 rounded-xl hover:bg-[#A8411F] transition-colors shrink-0"
              >
                <Navigation className="w-3 h-3" aria-hidden="true" /> {t("navigate")}
              </a>
            </div>
          </div>

          {/* Info cards — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4 h-full">

            {/* Hours */}
            <div className="bg-[#C05232] rounded-3xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" aria-hidden="true" />
              <div>
                <Clock className="w-8 h-8 text-white mb-3" aria-hidden="true" />
                <h3 className="font-black text-white text-xl mb-1">{t("openEveryDay")}</h3>
                <p className="text-white text-sm">{t("monSun")}</p>
              </div>
              <div className="bg-white/20 rounded-2xl px-4 py-3 inline-block mt-4">
                <span className="text-white font-black text-2xl">{t("hoursValue")}</span>
              </div>
            </div>

            {/* Meeting point */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/15 transition-colors flex-1">
              <div className="w-11 h-11 rounded-xl bg-[#7FB5B5]/25 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#A8D5D5]" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t("meetingPoint")}</h3>
                <p className="text-[#D6DEE8] text-sm leading-relaxed">{t("meetingDesc")}</p>
              </div>
            </div>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t("whatsappPrefill"))}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#157038] hover:bg-[#0F5F2B] rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-900/30 group flex-1"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-white fill-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-white text-base">{t("chatWhatsapp")}</h3>
                <p className="text-white/90 text-sm">{t("replyMinutes")}</p>
              </div>
              <span className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all text-xl" aria-hidden="true">→</span>
            </a>

          </div>
        </div>
      </div>

      {/* Into the cream FAQ below. */}
      <SectionWave next="#F5F0EB" />
    </section>
  );
}
