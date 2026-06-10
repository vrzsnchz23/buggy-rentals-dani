import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { getLocale } from "next-intl/server";
import { Check } from "lucide-react";
import Image from "next/image";

export const metadata = {
  title: "Pricing | Buggy Rentals with Dani – Cozumel",
  description: "Simple, transparent pricing for buggy and compact car rentals in Cozumel. Open-air buggies from $75/day, A/C compact cars from $65/day.",
};

const comparisons = [
  { label: "Guided group tour", price: 95, emoji: "🎪", perPerson: true, note: "per person, no freedom" },
  { label: "Snorkeling boat tour", price: 70, emoji: "🤿", perPerson: true, note: "per person, 3 hours" },
  { label: "Resort day pass", price: 120, emoji: "🏖️", perPerson: true, note: "per person, just a pool" },
  { label: "Taxi around the island", price: 60, emoji: "🚕", perPerson: false, note: "one-way, no stops" },
  { label: "Buggy rental (5 people)", price: 15, emoji: "🚗", perPerson: true, note: "all day, your rules", highlight: true },
];

export default async function PricingPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">

        {/* Hero header */}
        <div className="bg-gradient-to-br from-[#0d3251] via-[#1B4F72] to-[#1a5e6e] pt-24 pb-0 relative overflow-hidden min-h-[520px] flex flex-col">
          {/* dot grid */}
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          {/* glow orbs */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E8836A]/20 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#7FB5B5]/20 blur-[60px] pointer-events-none" />

          {/* Buggy image — right side, large */}
          <div className="absolute bottom-0 right-0 w-72 sm:w-[420px] h-56 sm:h-80 pointer-events-none select-none">
            <Image src="/images/buggy15.png" alt="Buggy" fill className="object-contain object-right-bottom drop-shadow-2xl" />
          </div>

          <div className="relative max-w-6xl mx-auto px-6 sm:px-10 flex-1 flex flex-col justify-center pb-16 pt-8">
            <div className="max-w-xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6 border border-white/15">
                💸 {isEs ? "Precios honestos" : "No sneaky fees. Ever."}
              </div>
              <h1 className="text-5xl sm:text-6xl font-black text-white mb-5 leading-[1.05]">
                {isEs ? (
                  <>El precio te va a<br /><span className="text-[#E8836A]">sorprender 😅</span></>
                ) : (
                  <>The price will<br /><span className="text-[#E8836A]">surprise you 😅</span></>
                )}
              </h1>
              <p className="text-white/55 text-lg max-w-md">
                {isEs
                  ? "La mayoría divide entre su grupo y dice... eso es todo??"
                  : "Most people split it with their group and say... wait, that's it??"}
              </p>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  { value: "$75", label: isEs ? "buggy / día" : "buggy / day", highlight: false },
                  { value: "$15", label: isEs ? "por persona (÷5)" : "per person (÷5)", highlight: true },
                  { value: "$25", label: isEs ? "depósito" : "to book", highlight: false },
                ].map((s) => (
                  <div
                    key={s.label}
                    className={`rounded-2xl px-5 py-3.5 text-center ${s.highlight ? "bg-[#E8836A] shadow-lg shadow-[#E8836A]/30" : "bg-white/10 border border-white/15"}`}
                  >
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className={`text-xs font-semibold mt-0.5 ${s.highlight ? "text-white/80" : "text-white/45"}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Pricing cards */}
        <Pricing />

        {/* Calculator + comparison */}
        <div className="bg-[#F5F0EB] py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-8">

            {/* Calculator */}
            <PriceCalculator />

            {/* Comparison */}
            <div className="bg-white rounded-3xl p-8 sm:p-10">
              <div className="text-center mb-8">
                <span className="inline-block bg-[#E8836A]/10 text-[#E8836A] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  {isEs ? "Contexto útil" : "Helpful context"}
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#1B4F72]">
                  {isEs ? "¿Qué más puedes hacer con $15?" : "What else costs $15 in Cozumel?"}
                </h3>
                <p className="text-gray-400 text-sm mt-2">
                  {isEs ? "Spoiler: no mucho." : "Spoiler: not much."}
                </p>
              </div>

              <div className="space-y-3">
                {comparisons.map((c) => {
                  const maxPrice = 140;
                  const pct = Math.min((c.price / maxPrice) * 100, 100);
                  return (
                    <div key={c.label} className={`flex items-center gap-4 p-4 rounded-2xl transition-all ${c.highlight ? "bg-[#1B4F72] ring-2 ring-[#E8836A]" : "bg-gray-50"}`}>
                      <span className="text-2xl shrink-0">{c.emoji}</span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-bold text-sm ${c.highlight ? "text-white" : "text-gray-800"}`}>
                          {c.label}
                          {c.highlight && <span className="ml-2 bg-[#E8836A] text-white text-xs px-2 py-0.5 rounded-full font-black">YOU</span>}
                        </div>
                        <div className={`text-xs mt-1 ${c.highlight ? "text-white/50" : "text-gray-400"}`}>{c.note}</div>
                        <div className={`mt-2 h-2 rounded-full overflow-hidden ${c.highlight ? "bg-white/20" : "bg-gray-200"}`}>
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${c.highlight ? "bg-[#E8836A]" : "bg-gray-300"}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                      <div className={`text-xl font-black shrink-0 ${c.highlight ? "text-[#E8836A]" : "text-gray-500"}`}>
                        ${c.price}
                        <span className={`text-xs font-medium block text-right ${c.highlight ? "text-white/40" : "text-gray-400"}`}>
                          {c.perPerson ? "/ person" : "/ trip"}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p className="text-center text-gray-400 text-xs mt-6">
                {isEs
                  ? "* Precios aproximados basados en actividades típicas de cruceros en Cozumel."
                  : "* Approximate prices based on typical cruise port activities in Cozumel."}
              </p>
            </div>

            {/* FAQ fun */}
            <div className="bg-white rounded-3xl p-8 sm:p-10">
              <h3 className="text-2xl font-black text-[#1B4F72] mb-6 text-center">
                {isEs ? "Preguntas frecuentes (con honestidad)" : "FAQ (answered honestly)"}
              </h3>
              <div className="space-y-4">
                {([
                  {
                    q: isEs ? "¿Hay cargos ocultos?" : "Are there really no hidden fees?",
                    a: isEs ? "No. El precio que ves es lo que pagas. Ni siquiera te cobramos por el aire 🌬️" : "Nope. What you see is what you pay. We don't even charge you for the island air 🌬️",
                  },
                  {
                    q: isEs ? "¿Qué pasa si no sé manejar stick?" : "What if I've never driven a manual?",
                    a: isEs ? "Buenas noticias: nuestros buggies son automáticos. Nadie tiene que aprender con el tráfico de Cozumel 😅" : "Good news: our buggies are automatic. Nobody has to learn stick shift in Cozumel traffic 😅",
                  },
                  {
                    q: isEs ? "¿Puedo manejar toda la isla?" : "Can I drive the whole island?",
                    a: (
                      <>
                        {isEs
                          ? "Casi. La carretera costera cubre aproximadamente 2/3 de la isla — la parte buena, con playas, cenotes y miradores. El tercio restante es área natural protegida con acceso restringido solo para personal autorizado. Así que no, no puedes llegar ahí... y ellos tampoco quieren que llegues 🌿"
                          : "Almost. The coastal road covers about 2/3 of the island — the good part, with beaches, cenotes, and lookouts. The remaining third is a protected natural reserve with restricted access for authorized personnel only. So no, you can't get in there... and they'd really prefer you didn't try 🌿"}
                        <a
                          href={`/${locale}/driving-guide`}
                          className="mt-3 flex items-center gap-1.5 font-bold text-[#E8836A] hover:underline"
                        >
                          🗺️ {isEs ? "Ver nuestra guía completa de manejo en Cozumel →" : "Check our full Driving in Cozumel 101 guide →"}
                        </a>
                      </>
                    ),
                  },
                  {
                    q: isEs ? "¿Qué pasa si algo sale mal?" : "What if something goes wrong?",
                    a: isEs ? "Dani está en WhatsApp. Siempre. No es marketing, es literal 📱" : "Dani is on WhatsApp. Always. That's not a marketing line — it's literally true 📱",
                  },
                ] as { q: string; a: React.ReactNode }[]).map((faq, i) => (
                  <details key={i} className="group bg-[#F5F0EB] rounded-2xl">
                    <summary className="flex items-center justify-between px-5 py-4 cursor-pointer font-bold text-[#1B4F72] list-none select-none">
                      {faq.q}
                      <span className="text-[#E8836A] text-xl font-black group-open:rotate-45 transition-transform duration-200 shrink-0 ml-3">+</span>
                    </summary>
                    <div className="px-5 pb-4 text-gray-600 text-sm leading-relaxed">{faq.a}</div>
                  </details>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Final CTA */}
        <div className="bg-[#1B4F72] py-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="relative max-w-2xl mx-auto px-4">
            <div className="text-5xl mb-4">🏝️</div>
            <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
              {isEs ? "Ya hiciste los números." : "You've done the math."}<br />
              <span className="text-[#E8836A]">{isEs ? "Ahora a reservar." : "Now go book it."}</span>
            </h2>
            <p className="text-white/50 mb-8">
              {isEs
                ? "Solo $25 de depósito. Cancela gratis hasta 48h antes. Sin sorpresas."
                : "Only $25 deposit. Cancel free up to 48h before. No surprises."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`/${locale}/book`}
                className="inline-flex items-center justify-center gap-2 bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg px-10 py-4 rounded-full transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5"
              >
                {isEs ? "Reservar ahora →" : "Book Now →"}
              </a>
              <a
                href="https://wa.me/529876543210"
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-10 py-4 rounded-full transition-all border border-white/20"
              >
                💬 {isEs ? "Preguntar primero" : "Ask a question first"}
              </a>
            </div>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8 text-white/40 text-sm">
              {[
                isEs ? "✓ Seguro incluido" : "✓ Insurance included",
                isEs ? "✓ Tanque lleno" : "✓ Full tank",
                isEs ? "✓ Soporte WhatsApp" : "✓ WhatsApp support",
                isEs ? "✓ Sin tarjeta de crédito" : "✓ No credit card needed",
              ].map((item) => <span key={item}>{item}</span>)}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
