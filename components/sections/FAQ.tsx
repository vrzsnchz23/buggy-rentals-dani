"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown, MessageCircle, HelpCircle, Car, Palmtree } from "lucide-react";
import { SectionHeading } from "@/components/SectionHeading";
import { cn } from "@/lib/utils";
import Link from "next/link";

const emojis = ["🪪", "🚢", "🌧️", "👨‍👩‍👧‍👦", "🛡️", "🏨"];
const WHATSAPP = "529872743477";

export function FAQ() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const items = t.raw("items") as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="pt-12 pb-14 sm:pt-16 sm:pb-20 bg-[#F5F0EB] relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#1B4F72]/5 blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8836A]/5 blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <SectionHeading eyebrow={t("badge")} title={t("title")} subtitle={t("subtitle")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — accordion */}
          <div className="lg:col-span-2 space-y-3" data-reveal>
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl transition-all duration-300 overflow-hidden",
                    isOpen
                      ? "on-dark bg-[#1B4F72] shadow-xl shadow-[#1B4F72]/20"
                      : "bg-white hover:shadow-md"
                  )}
                >
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    id={`faq-question-${i}`}
                  >
                    {/* Emoji badge */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg transition-all",
                      isOpen ? "bg-white/15" : "bg-[#F5F0EB]"
                    )} aria-hidden="true">
                      {emojis[i] || "❓"}
                    </div>

                    <span className={cn(
                      "font-bold flex-1 text-base",
                      isOpen ? "text-white" : "text-[#1B4F72]"
                    )}>
                      {item.q}
                    </span>

                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all",
                      isOpen ? "bg-white/20 rotate-180" : "bg-[#F5F0EB]"
                    )} aria-hidden="true">
                      <ChevronDown className={cn("w-4 h-4 transition-colors", isOpen ? "text-white" : "text-gray-600")} />
                    </div>
                  </button>

                  {isOpen && (
                    <div
                      id={`faq-answer-${i}`}
                      role="region"
                      aria-labelledby={`faq-question-${i}`}
                      className="px-5 pb-5 pl-[72px]"
                    >
                      <p className="text-white/90 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right — CTA panel */}
          <div className="flex flex-col gap-4" data-reveal>

            {/* Still have questions */}
            <div className="on-dark bg-[#1B4F72] rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#7FB5B5]/20" aria-hidden="true" />
              <div className="w-14 h-14 rounded-2xl bg-white/12 border border-white/15 flex items-center justify-center mx-auto mb-4">
                <HelpCircle className="w-7 h-7 text-[#A8D5D5]" aria-hidden="true" />
              </div>
              <h3 className="font-black text-white text-lg mb-2">{t("stillQuestions")}</h3>
              <p className="text-[#CBD5E1] text-sm mb-5">{t("stillQuestionsDesc")}</p>
              <a
                href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(t("whatsappPrefill"))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#157038] hover:bg-[#0F5F2B] text-white font-bold py-3 px-5 rounded-xl transition-all hover:-translate-y-0.5 w-full"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" aria-hidden="true" />
                {t("chatWhatsapp")}
              </a>
            </div>

            {/* Quick book */}
            <div className="bg-[#C05232] rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10" aria-hidden="true" />
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
                <Car className="w-7 h-7 text-white" aria-hidden="true" />
              </div>
              <h3 className="font-black text-white text-lg mb-2">{t("readyTitle")}</h3>
              <p className="text-white text-sm mb-5">{t("readyDesc")}</p>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center gap-2 bg-white text-[#A8411F] font-black py-3 px-5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg w-full"
              >
                {t("readyCta")} →
              </Link>
            </div>

            {/* Fun fact */}
            <div className="bg-white rounded-2xl p-5 flex items-start gap-3 border border-gray-200">
              <Palmtree className="w-6 h-6 text-[#3F7878] shrink-0 mt-0.5" aria-hidden="true" />
              <p className="text-[#5A616B] text-sm leading-relaxed">
                <strong className="text-[#1B4F72]">{t("funFactLabel")}</strong> {t("funFact")}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Into the navy footer below. */}
    </section>
  );
}
