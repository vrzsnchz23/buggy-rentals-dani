import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

const stepConfig = [
  {
    emoji: "📲",
    number: "01",
    accent: "#7FB5B5",
    bg: "from-[#7FB5B5]/15 to-[#7FB5B5]/5",
    border: "border-[#7FB5B5]/30",
    numColor: "text-[#7FB5B5]",
  },
  {
    emoji: "💬",
    number: "02",
    accent: "#E8836A",
    bg: "from-[#E8836A]/15 to-[#E8836A]/5",
    border: "border-[#E8836A]/30",
    numColor: "text-[#E8836A]",
  },
  {
    emoji: "🏝️",
    number: "03",
    accent: "#7FB5B5",
    bg: "from-[#7FB5B5]/15 to-[#7FB5B5]/5",
    border: "border-[#7FB5B5]/30",
    numColor: "text-[#7FB5B5]",
  },
];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  const steps = t.raw("steps") as Array<{ step: string; title: string; desc: string; detail: string }>;

  return (
    <section id="how-it-works" className="py-24 relative overflow-hidden bg-[#1B4F72]">

      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="text-center mb-16">
          <span className="inline-block bg-white/10 text-[#7FB5B5] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            Simple Process
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-3">{t("title")}</h2>
          <p className="text-white/50 text-lg">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">

          {/* Connector line desktop */}
          <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px"
               style={{ background: "linear-gradient(to right, #7FB5B5, #E8836A, #7FB5B5)", opacity: 0.3 }} />

          {steps.map((step, i) => {
            const cfg = stepConfig[i];
            return (
              <div key={i} className="relative group">
                <div className={`bg-gradient-to-br ${cfg.bg} border ${cfg.border} rounded-3xl p-7 transition-all duration-300 hover:-translate-y-2 hover:bg-white/10 h-full flex flex-col`}>

                  {/* Top row: number + emoji */}
                  <div className="flex items-start justify-between mb-5">
                    <span className={`text-5xl font-black leading-none ${cfg.numColor} opacity-40 select-none`}>
                      {cfg.number}
                    </span>
                    <span className="text-3xl">{cfg.emoji}</span>
                  </div>

                  <h3 className="font-black text-white text-xl mb-3 leading-tight">
                    {step.title}
                  </h3>
                  <p className="text-white/60 text-sm leading-relaxed flex-1">
                    {step.desc}
                  </p>

                  {/* Detail tag */}
                  <div className="mt-5 inline-flex items-center gap-1.5 bg-white/8 rounded-full px-3 py-1.5 self-start">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.accent }} />
                    <span className="text-white/40 text-xs font-medium">{step.detail}</span>
                  </div>

                </div>

                {/* Arrow between cards on desktop */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-3 top-10 z-20 w-6 h-6 items-center justify-center">
                    <span className="text-white/20 text-xl">›</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-14">
          <Link
            href={`/${locale}/book`}
            className="inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg px-12 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#E8836A]/30 hover:-translate-y-1"
          >
            Reserve Your Buggy Now →
          </Link>
          <p className="text-white/30 text-sm mt-4">Takes less than 3 minutes · No commitment until checkout</p>
        </div>

      </div>
    </section>
  );
}
