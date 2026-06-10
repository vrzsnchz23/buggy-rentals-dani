"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

const reactions = [
  { max: 10, emoji: "🤯", text: { en: "That's basically free. You're practically stealing.", es: "Básicamente te lo están regalando." } },
  { max: 15, emoji: "😱", text: { en: "Less than ONE cocktail at the resort. Per person. All day.", es: "Menos que un cóctel en el resort. Por persona. Todo el día." } },
  { max: 20, emoji: "🎉", text: { en: "Cheaper than a taxi to the beach. And way more fun.", es: "Más barato que un taxi a la playa. Y mucho más divertido." } },
  { max: 30, emoji: "😄", text: { en: "Still way cheaper than any guided tour.", es: "Mucho más barato que cualquier tour guiado." } },
  { max: 999, emoji: "👍", text: { en: "Still a great deal for a full day of freedom.", es: "Sigue siendo un excelente precio por un día completo." } },
];

export function PriceCalculator() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [people, setPeople] = useState(4);

  const buggiesNeeded = Math.ceil(people / 5);
  const total = buggiesNeeded * 75;
  const perPerson = Math.ceil(total / people);
  const reaction = reactions.find((r) => perPerson <= r.max)!;

  return (
    <div className="bg-[#1B4F72] rounded-3xl p-8 sm:p-10 relative overflow-hidden">
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
            {isEs ? "Pon cuántos van y te decimos el resto 👇" : "Tell us how many people, we handle the rest 👇"}
          </p>
        </div>

        {/* People selector */}
        <div className="bg-white/10 rounded-2xl p-5 mb-6">
          <label className="text-white/60 text-xs font-bold uppercase tracking-widest block mb-3">
            👥 {isEs ? "¿Cuántos van en tu grupo?" : "How many people in your group?"}
          </label>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <button
                key={n}
                onClick={() => setPeople(n)}
                className={`w-11 h-11 rounded-xl font-black text-base transition-all ${
                  people === n
                    ? "bg-[#E8836A] text-white scale-110 shadow-lg"
                    : "bg-white/15 text-white/70 hover:bg-white/25"
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Auto result */}
        <div className="bg-white/10 rounded-2xl p-6 mb-6 border border-white/20">
          {/* Buggies needed callout */}
          <div className="flex items-center justify-center gap-2 mb-5 text-sm">
            <span className="text-white/50">
              {people} {isEs ? "personas" : "people"} →
            </span>
            <span className="bg-white/15 text-white font-bold px-3 py-1 rounded-full text-sm">
              {buggiesNeeded} {buggiesNeeded === 1 ? (isEs ? "buggy" : "buggy") : (isEs ? "buggies" : "buggies")}
              {" "}{isEs ? "necesario" + (buggiesNeeded > 1 ? "s" : "") : "needed"}
            </span>
            <span className="text-white/30 text-xs">
              ({isEs ? "hasta 5 por buggy" : "up to 5 per buggy"})
            </span>
          </div>

          <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap">
            <div className="text-center">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                {isEs ? "Total del día" : "Total for the day"}
              </div>
              <div className="text-4xl font-black text-white">${total}</div>
            </div>
            <div className="text-white/30 text-3xl hidden sm:block">÷</div>
            <div className="text-center">
              <div className="text-white/50 text-xs font-bold uppercase tracking-widest mb-1">
                {isEs ? "personas" : "people"}
              </div>
              <div className="text-4xl font-black text-white">{people}</div>
            </div>
            <div className="text-white/30 text-3xl hidden sm:block">=</div>
            <div className="text-center">
              <div className="text-[#E8836A] text-xs font-bold uppercase tracking-widest mb-1">
                {isEs ? "por persona" : "per person"}
              </div>
              <div className="text-6xl font-black text-[#E8836A] leading-none">${perPerson}</div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-2 bg-white/10 rounded-xl px-4 py-3">
            <span className="text-2xl">{reaction.emoji}</span>
            <p className="text-white font-semibold text-sm text-left">
              {isEs ? reaction.text.es : reaction.text.en}
            </p>
          </div>
        </div>

        <Link
          href={`/${locale}/book`}
          className="flex items-center justify-center gap-2 bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5 w-full"
        >
          {isEs
            ? `Reservar — $${total} en total →`
            : `Book Now — $${total} total →`}
        </Link>
        <p className="text-center text-white/30 text-xs mt-3">
          {isEs ? "Solo $25 de depósito · Cancelación gratuita 48h antes" : "Only $25 deposit · Free cancellation 48h before"}
        </p>
      </div>
    </div>
  );
}
