"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

const reactions = [
  { max: 10, emoji: "🤯", text: "That's basically free. You're practically stealing." },
  { max: 15, emoji: "😱", text: "Less than ONE cocktail at the resort. Per person. All day." },
  { max: 20, emoji: "🎉", text: "Cheaper than a taxi to the beach. And way more fun." },
  { max: 30, emoji: "😄", text: "Still way less than a boring guided tour. Just saying." },
  { max: 999, emoji: "👍", text: "Still an amazing deal for a full day of freedom." },
];

export function PriceCalculator() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [people, setPeople] = useState(4);
  const [buggies, setBuggies] = useState(1);

  const total = buggies * 75;
  const perPerson = Math.ceil(total / people);
  const reaction = reactions.find((r) => perPerson <= r.max)!;

  return (
    <div className="bg-[#1B4F72] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
      {/* bg dots */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#E8836A]/20 blur-3xl pointer-events-none" />

      <div className="relative">
        <div className="text-center mb-8">
          <span className="inline-block bg-[#E8836A] text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            🧮 {isEs ? "Calculadora de precio" : "Price Calculator"}
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white">
            {isEs ? "¿Cuánto sale por persona?" : "How much per person?"}
          </h3>
          <p className="text-white/50 text-sm mt-2">
            {isEs ? "La respuesta te va a sorprender 👇" : "The answer might surprise you 👇"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          {/* People */}
          <div className="bg-white/10 rounded-2xl p-5">
            <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-3">
              👥 {isEs ? "Personas en tu grupo" : "People in your group"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {[2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setPeople(n)}
                  className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${
                    people === n
                      ? "bg-[#E8836A] text-white scale-110 shadow-lg"
                      : "bg-white/15 text-white/70 hover:bg-white/25"
                  }`}
                >
                  {n}
                </button>
              ))}
              <div className="flex items-center text-white/40 text-sm ml-1">
                {isEs ? "personas" : "people"}
              </div>
            </div>
          </div>

          {/* Buggies */}
          <div className="bg-white/10 rounded-2xl p-5">
            <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-3">
              🚗 {isEs ? "Buggies a rentar" : "Buggies to rent"}
            </label>
            <div className="flex gap-2 flex-wrap">
              {[1, 2, 3].map((n) => (
                <button
                  key={n}
                  onClick={() => setBuggies(n)}
                  className={`w-12 h-12 rounded-xl font-black text-lg transition-all ${
                    buggies === n
                      ? "bg-[#E8836A] text-white scale-110 shadow-lg"
                      : "bg-white/15 text-white/70 hover:bg-white/25"
                  }`}
                >
                  {n}
                </button>
              ))}
              <div className="flex items-center text-white/40 text-sm ml-1">
                × $75
              </div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div className="bg-white/10 rounded-2xl p-6 text-center mb-6 border border-white/20">
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                {isEs ? "Total del día" : "Total for the day"}
              </div>
              <div className="text-4xl font-black text-white">${total}</div>
            </div>
            <div className="text-white/30 text-3xl font-thin hidden sm:block">÷</div>
            <div className="text-white/30 text-2xl font-black sm:hidden">÷ {people} =</div>
            <div>
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                {isEs ? "personas" : "people"}
              </div>
              <div className="text-4xl font-black text-white">{people}</div>
            </div>
            <div className="text-white/30 text-3xl font-thin hidden sm:block">=</div>
            <div>
              <div className="text-[#E8836A] text-xs font-bold uppercase tracking-widest mb-1">
                {isEs ? "por persona" : "per person"}
              </div>
              <div className="text-6xl font-black text-[#E8836A] leading-none">${perPerson}</div>
            </div>
          </div>

          {/* Reaction */}
          <div className="mt-5 flex items-center justify-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <span className="text-2xl">{reaction.emoji}</span>
            <p className="text-white font-semibold text-sm text-left">{reaction.text}</p>
          </div>
        </div>

        <Link
          href={`/${locale}/book`}
          className="flex items-center justify-center gap-2 bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5 w-full"
        >
          {isEs ? `Reservar ${buggies} buggy${buggies > 1 ? "s" : ""} — $${total} total →` : `Book ${buggies} buggy${buggies > 1 ? "s" : ""} — $${total} total →`}
        </Link>
      </div>
    </div>
  );
}
