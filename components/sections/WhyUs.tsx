import { useTranslations } from "next-intl";
import Image from "next/image";
import { MapPin, DollarSign, Clock, Car } from "lucide-react";

const icons = [MapPin, DollarSign, Clock, Car];

const colors = [
  { bg: "bg-[#1B4F72]", light: "bg-[#1B4F72]/10", text: "text-[#1B4F72]", border: "border-[#1B4F72]" },
  { bg: "bg-[#E8836A]", light: "bg-[#E8836A]/10", text: "text-[#E8836A]", border: "border-[#E8836A]" },
  { bg: "bg-[#7FB5B5]", light: "bg-[#7FB5B5]/10", text: "text-[#7FB5B5]", border: "border-[#7FB5B5]" },
  { bg: "bg-[#1B4F72]", light: "bg-[#1B4F72]/10", text: "text-[#1B4F72]", border: "border-[#1B4F72]" },
];

export function WhyUs() {
  const t = useTranslations("whyUs");
  const items = t.raw("items") as Array<{ title: string; desc: string }>;

  return (
    <section id="why-us" className="pt-16 pb-20 bg-[#F5F0EB] relative overflow-hidden">

      {/* Decorative background circles */}
      <div className="absolute top-10 right-0 w-72 h-72 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-56 h-56 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

      {/* Buggy9 decorativo — esquina inferior izquierda */}
      <div
        className="absolute bottom-0 left-0 pointer-events-none select-none buggy-enter"
        style={{ width: "308px", marginLeft: "-60px", marginBottom: "-40px", opacity: 0.92 }}
      >
        <div className="buggy-float">
          <Image
            src="/images/buggy9.png"
            alt=""
            width={308}
            height={308}
            className="w-full h-auto"
          />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-[#E8836A]/15 text-[#E8836A] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Why us
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
                className="group relative bg-white rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden border border-gray-100"
              >
                {/* Accent corner */}
                <div className={`absolute top-0 right-0 w-20 h-20 ${color.bg} opacity-5 rounded-bl-full transition-all duration-300 group-hover:opacity-10 group-hover:w-28 group-hover:h-28`} />

                {/* Number */}
                <div className={`text-5xl font-black ${color.text} opacity-10 absolute top-3 right-4 leading-none select-none`}>
                  {String(i + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl ${color.light} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${color.text}`} />
                </div>

                {/* Content */}
                <h3 className="font-black text-[#1B4F72] text-lg mb-2 leading-tight">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>

                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-0 h-1 ${color.bg} w-0 group-hover:w-full transition-all duration-500 rounded-b-2xl`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
