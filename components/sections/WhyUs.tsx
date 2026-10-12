import { useTranslations, useLocale } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { MapPin, DollarSign, Clock, Car } from "lucide-react";

const icons = [MapPin, DollarSign, Clock, Car];

const colors = [
  { light: "bg-[#1B4F72]/10", text: "text-[#1B4F72]", border: "border-[#1B4F72]" },
  { light: "bg-[#C05232]/10", text: "text-[#C05232]", border: "border-[#C05232]" },
  { light: "bg-[#7FB5B5]/20", text: "text-[#3F7878]", border: "border-[#7FB5B5]" },
  { light: "bg-[#1B4F72]/10", text: "text-[#1B4F72]", border: "border-[#1B4F72]" },
];

export function WhyUs() {
  const t = useTranslations("whyUs");
  const locale = useLocale();
  const items = t.raw("items") as Array<{ title: string; desc: string }>;

  return (
    <section id="why-us" className="pt-20 pb-24 sm:pt-24 sm:pb-32 bg-[#F5F0EB] relative overflow-hidden">

      {/* Decorative background circles */}
      <div className="absolute top-10 right-0 w-72 h-72 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      {/* Decorative buggy — bottom-left corner. Hidden on small screens where
          it only collided with the card grid. */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none select-none buggy-enter hidden lg:block"
        style={{ width: "308px", marginLeft: "-60px", marginBottom: "-40px", opacity: 0.92 }}
        aria-hidden="true"
      >
        <div className="buggy-float">
          <Image
            src="/images/buggy9.png"
            alt=""
            width={308}
            height={308}
            sizes="308px"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14 sm:mb-16" data-reveal>
          <span className="inline-block bg-[#C05232]/12 text-[#9B3A1A] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">{t("subtitle")}</p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item, i) => {
            const Icon = icons[i];
            const color = colors[i];
            return (
              <div
                key={i}
                data-reveal
                style={{ transitionDelay: `${i * 70}ms` }}
                className={`group bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 border-t-[3px] ${color.border}`}
              >
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${color.light} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${color.text}`} aria-hidden="true" />
                </div>

                {/* Content */}
                <h3 className="font-black text-[#1B4F72] text-lg mb-2 leading-tight">{item.title}</h3>
                <p className="text-[#5A616B] text-sm leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14" data-reveal>
          <Link
            href={`/${locale}/book`}
            className="inline-flex items-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-lg px-12 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#C05232]/30 hover:-translate-y-1"
          >
            {t("cta")} →
          </Link>
          <p className="text-[#5A616B] text-sm mt-3">{t("ctaNote")}</p>
        </div>
      </div>
    </section>
  );
}
