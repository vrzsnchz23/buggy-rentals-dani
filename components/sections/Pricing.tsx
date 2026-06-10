import Link from "next/link";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";

const BUGGY_PERKS = [
  "Liability insurance included",
  "Up to 5 people per buggy",
  "Full tank on pickup · return full",
  "WhatsApp support with Dani",
  "Hotel delivery available",
  "No hidden fees — ever",
];

const COMPACT_PERKS = [
  "Air conditioning",
  "Liability insurance included",
  "Up to 5 people per car",
  "Full tank on pickup · return full",
  "WhatsApp support with Dani",
  "Hotel delivery available",
];

export function Pricing() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <section id="pricing" className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-80 h-80 rounded-full bg-[#E8836A]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/5 blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="text-center mb-14">
          <span className="inline-block bg-[#E8836A]/10 text-[#E8836A] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {isEs ? "Precios" : "Pricing"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1B4F72] mb-3">{t("title")}</h2>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Buggy card — featured, dark */}
          <div className="rounded-3xl overflow-hidden bg-[#0d3251] relative flex flex-col">
            <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
            <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-[#E8836A]/25 blur-3xl pointer-events-none" />

            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden">
              <Image
                src="/images/buggy15.png"
                alt="Open-Air Buggy"
                fill
                className="object-contain object-center scale-110 drop-shadow-2xl"
              />
              {/* Popular badge */}
              <div className="absolute top-4 left-4 bg-[#E8836A] text-white text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-wide shadow-lg">
                ⭐ {isEs ? "Más popular" : "Most popular"}
              </div>
            </div>

            <div className="p-7 sm:p-8 relative flex flex-col flex-1">
              <div className="mb-1">
                <span className="text-[#7FB5B5] text-xs font-bold uppercase tracking-widest">
                  {isEs ? "Buggy descubierto" : "Open-Air Buggy"}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-7xl font-black text-white leading-none">$75</span>
                <span className="text-white/40 text-sm pb-2">{isEs ? "USD / día\npor buggy" : "USD / day\nper buggy"}</span>
              </div>
              <p className="text-white/40 text-sm mb-6">
                {isEs
                  ? <>Asegura con solo <span className="text-[#E8836A] font-bold">$25 de depósito</span>.</>
                  : <>Secure with just a <span className="text-[#E8836A] font-bold">$25 deposit</span>.</>}
              </p>

              <ul className="space-y-2.5 mb-7 flex-1">
                {BUGGY_PERKS.map((p, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-white/70 text-sm">
                    <span className="w-4 h-4 rounded-full bg-[#E8836A]/20 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#E8836A]" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {isEs ? BUGGY_PERKS_ES[i] : p}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-base py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5 w-full"
              >
                {isEs ? "Reservar buggy — $75/día →" : "Book Buggy — $75/day →"}
              </Link>
              <p className="text-white/25 text-xs text-center mt-3">
                {isEs ? "Sin tarjeta · Cancelación gratis 48h antes" : "No credit card · Free cancellation 48h before"}
              </p>
            </div>
          </div>

          {/* Compact card — light, secondary */}
          <div className="rounded-3xl overflow-hidden bg-[#F5F0EB] relative flex flex-col border border-[#e0d8d0]">
            <div className="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-[#7FB5B5]/15 blur-3xl pointer-events-none" />

            {/* Image */}
            <div className="relative h-44 w-full overflow-hidden bg-white/60">
              <Image
                src="/images/buggy13.png"
                alt="Compact Car"
                fill
                className="object-contain object-center scale-110 drop-shadow-xl"
              />
              <div className="absolute top-4 left-4 bg-[#1B4F72]/10 text-[#1B4F72] text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wide border border-[#1B4F72]/15">
                ❄️ {isEs ? "Aire acondicionado" : "A/C Comfort"}
              </div>
            </div>

            <div className="p-7 sm:p-8 relative flex flex-col flex-1">
              <div className="mb-1">
                <span className="text-[#1B4F72]/50 text-xs font-bold uppercase tracking-widest">
                  {isEs ? "Auto compacto" : "Compact Car"}
                </span>
              </div>
              <div className="flex items-end gap-2 mb-1">
                <span className="text-7xl font-black text-[#1B4F72] leading-none">$65</span>
                <span className="text-[#1B4F72]/40 text-sm pb-2">{isEs ? "USD / día\npor auto" : "USD / day\nper car"}</span>
              </div>
              <p className="text-[#1B4F72]/40 text-sm mb-6">
                {isEs
                  ? <>Asegura con solo <span className="text-[#E8836A] font-bold">$25 de depósito</span>.</>
                  : <>Secure with just a <span className="text-[#E8836A] font-bold">$25 deposit</span>.</>}
              </p>

              <ul className="space-y-2.5 mb-7 flex-1">
                {COMPACT_PERKS.map((p, i) => (
                  <li key={i} className="flex items-center gap-2.5 text-[#1B4F72]/60 text-sm">
                    <span className="w-4 h-4 rounded-full bg-[#7FB5B5]/20 flex items-center justify-center shrink-0">
                      <svg className="w-2.5 h-2.5 text-[#7FB5B5]" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                        <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    {isEs ? COMPACT_PERKS_ES[i] : p}
                  </li>
                ))}
              </ul>

              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center bg-[#1B4F72] hover:bg-[#163d5a] text-white font-black text-base py-4 rounded-2xl transition-all hover:shadow-xl hover:shadow-[#1B4F72]/20 hover:-translate-y-0.5 w-full"
              >
                {isEs ? "Reservar compacto — $65/día →" : "Book Compact — $65/day →"}
              </Link>
              <p className="text-[#1B4F72]/25 text-xs text-center mt-3">
                {isEs ? "Sin tarjeta · Cancelación gratis 48h antes" : "No credit card · Free cancellation 48h before"}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

const BUGGY_PERKS_ES = [
  "Seguro de responsabilidad civil",
  "Hasta 5 personas por buggy",
  "Tanque lleno · se devuelve lleno",
  "Soporte WhatsApp con Dani",
  "Entrega en hotel disponible",
  "Sin cargos ocultos — nunca",
];

const COMPACT_PERKS_ES = [
  "Aire acondicionado",
  "Seguro de responsabilidad civil",
  "Hasta 5 personas por auto",
  "Tanque lleno · se devuelve lleno",
  "Soporte WhatsApp con Dani",
  "Entrega en hotel disponible",
];
