"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

const reactions = [
  { max: 10, emoji: "🤯", bar: 100, text: { en: "That's basically free. You're practically stealing.", es: "Básicamente te lo están regalando." } },
  { max: 15, emoji: "😱", bar: 20, text: { en: "Less than ONE resort cocktail. Per person. All day.", es: "Menos que un cóctel en el resort. Por persona. Todo el día." } },
  { max: 20, emoji: "🎉", bar: 27, text: { en: "Cheaper than a taxi to the beach. And way more fun.", es: "Más barato que un taxi a la playa. Y mucho más divertido." } },
  { max: 30, emoji: "😄", bar: 40, text: { en: "Still cheaper than any guided tour. By a lot.", es: "Mucho más barato que cualquier tour guiado." } },
  { max: 999, emoji: "👍", bar: 53, text: { en: "Still a great deal for a full day of freedom.", es: "Sigue siendo un excelente precio por un día completo." } },
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
    <div className="relative rounded-3xl overflow-hidden" style={{ background: "linear-gradient(135deg, #0d3251 0%, #1B4F72 50%, #1a5e6e 100%)" }}>
      {/* Background texture */}
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#E8836A]/20 blur-3xl pointer-events-none" />
      <div className="absolute -top-10 -left-10 w-60 h-60 rounded-full bg-[#7FB5B5]/15 blur-3xl pointer-events-none" />

      <div className="relative p-8 sm:p-10">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block bg-[#E8836A] text-white text-xs font-black uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
            🧮 {isEs ? "Calculadora de precio" : "Price Calculator"}
          </span>
          <h3 className="text-3xl sm:text-4xl font-black text-white mb-2">
            {isEs ? "¿Cuánto sale por persona?" : "How much per person?"}
          </h3>
          <p className="text-white/40 text-sm">
            {isEs ? "Pon cuántos van — el resto lo calculamos nosotros" : "Tell us how many people — we handle the math"}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-5">
          {/* People selector */}
          <div className="bg-white/8 rounded-2xl p-5 border border-white/10">
            <label className="text-white/50 text-xs font-bold uppercase tracking-widest block mb-4">
              👥 {isEs ? "¿Cuántos van en tu grupo?" : "How many people in your group?"}
            </label>
            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => (
                <button
                  key={n}
                  onClick={() => setPeople(n)}
                  className={`w-11 h-11 rounded-xl font-black text-base transition-all duration-200 ${
                    people === n
                      ? "bg-[#E8836A] text-white scale-110 shadow-lg shadow-[#E8836A]/40"
                      : "bg-white/10 text-white/60 hover:bg-white/20 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Result reveal */}
          <div className="bg-white/8 rounded-2xl border border-white/10 overflow-hidden">
            {/* Buggies needed bar */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/5">
              <span className="text-white/50 text-xs">
                {people} {isEs ? "personas" : "people"} → <span className="text-white font-bold">{buggiesNeeded} {buggiesNeeded === 1 ? "buggy" : "buggies"} {isEs ? "necesario" + (buggiesNeeded > 1 ? "s" : "") : "needed"}</span>
              </span>
              <span className="text-white/30 text-xs">({isEs ? "hasta 5 por buggy" : "up to 5 per buggy"})</span>
            </div>

            {/* Big math display */}
            <div className="p-6">
              <div className="flex items-center justify-center gap-4 sm:gap-8 flex-wrap mb-6">
                <div className="text-center">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{isEs ? "Total del día" : "Total for the day"}</div>
                  <div className="text-5xl font-black text-white">${total}</div>
                </div>
                <div className="text-white/20 text-4xl font-light hidden sm:block">÷</div>
                <div className="text-center">
                  <div className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{isEs ? "personas" : "people"}</div>
                  <div className="text-5xl font-black text-white">{people}</div>
                </div>
                <div className="text-white/20 text-4xl font-light hidden sm:block">=</div>
                <div className="text-center">
                  <div className="text-[#E8836A] text-xs font-bold uppercase tracking-widest mb-1">{isEs ? "por persona" : "per person"}</div>
                  <div className="text-7xl font-black text-[#E8836A] leading-none">${perPerson}</div>
                </div>
              </div>

              {/* VS bar — visual comparison */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-white/30 mb-1.5">
                  <span>{isEs ? "Precio buggy" : "Buggy price"}</span>
                  <span>{isEs ? "Tour guiado promedio ($95)" : "Avg guided tour ($95)"}</span>
                </div>
                <div className="h-3 bg-white/10 rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-gradient-to-r from-[#E8836A] to-[#f5a080] rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${reaction.bar}%` }}
                  />
                </div>
                <p className="text-white/40 text-xs mt-1.5 text-right">{isEs ? "vs actividades típicas en Cozumel" : "vs typical Cozumel activities"}</p>
              </div>

              {/* Reaction */}
              <div className="flex items-start gap-3 bg-white/10 rounded-xl px-4 py-3.5">
                <span className="text-3xl shrink-0 mt-0.5">{reaction.emoji}</span>
                <p className="text-white font-semibold text-sm leading-relaxed">
                  {isEs ? reaction.text.es : reaction.text.en}
                </p>
              </div>
            </div>
          </div>

          <Link
            href={`/${locale}/book`}
            className="flex items-center justify-center gap-2 bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5 w-full"
          >
            {isEs ? `Reservar — $${total} en total →` : `Book Now — $${total} total →`}
          </Link>
          <p className="text-center text-white/25 text-xs">
            {isEs ? "Solo $25 de depósito · Cancelación gratuita 48h antes" : "Only $25 deposit · Free cancellation 48h before"}
          </p>
        </div>
      </div>
    </div>
  );
}
