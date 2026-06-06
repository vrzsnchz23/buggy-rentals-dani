import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Check, Wind, Thermometer } from "lucide-react";

const BUGGY_PERKS = [
  { icon: "🛡️", label: "Liability insurance" },
  { icon: "👥", label: "Up to 5 per buggy" },
  { icon: "⛽", label: "Full tank · return full" },
  { icon: "💬", label: "WhatsApp support" },
  { icon: "🏨", label: "Hotel delivery" },
  { icon: "✅", label: "No hidden fees" },
];

const COMPACT_PERKS = [
  { icon: "❄️", label: "Air conditioning" },
  { icon: "🛡️", label: "Liability insurance" },
  { icon: "👥", label: "Up to 5 people" },
  { icon: "⛽", label: "Full tank · return full" },
  { icon: "💬", label: "WhatsApp support" },
  { icon: "🏨", label: "Hotel delivery" },
];

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#E8836A]/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/6 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-14">
          <span className="inline-block bg-[#E8836A]/10 text-[#E8836A] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Pricing
          </span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        {/* Cards — same visual weight, different personality */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">

          {/* Buggy — navy + coral accent */}
          <div className="rounded-3xl overflow-hidden bg-[#1B4F72] relative">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-[#E8836A]/20 blur-2xl" />
            {/* Buggy image — floating top-right */}
            <div className="absolute top-0 right-0 w-56 h-44 pointer-events-none select-none">
              <Image src="/images/buggy15.png" alt="Open-Air Buggy" fill className="object-contain object-right-top drop-shadow-2xl" />
            </div>
            <div className="p-8 sm:p-10 relative">
              <div className="inline-flex items-center gap-1.5 bg-[#E8836A] text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                <Wind className="w-3 h-3" /> Open-Air Adventure
              </div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-8xl font-black text-white leading-none">$75</span>
                <div className="pb-2">
                  <div className="text-[#7FB5B5] font-semibold text-sm">USD / day</div>
                  <div className="text-[#7FB5B5] font-semibold text-sm">per buggy</div>
                </div>
              </div>
              <p className="text-white/50 text-sm mb-8">
                Secure with just a <span className="text-[#E8836A] font-bold">$25 deposit</span> online.
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {BUGGY_PERKS.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white/8 rounded-xl px-3 py-2.5">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-white/80 text-sm font-medium">{p.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5 w-full"
              >
                Book Buggy — $75/day →
              </Link>
              <p className="text-white/30 text-xs text-center mt-3">No credit card required · Free cancellation 48h before</p>
            </div>
          </div>

          {/* Compact — navy + teal accent */}
          <div className="rounded-3xl overflow-hidden bg-[#1B4F72] relative">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute -top-12 -left-12 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
            {/* Compact image — floating top-right */}
            <div className="absolute top-0 right-0 w-56 h-44 pointer-events-none select-none">
              <Image src="/images/buggy13.png" alt="Compact Car" fill className="object-contain object-right-top drop-shadow-2xl" />
            </div>
            <div className="p-8 sm:p-10 relative">
              <div className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-3 py-1.5 rounded-full mb-6">
                <Thermometer className="w-3 h-3" /> A/C Comfort
              </div>
              <div className="flex items-end gap-3 mb-2">
                <span className="text-8xl font-black text-white leading-none">$65</span>
                <div className="pb-2">
                  <div className="text-[#7FB5B5] font-semibold text-sm">USD / day</div>
                  <div className="text-[#7FB5B5] font-semibold text-sm">per car</div>
                </div>
              </div>
              <p className="text-white/50 text-sm mb-8">
                Secure with just a <span className="text-[#E8836A] font-bold">$25 deposit</span> online.
              </p>
              <div className="grid grid-cols-2 gap-2.5 mb-8">
                {COMPACT_PERKS.map((p, i) => (
                  <div key={i} className="flex items-center gap-2.5 bg-white/8 rounded-xl px-3 py-2.5">
                    <span className="text-lg">{p.icon}</span>
                    <span className="text-white/80 text-sm font-medium">{p.label}</span>
                  </div>
                ))}
              </div>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center bg-white hover:bg-gray-100 text-[#1B4F72] font-black text-lg py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 w-full"
              >
                Book Compact — $65/day →
              </Link>
              <p className="text-white/30 text-xs text-center mt-3">No credit card required · Free cancellation 48h before</p>
            </div>
          </div>
        </div>

        {/* Mix & match note */}
        <div className="bg-[#F5F0EB] rounded-2xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🚗</span>
            <span className="text-lg font-black text-[#1B4F72]">+</span>
            <span className="text-2xl">🚙</span>
          </div>
          <p className="font-bold text-[#1B4F72] mb-1">Mix & match in one booking</p>
          <p className="text-gray-500 text-sm">Book buggies and compact cars together in a single reservation. One group, one payment, one confirmation.</p>
          <div className="flex flex-wrap justify-center gap-3 mt-4 text-sm text-gray-500">
            {["Liability insurance", "Full tank on pickup", "Hotel delivery available", "WhatsApp support"].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#7FB5B5]" strokeWidth={3} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
