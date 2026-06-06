import { useTranslations } from "next-intl";
import Image from "next/image";
import { MapPin, Clock, MessageCircle, Navigation } from "lucide-react";

export function Location() {
  const t = useTranslations("location");

  return (
    <section id="location" className="py-24 bg-[#1B4F72] relative overflow-hidden">

      {/* Background dots */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />

      {/* Buggy12 logo — decoración esquina inferior izquierda */}
      <div className="absolute bottom-0 left-0 pointer-events-none select-none buggy-float"
           style={{ width: "320px", marginLeft: "-30px", marginBottom: "-20px", opacity: 0.5 }}>
        <Image
          src="/images/buggy12.png"
          alt=""
          width={320}
          height={320}
          className="w-full h-auto brightness-0 invert"
        />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-white/10 text-[#7FB5B5] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Find Us
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">{t("title")}</h2>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch">

          {/* Map — takes 3 cols */}
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
                title="Buggy Rentals with Dani location"
              />
            </div>

            {/* Floating address card */}
            <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-4 shadow-xl flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#1B4F72] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-[#1B4F72] text-sm">Buggy Rentals With Dani</p>
                  <p className="text-gray-400 text-xs">Carr. Costera Sur Km 4.3 · Int. Pemex</p>
                </div>
              </div>
              <a
                href="https://maps.app.goo.gl/QYZiN1rf1vXbhR8g8"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#E8836A] text-white text-xs font-bold px-3 py-2 rounded-xl hover:bg-[#d4724f] transition-colors shrink-0"
              >
                <Navigation className="w-3 h-3" /> Navigate
              </a>
            </div>
          </div>

          {/* Info cards — 2 cols */}
          <div className="lg:col-span-2 flex flex-col gap-4 h-full">

            {/* Hours — big highlight card, flex-1 to grow */}
            <div className="bg-[#E8836A] rounded-3xl p-6 relative overflow-hidden flex-1 flex flex-col justify-between">
              <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
              <div>
                <Clock className="w-8 h-8 text-white mb-3" />
                <h3 className="font-black text-white text-xl mb-1">Open Every Day</h3>
                <p className="text-white/80 text-sm">Monday – Sunday</p>
              </div>
              <div className="bg-white/20 rounded-2xl px-4 py-3 inline-block mt-4">
                <span className="text-white font-black text-2xl">8:00 AM – 5:00 PM</span>
              </div>
            </div>

            {/* Meeting point — flex-1 */}
            <div className="bg-white/8 border border-white/10 rounded-2xl p-5 flex items-center gap-4 hover:bg-white/12 transition-colors flex-1">
              <div className="w-11 h-11 rounded-xl bg-[#7FB5B5]/20 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-[#7FB5B5]" />
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{t("meetingPoint")}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{t("meetingDesc")}</p>
              </div>
            </div>

            {/* WhatsApp — flex-1 */}
            <a
              href="https://wa.me/529872743477?text=Hi!%20I'm%20interested%20in%20renting%20a%20buggy%20in%20Cozumel%20🚗"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#25D366] hover:bg-[#1ebe5d] rounded-2xl p-5 flex items-center gap-4 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-green-500/20 group flex-1"
            >
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-white fill-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-black text-white text-base">Chat on WhatsApp</h3>
                <p className="text-white/70 text-sm">(+52) 987-274-3477 · We reply in minutes!</p>
              </div>
              <span className="text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all text-xl">→</span>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}
