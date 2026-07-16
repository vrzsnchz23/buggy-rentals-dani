"use client";
import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { ChevronDown, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const emojis = ["🪪", "🚢", "🌧️", "👨‍👩‍👧‍👦", "🛡️", "🏨"];

export function FAQ() {
  const t = useTranslations("faq");
  const locale = useLocale();
  const items = t.raw("items") as Array<{ q: string; a: string }>;
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section id="faq" className="py-32 bg-[#F5F0EB] relative overflow-hidden">

      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#1B4F72]/5 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E8836A]/5 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block bg-[#1B4F72]/10 text-[#1B4F72] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="section-title">{t("title")}</h2>
          <p className="section-subtitle">Everything you need to know before booking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — accordion */}
          <div className="lg:col-span-2 space-y-3">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div
                  key={i}
                  className={cn(
                    "rounded-2xl transition-all duration-300 overflow-hidden",
                    isOpen
                      ? "bg-[#1B4F72] shadow-xl shadow-[#1B4F72]/20"
                      : "bg-white hover:shadow-md"
                  )}
                >
                  <button
                    className="w-full flex items-center gap-4 p-5 text-left"
                    onClick={() => setOpen(isOpen ? null : i)}
                  >
                    {/* Emoji badge */}
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg transition-all",
                      isOpen ? "bg-white/15" : "bg-[#F5F0EB]"
                    )}>
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
                    )}>
                      <ChevronDown className={cn("w-4 h-4 transition-colors", isOpen ? "text-white" : "text-gray-400")} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pl-[72px]">
                      <p className="text-white/80 text-sm leading-relaxed">{item.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right — sticky CTA panel */}
          <div className="flex flex-col gap-4">

            {/* Still have questions card */}
            <div className="bg-[#1B4F72] rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-28 h-28 rounded-full bg-[#7FB5B5]/20" />
              <div className="text-4xl mb-3">🤔</div>
              <h3 className="font-black text-white text-lg mb-2">Still have questions?</h3>
              <p className="text-gray-400 text-sm mb-5">We're happy to help — reach us on WhatsApp and we'll reply in minutes.</p>
              <a
                href="https://wa.me/529872743477?text=Hi!%20I%20have%20a%20question%20about%20buggy%20rentals%20in%20Cozumel"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold py-3 px-5 rounded-xl transition-all hover:-translate-y-0.5 w-full"
              >
                <MessageCircle className="w-4 h-4 fill-white stroke-none" />
                Chat on WhatsApp
              </a>
            </div>

            {/* Quick book card */}
            <div className="bg-[#E8836A] rounded-2xl p-6 text-center relative overflow-hidden">
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-full bg-white/10" />
              <div className="text-4xl mb-3">🚗</div>
              <h3 className="font-black text-white text-lg mb-2">Ready to explore?</h3>
              <p className="text-white/80 text-sm mb-5">Book your buggy in under 3 minutes. Just $75/day.</p>
              <Link
                href={`/${locale}/book`}
                className="flex items-center justify-center gap-2 bg-white text-[#E8836A] font-black py-3 px-5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg w-full"
              >
                Book Now →
              </Link>
            </div>

            {/* Fun fact */}
            <div className="bg-white rounded-2xl p-5 flex items-start gap-3 border border-gray-100">
              <span className="text-2xl">🏝️</span>
              <p className="text-gray-500 text-sm leading-relaxed">
                <strong className="text-[#1B4F72]">Fun fact:</strong> You can drive around the entire island of Cozumel in about 2 hours in a buggy!
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
