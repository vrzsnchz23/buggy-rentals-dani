"use client";
import { useState } from "react";
import Link from "next/link";
import { useLocale } from "next-intl";

const achievements = [
  {
    max: 10,
    rank: "LEGENDARY",
    badge: "👑",
    color: "#E8836A",
    glow: "rgba(232,131,106,0.6)",
    text: { en: "You're basically robbing us. We're okay with it.", es: "Básicamente nos estás robando. Estamos bien con eso." },
  },
  {
    max: 15,
    rank: "EPIC",
    badge: "⚡",
    color: "#E8836A",
    glow: "rgba(232,131,106,0.5)",
    text: { en: "Less than ONE resort cocktail. Per person. All day.", es: "Menos que un cóctel en el resort. Por persona. Todo el día." },
  },
  {
    max: 20,
    rank: "RARE",
    badge: "🎯",
    color: "#7FB5B5",
    glow: "rgba(127,181,181,0.55)",
    text: { en: "Cheaper than a taxi to the beach. And way more fun.", es: "Más barato que un taxi a la playa. Y mucho más divertido." },
  },
  {
    max: 30,
    rank: "UNCOMMON",
    badge: "🎮",
    color: "#7FB5B5",
    glow: "rgba(127,181,181,0.4)",
    text: { en: "Still cheaper than any guided tour. By a lot.", es: "Mucho más barato que cualquier tour guiado." },
  },
  {
    max: 999,
    rank: "COMMON",
    badge: "🕹️",
    color: "#7FB5B5",
    glow: "rgba(127,181,181,0.3)",
    text: { en: "Still a great deal for a full day of freedom.", es: "Sigue siendo un excelente precio por un día completo." },
  },
];

export function PriceCalculator() {
  const locale = useLocale();
  const isEs = locale === "es";
  const [people, setPeople] = useState(4);
  const [lastChanged, setLastChanged] = useState<number | null>(null);

  const buggiesNeeded = Math.ceil(people / 5);
  const total = buggiesNeeded * 75;
  const perPerson = Math.ceil(total / people);
  const achievement = achievements.find((r) => perPerson <= r.max)!;
  const pct = Math.min((perPerson / 95) * 100, 100);

  const handleSelect = (n: number) => {
    setPeople(n);
    setLastChanged(n);
    setTimeout(() => setLastChanged(null), 600);
  };

  return (
    <div
      className="relative rounded-3xl overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050F1C 0%, #0a1a2e 60%, #0d2240 100%)" }}
    >
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 3px)",
          backgroundSize: "100% 3px",
        }}
      />
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{ backgroundImage: "linear-gradient(rgba(0,229,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,229,255,1) 1px, transparent 1px)", backgroundSize: "40px 40px" }}
      />
      {/* Glow orbs */}
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${achievement.glow} 0%, transparent 70%)`, transition: "background 0.5s ease" }} />
      <div className="absolute -bottom-16 -left-16 w-60 h-60 rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(0,229,255,0.08) 0%, transparent 70%)" }} />

      <div className="relative p-8 sm:p-10">

        {/* HUD Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/60">STAGE</span>
            <div className="flex gap-1">
              {[1,2,3].map(i => (
                <div key={i} className="w-2.5 h-2.5 rounded-sm" style={{ background: i <= buggiesNeeded ? "#00E5FF" : "rgba(0,229,255,0.15)", boxShadow: i <= buggiesNeeded ? "0 0 6px #00E5FF" : "none" }} />
              ))}
            </div>
          </div>
          <span
            className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border"
            style={{ color: achievement.color, borderColor: `${achievement.color}40`, background: `${achievement.color}10`, boxShadow: `0 0 12px ${achievement.glow}` }}
          >
            {achievement.badge} {achievement.rank}
          </span>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#00E5FF]/60">
            {isEs ? "MODO FÁCIL" : "EASY MODE"}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <p className="text-[#00E5FF]/50 text-xs font-black uppercase tracking-[0.3em] mb-2">
            🧮 {isEs ? "CALCULADORA DE PRECIO" : "PRICE CALCULATOR"}
          </p>
          <h3
            className="text-3xl sm:text-4xl font-black text-white mb-1"
            style={{ textShadow: "0 0 30px rgba(0,229,255,0.2)" }}
          >
            {isEs ? "¿Cuánto sale por persona?" : "How much per person?"}
          </h3>
          <p className="text-white/30 text-sm">
            {isEs ? "Selecciona jugadores — calculamos el precio" : "Select players — we handle the math"}
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-4">

          {/* Player Select */}
          <div
            className="rounded-2xl p-5 border"
            style={{ background: "rgba(0,229,255,0.03)", borderColor: "rgba(0,229,255,0.12)" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00E5FF]" style={{ boxShadow: "0 0 6px #00E5FF" }} />
              <span className="text-[#00E5FF]/60 text-[10px] font-black uppercase tracking-[0.25em]">
                👥 {isEs ? "SELECCIONA JUGADORES" : "SELECT PLAYERS"}
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[1,2,3,4,5,6,7,8,9,10].map((n) => {
                const isActive = people === n;
                const justChanged = lastChanged === n;
                return (
                  <button
                    key={n}
                    onClick={() => handleSelect(n)}
                    className="w-11 h-11 font-black text-base transition-all duration-150 relative"
                    style={{
                      borderRadius: "10px",
                      background: isActive
                        ? achievement.color
                        : "rgba(255,255,255,0.06)",
                      color: isActive ? "#fff" : "rgba(255,255,255,0.5)",
                      border: isActive
                        ? `2px solid ${achievement.color}`
                        : "2px solid rgba(255,255,255,0.08)",
                      boxShadow: isActive
                        ? `0 0 18px ${achievement.glow}, 0 4px 0 rgba(0,0,0,0.5)`
                        : "0 3px 0 rgba(0,0,0,0.4)",
                      transform: justChanged ? "scale(1.2)" : isActive ? "translateY(-2px)" : "translateY(0)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Score Panel */}
          <div
            className="rounded-2xl overflow-hidden border"
            style={{ background: "rgba(0,0,0,0.3)", borderColor: "rgba(0,229,255,0.1)" }}
          >
            {/* Status bar */}
            <div
              className="flex items-center justify-between px-5 py-2.5 text-xs border-b"
              style={{ background: "rgba(0,229,255,0.04)", borderColor: "rgba(0,229,255,0.08)" }}
            >
              <span className="text-white/40">
                {people} {isEs ? "jugadores" : "players"} →{" "}
                <span className="text-white font-bold">
                  {buggiesNeeded} {buggiesNeeded === 1 ? "buggy" : "buggies"} {isEs ? "necesario" + (buggiesNeeded > 1 ? "s" : "") : "needed"}
                </span>
              </span>
              <span className="text-white/25">({isEs ? "hasta 5 por buggy" : "up to 5 per buggy"})</span>
            </div>

            {/* Main score display */}
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-center gap-6 sm:gap-10 flex-wrap mb-6">

                <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{isEs ? "TOTAL" : "TOTAL"}</div>
                  <div className="text-4xl sm:text-5xl font-black text-white/70">${total}</div>
                </div>

                <div className="text-white/15 text-4xl font-thin hidden sm:block">÷</div>

                <div className="text-center">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-1">{isEs ? "JUGADORES" : "PLAYERS"}</div>
                  <div className="text-4xl sm:text-5xl font-black text-white/70">{people}</div>
                </div>

                <div className="text-white/15 text-4xl font-thin hidden sm:block">=</div>

                {/* BIG SCORE */}
                <div className="text-center">
                  <div
                    className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 transition-colors duration-500"
                    style={{ color: achievement.color }}
                  >
                    {isEs ? "PRECIO / PERSONA" : "PRICE / PERSON"}
                  </div>
                  <div
                    className="text-7xl sm:text-8xl font-black leading-none transition-all duration-300"
                    style={{
                      color: achievement.color,
                      textShadow: `0 0 40px ${achievement.glow}, 0 0 80px ${achievement.glow}`,
                    }}
                  >
                    ${perPerson}
                  </div>
                </div>
              </div>

              {/* XP Bar */}
              <div className="mb-5">
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-white/30 text-[10px] font-black uppercase tracking-widest">
                    {isEs ? "PRECIO VS TOUR GUIADO" : "PRICE VS GUIDED TOUR"}
                  </span>
                  <span className="text-white/20 text-[10px]">${perPerson} / $95</span>
                </div>
                <div
                  className="h-3 rounded-full overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${achievement.color}, ${achievement.color}cc)`,
                      boxShadow: `0 0 10px ${achievement.glow}`,
                    }}
                  />
                </div>
              </div>

              {/* Achievement unlock */}
              <div
                className="flex items-start gap-3 rounded-xl px-4 py-3.5 border transition-all duration-500"
                style={{
                  background: `${achievement.color}08`,
                  borderColor: `${achievement.color}25`,
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center text-xl shrink-0"
                  style={{ background: `${achievement.color}15`, border: `1px solid ${achievement.color}30` }}
                >
                  {achievement.badge}
                </div>
                <div>
                  <div
                    className="text-[10px] font-black uppercase tracking-[0.2em] mb-0.5"
                    style={{ color: `${achievement.color}80` }}
                  >
                    {isEs ? "LOGRO DESBLOQUEADO" : "ACHIEVEMENT UNLOCKED"}
                  </div>
                  <p className="text-white/70 text-sm leading-snug">
                    {isEs ? achievement.text.es : achievement.text.en}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/${locale}/book`}
            className="flex items-center justify-center gap-2 text-white font-black text-lg py-4 rounded-2xl transition-all hover:-translate-y-0.5 w-full relative overflow-hidden group"
            style={{
              background: `linear-gradient(135deg, ${achievement.color}, ${achievement.color}cc)`,
              boxShadow: `0 0 30px ${achievement.glow}, 0 4px 0 rgba(0,0,0,0.4)`,
            }}
          >
            <span className="relative z-10">
              {isEs ? `► RESERVAR — $${total} EN TOTAL` : `► BOOK NOW — $${total} TOTAL`}
            </span>
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-200" />
          </Link>

          <p className="text-center text-white/20 text-xs">
            {isEs ? "Solo $25 de depósito · Cancelación gratuita 48h antes" : "Only $25 deposit · Free cancellation 48h before"}
          </p>
        </div>
      </div>
    </div>
  );
}
