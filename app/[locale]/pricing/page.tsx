import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/sections/Pricing";
import { PriceCalculator } from "@/components/sections/PriceCalculator";
import { getLocale } from "next-intl/server";
import Image from "next/image";

export const metadata = {
  title: "Pricing | Buggy Rentals with Dani – Cozumel",
  description: "Simple, transparent pricing for buggy and compact car rentals in Cozumel. Open-air buggies from $75/day, A/C compact cars from $65/day.",
};

const comparisons = [
  { label: "Resort day pass", price: 120, emoji: "🏖️", note: "per person, just a pool", highlight: false },
  { label: "Guided group tour", price: 95, emoji: "🎪", note: "per person, no freedom", highlight: false },
  { label: "Snorkeling boat tour", price: 70, emoji: "🤿", note: "per person, 3 hours", highlight: false },
  { label: "Taxi around the island", price: 60, emoji: "🚕", note: "one-way, no stops", highlight: false },
  { label: "Buggy rental ÷ 5 people", price: 15, emoji: "🚗", note: "all day, your rules", highlight: true },
];

export default async function PricingPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  const comparisonsEs = [
    { label: "Day pass resort", price: 120, emoji: "🏖️", note: "por persona, solo la alberca" },
    { label: "Tour grupal guiado", price: 95, emoji: "🎪", note: "por persona, sin libertad" },
    { label: "Tour de snorkel", price: 70, emoji: "🤿", note: "por persona, 3 horas" },
    { label: "Taxi por la isla", price: 60, emoji: "🚕", note: "solo ida, sin paradas" },
    { label: "Buggy ÷ 5 personas", price: 15, emoji: "🚗", note: "todo el día, tus reglas", highlight: true },
  ] as typeof comparisons;

  const items = isEs ? comparisonsEs : comparisons;
  const maxPrice = 140;

  const faqs = [
    {
      emoji: "🕵️",
      color: "#7FB5B5",
      q: isEs ? "¿Hay cargos ocultos?" : "Are there really no hidden fees?",
      a: isEs
        ? "No. El precio que ves es lo que pagas. Ni siquiera te cobramos por el aire 🌬️"
        : "Nope. What you see is what you pay. We don't even charge you for the island air 🌬️",
    },
    {
      emoji: "🚗",
      color: "#E8836A",
      q: isEs ? "¿Qué pasa si no sé manejar stick?" : "What if I've never driven a manual?",
      a: isEs
        ? "Buenas noticias: nuestros buggies son automáticos. Nadie tiene que aprender con el tráfico de Cozumel 😅"
        : "Good news: our buggies are automatic. Nobody has to learn stick shift in Cozumel traffic 😅",
    },
    {
      emoji: "🗺️",
      color: "#1B4F72",
      q: isEs ? "¿Puedo manejar toda la isla?" : "Can I drive the whole island?",
      a: (
        <>
          {isEs
            ? "Casi. La carretera costera cubre aproximadamente 2/3 de la isla — la parte buena, con playas, cenotes y miradores. El tercio restante es área natural protegida con acceso restringido solo para personal autorizado. Así que no, no puedes llegar ahí... y ellos tampoco quieren que llegues 🌿"
            : "Almost. The coastal road covers about 2/3 of the island — the good part, with beaches, cenotes, and lookouts. The remaining third is a protected natural reserve with restricted access for authorized personnel only. So no, you can't get in there... and they'd really prefer you didn't try 🌿"}
          <a
            href={`/${locale}/driving-guide`}
            className="mt-3 inline-flex items-center gap-1.5 font-bold text-[#E8836A] hover:underline text-sm"
          >
            🗺️ {isEs ? "Ver nuestra guía completa de manejo →" : "Check our Driving in Cozumel 101 guide →"}
          </a>
        </>
      ),
    },
    {
      emoji: "📱",
      color: "#7FB5B5",
      q: isEs ? "¿Qué pasa si algo sale mal?" : "What if something goes wrong?",
      a: isEs
        ? "Dani está en WhatsApp. Siempre. No es marketing, es literal 📱"
        : "Dani is on WhatsApp. Always. That's not a marketing line — it's literally true 📱",
    },
  ] as { emoji: string; color: string; q: string; a: React.ReactNode }[];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">

        {/* ─── HERO ─── */}
        <div className="bg-gradient-to-br from-[#0d3251] via-[#1B4F72] to-[#1a5e6e] pt-24 pb-0 relative overflow-hidden min-h-[520px] flex flex-col">
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-[#E8836A]/20 blur-[80px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#7FB5B5]/20 blur-[60px] pointer-events-none" />

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

              <div className="flex flex-wrap gap-3 mt-8">
                {[
                  { value: "$75", label: isEs ? "buggy / día" : "buggy / day", highlight: false },
                  { value: "$15", label: isEs ? "por persona (÷5)" : "per person (÷5)", highlight: true },
                  { value: "$25", label: isEs ? "depósito" : "to book", highlight: false },
                ].map((s) => (
                  <div key={s.label} className={`rounded-2xl px-5 py-3.5 text-center ${s.highlight ? "bg-[#E8836A] shadow-lg shadow-[#E8836A]/30" : "bg-white/10 border border-white/15"}`}>
                    <div className="text-2xl font-black text-white">{s.value}</div>
                    <div className={`text-xs font-semibold mt-0.5 ${s.highlight ? "text-white/80" : "text-white/45"}`}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── PRICING CARDS ─── */}
        <Pricing />

        {/* ─── CALCULATOR + COMPARISON + FAQ ─── */}
        <div className="bg-[#F5F0EB] py-20">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-6">

            {/* Calculator */}
            <PriceCalculator />

            {/* ─── COMPARISON ─── */}
            <div className="rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2" style={{ minHeight: "420px" }}>

              {/* LEFT — competitors, dark navy */}
              <div className="relative p-8 sm:p-10 flex flex-col" style={{ background: "linear-gradient(160deg, #0d1f38 0%, #112844 100%)" }}>
                <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
                <div className="relative flex-1 flex flex-col">
                  <div className="mb-6">
                    <span className="inline-block bg-white/10 text-white/40 font-bold text-[10px] uppercase tracking-widest px-3 py-1 rounded-full mb-3">
                      {isEs ? "La competencia" : "The competition"}
                    </span>
                    <h3 className="text-xl sm:text-2xl font-black text-white">
                      {isEs ? "¿Qué más puedes hacer con $15?" : "What else costs $15 in Cozumel?"}
                    </h3>
                    <p className="text-white/40 text-sm mt-1">{isEs ? "Spoiler: no mucho." : "Spoiler: not much."}</p>
                  </div>

                  <div className="flex-1 space-y-1">
                    {items.filter(c => !c.highlight).map((c) => (
                      <div key={c.label} className="flex items-center gap-4 py-3.5 border-b border-white/8">
                        <span className="text-xl w-7 text-center shrink-0">{c.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-white/80 font-semibold text-sm leading-tight">{c.label}</div>
                          <div className="text-white/35 text-xs mt-0.5">{c.note}</div>
                        </div>
                        <span className="text-2xl font-black text-white/60 shrink-0 tabular-nums">${c.price}</span>
                      </div>
                    ))}
                  </div>

                  <p className="text-white/20 text-[11px] mt-6">
                    {isEs ? "* Precios aproximados por persona" : "* Approximate prices per person"}
                  </p>
                </div>
              </div>

              {/* RIGHT — buggy, coral */}
              <div
                className="relative p-8 sm:p-10 flex flex-col items-center justify-center text-center overflow-hidden"
                style={{ background: "linear-gradient(145deg, #d4633e 0%, #E8836A 55%, #f09872 100%)" }}
              >
                <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-white/20 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-black/15 blur-2xl pointer-events-none" />

                <div className="relative">
                  <div className="inline-flex items-center gap-1.5 bg-black/15 text-white/90 text-[10px] font-black px-3 py-1.5 rounded-full mb-6 uppercase tracking-widest">
                    🏆 {isEs ? "La mejor opción" : "The winner"}
                  </div>

                  <div className="text-white/70 text-sm font-bold uppercase tracking-widest mb-2">
                    {isEs ? "tú pagas" : "you pay"}
                  </div>

                  <div
                    className="font-black text-white leading-none mb-1"
                    style={{ fontSize: "clamp(5rem, 15vw, 8rem)", textShadow: "0 8px 40px rgba(0,0,0,0.2)" }}
                  >
                    $15
                  </div>

                  <div className="text-white/60 text-sm mb-8">
                    {isEs ? "por persona · $75 ÷ 5" : "per person · $75 ÷ 5"}
                  </div>

                  <div className="space-y-2.5 text-left w-full max-w-xs mx-auto">
                    {(isEs
                      ? ["Todo el día, sin itinerario fijo", "Tanque lleno incluido", "Seguro y WhatsApp con Dani"]
                      : ["All day, no fixed itinerary", "Full tank included", "Insurance & WhatsApp with Dani"]
                    ).map(perk => (
                      <div key={perk} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                            <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                        <span className="text-white/85 text-sm font-medium">{perk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* ─── FAQ ─── */}
            <div className="rounded-3xl overflow-hidden bg-white">
              <div className="px-8 sm:px-10 pt-10 pb-6 text-center">
                <h3 className="text-2xl sm:text-3xl font-black text-[#1B4F72] mb-1">
                  {isEs ? "Preguntas frecuentes" : "FAQ"}
                </h3>
                <p className="text-gray-400 text-sm">
                  {isEs ? "Con honestidad brutal." : "Answered with brutal honesty."}
                </p>
              </div>

              <div className="px-6 sm:px-8 pb-10 space-y-3">
                {faqs.map((faq, i) => (
                  <details key={i} className="group rounded-2xl border border-gray-100 overflow-hidden">
                    <summary className="flex items-center gap-4 px-5 py-4 cursor-pointer list-none select-none bg-gray-50 hover:bg-gray-100 transition-colors">
                      <span
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0"
                        style={{ background: `${faq.color}18` }}
                      >
                        {faq.emoji}
                      </span>
                      <span className="font-bold text-[#1B4F72] flex-1 text-sm sm:text-base">{faq.q}</span>
                      <span
                        className="text-xl font-black group-open:rotate-45 transition-transform duration-200 shrink-0"
                        style={{ color: faq.color }}
                      >+</span>
                    </summary>
                    <div
                      className="px-5 pb-5 pt-4 text-gray-600 text-sm leading-relaxed border-t"
                      style={{ borderColor: `${faq.color}20` }}
                    >
                      <div
                        className="pl-4 border-l-2"
                        style={{ borderColor: faq.color }}
                      >
                        {faq.a}
                      </div>
                    </div>
                  </details>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ─── FINAL CTA ─── */}
        <div className="relative overflow-hidden py-28 text-center" style={{ background: "linear-gradient(135deg, #0d3251 0%, #1B4F72 40%, #1a5e6e 100%)" }}>
          <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full bg-[#E8836A]/15 blur-[60px] pointer-events-none" />

          {/* Floating emojis */}
          <div className="absolute top-8 left-[10%] text-4xl opacity-20 rotate-[-15deg]">🏝️</div>
          <div className="absolute top-12 right-[12%] text-3xl opacity-20 rotate-[10deg]">🚗</div>
          <div className="absolute bottom-10 left-[18%] text-2xl opacity-15 rotate-[5deg]">🌊</div>
          <div className="absolute bottom-8 right-[15%] text-3xl opacity-15 rotate-[-8deg]">☀️</div>

          <div className="relative max-w-2xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-white/10 text-white/60 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-8 border border-white/15">
              {isEs ? "¿Listo para explorar?" : "Ready to explore?"}
            </div>

            <h2 className="text-4xl sm:text-5xl font-black text-white mb-3 leading-tight">
              {isEs ? "Ya hiciste los números." : "You've done the math."}
              <br />
              <span className="text-[#E8836A]">{isEs ? "Ahora a reservar." : "Now go book it."}</span>
            </h2>

            <p className="text-white/40 text-base mb-10 max-w-md mx-auto">
              {isEs
                ? "Solo $25 de depósito. Cancela gratis hasta 48h antes. Sin sorpresas."
                : "Only $25 deposit. Cancel free up to 48h before. Zero surprises."}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
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

            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                isEs ? "✓ Seguro incluido" : "✓ Insurance included",
                isEs ? "✓ Tanque lleno" : "✓ Full tank",
                isEs ? "✓ WhatsApp con Dani" : "✓ WhatsApp with Dani",
                isEs ? "✓ Sin tarjeta de crédito" : "✓ No credit card needed",
              ].map((item) => (
                <span
                  key={item}
                  className="bg-white/8 border border-white/12 text-white/50 text-xs font-medium px-4 py-2 rounded-full"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
