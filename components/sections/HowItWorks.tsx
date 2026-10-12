import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

function CustomerBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end mb-2">
      <div className="bg-white text-gray-700 text-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%] shadow-sm leading-relaxed">
        {text}
      </div>
    </div>
  );
}

function DaniBubble({ text, time }: { text: string | React.ReactNode; time?: string }) {
  return (
    <div className="flex items-end gap-2 mb-2">
      <div className="w-7 h-7 rounded-full bg-[#1B4F72] shrink-0 mb-0.5 overflow-hidden flex items-center justify-center">
        <span className="text-white text-xs font-black" aria-hidden="true">D</span>
      </div>
      <div className="bg-[#DCF8C6] text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[75%] shadow-sm leading-relaxed relative">
        {text}
        {time && (
          <span className="block text-right text-[10px] text-gray-500 mt-1 -mb-0.5">{time} ✓✓</span>
        )}
      </div>
    </div>
  );
}

const STEP_COLORS = ["#3F7878", "#C05232", "#1B4F72"];

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  const steps = t.raw("steps") as Array<{ step: string; title: string; desc: string; detail: string }>;

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-[#F5F0EB] relative overflow-hidden">

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="text-center mb-14" data-reveal>
          <span className="inline-block bg-[#1B4F72]/10 text-[#1B4F72] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {t("badge")}
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1B4F72] mb-3">{t("title")}</h2>
          <p className="text-[#5A616B] text-lg">{t("subtitle")}</p>
        </div>

        {/* Two-column layout: chat on left, steps on right */}
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">

          {/* WhatsApp chat mockup — decorative illustration of the real flow */}
          <div className="w-full max-w-sm shrink-0" data-reveal>
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-black/10" style={{ background: "#ECE5DD" }}>

              {/* WhatsApp header */}
              <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm" aria-hidden="true">D</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm leading-tight">{t("chatName")}</div>
                  <div className="text-white/80 text-xs">{t("chatBusiness")}</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" aria-hidden="true" />
                  <span className="text-white/80 text-xs">{t("chatOnline")}</span>
                </div>
              </div>

              {/* Chat area */}
              <div className="px-3 py-4 space-y-1 min-h-[380px] flex flex-col justify-end"
                   style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23000' fill-opacity='0.03'/%3E%3C/svg%3E\")" }}>

                <div className="flex justify-center mb-3">
                  <span className="bg-white/80 text-gray-600 text-xs px-3 py-1 rounded-full shadow-sm">
                    {t("chatToday")}
                  </span>
                </div>

                <CustomerBubble text={t("chatCustomer1")} />
                <DaniBubble text={t("chatDani1")} />
                <CustomerBubble text={t("chatCustomer2")} />
                <DaniBubble text={t("chatDani2")} time="8:14" />
              </div>

              {/* Input bar */}
              <div className="bg-[#F0F0F0] px-3 py-2.5 flex items-center gap-2 border-t border-black/5">
                <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-500">
                  {t("chatPlaceholder")}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#075E54] flex items-center justify-center shrink-0" aria-hidden="true">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-center text-[#5A616B] text-xs mt-4 italic">{t("chatFootnote")}</p>
          </div>

          {/* Steps on the right */}
          <div className="flex flex-col gap-6 max-w-md w-full">
            {steps.map((s, i) => {
              const color = STEP_COLORS[i];
              return (
                <div key={i} className="flex gap-4 items-start" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                  <div
                    className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center font-black text-white text-sm mt-0.5"
                    style={{ background: color }}
                    aria-hidden="true"
                  >
                    {s.step}
                  </div>
                  <div>
                    <h3 className="font-black text-[#1B4F72] text-lg leading-tight mb-1">{s.title}</h3>
                    <p className="text-[#5A616B] text-sm leading-relaxed mb-2">{s.desc}</p>
                    <span className="inline-flex items-center gap-1.5 text-xs text-[#5A616B] bg-white rounded-full px-3 py-1 border border-gray-200">
                      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: color }} aria-hidden="true" />
                      {s.detail}
                    </span>
                  </div>
                </div>
              );
            })}

            <div data-reveal>
              <Link
                href={`/${locale}/book`}
                className="mt-2 inline-flex items-center justify-center bg-[#C05232] hover:bg-[#A8411F] text-white font-black text-base px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-[#C05232]/30 hover:-translate-y-0.5"
              >
                {t("cta")} →
              </Link>
              <p className="text-[#5A616B] text-xs mt-3">{t("ctaNote")}</p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
