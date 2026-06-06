import { useTranslations } from "next-intl";
import Link from "next/link";
import { useLocale } from "next-intl";
import { CalendarDays, UserCheck, CreditCard, Sailboat } from "lucide-react";

const stepIcons = [CalendarDays, UserCheck, CreditCard, Sailboat];
const stepColors = [
  { from: "#1B4F72", to: "#2d6ea0", glow: "rgba(27,79,114,0.35)" },
  { from: "#7FB5B5", to: "#5a9a9a", glow: "rgba(127,181,181,0.35)" },
  { from: "#1B4F72", to: "#2d6ea0", glow: "rgba(27,79,114,0.35)" },
  { from: "#E8836A", to: "#d4724f", glow: "rgba(232,131,106,0.4)" },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  const steps = t.raw("steps") as Array<{ step: string; title: string; desc: string }>;

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#1B4F72]">

      {/* Background texture */}
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block bg-white/10 text-[#7FB5B5] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">{t("title")}</h2>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">

          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-12 left-[14%] right-[14%] h-px"
               style={{ background: "linear-gradient(to right, #7FB5B5, #E8836A)" }} />

          {steps.map((step, i) => {
            const Icon = stepIcons[i];
            const color = stepColors[i];
            const isLast = i === steps.length - 1;

            return (
              <div key={i} className="relative group">
                <div className="bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-2xl p-6 text-center transition-all duration-300 hover:-translate-y-2 h-full">

                  {/* Step number badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white/10 text-white/50 text-xs font-bold px-2 py-0.5 rounded-full border border-white/10">
                      STEP {step.step}
                    </span>
                  </div>

                  {/* Icon circle */}
                  <div
                    className="w-20 h-20 rounded-2xl mx-auto mb-5 flex items-center justify-center relative z-10 transition-transform duration-300 group-hover:scale-110"
                    style={{
                      background: `linear-gradient(135deg, ${color.from}, ${color.to})`,
                      boxShadow: `0 8px 32px ${color.glow}`,
                    }}
                  >
                    <Icon className="w-9 h-9 text-white" />
                  </div>

                  <h3 className={`font-black text-lg mb-3 ${isLast ? "text-[#E8836A]" : "text-white"}`}>
                    {step.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">{step.desc}</p>

                  {/* Arrow on desktop (except last) */}
                  {!isLast && (
                    <div className="hidden md:block absolute -right-3 top-12 text-white/20 text-2xl z-20">›</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-14">
          <Link
            href={`/${locale}/book`}
            className="inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg px-12 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#E8836A]/30 hover:-translate-y-1"
          >
            Reserve Your Buggy Now →
          </Link>
          <p className="text-white/50 text-sm mt-4">Takes less than 3 minutes · No commitment until checkout</p>
        </div>

      </div>
    </section>
  );
}
