import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { getLocale } from "next-intl/server";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cozumel Cruise Excursion — Buggy Rental Near Puerta Maya Port | Buggy Rentals with Dani",
  description:
    "Skip the ship excursion. Rent a buggy in Cozumel for just $75/day — 5-minute walk from Puerta Maya & SSA ports. Insurance included, no guide needed. Book online in 2 minutes.",
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do I need to book in advance?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes, we strongly recommend booking online before your cruise arrives. Cozumel is the #1 cruise port in the Caribbean and buggies fill up fast. Booking takes under 2 minutes and requires only a $25 deposit."
      }
    },
    {
      "@type": "Question",
      "name": "What if my ship is delayed or changes arrival time?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No problem. When you book, give us your all-aboard time and we'll work backwards from there. If your ship is delayed, just send us a WhatsApp — we'll hold your buggy."
      }
    },
    {
      "@type": "Question",
      "name": "How far is the walk from Puerta Maya to your location?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We're located at Km 4.3 on the Costera Sur highway, right at the Pemex gas station — approximately a 5-minute walk from the Puerta Maya and SSA piers. If you're at the International Pier, it's a short taxi ride."
      }
    },
    {
      "@type": "Question",
      "name": "What time should I return the buggy to make my ship?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We recommend returning your buggy at least 1 hour before your all-aboard time. Tell us your all-aboard time when you book and we'll remind you. We're 5 minutes from the port, so you'll have plenty of buffer."
      }
    },
    {
      "@type": "Question",
      "name": "Can I drive around the whole island in one day?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes! The full loop around Cozumel takes about 2–3 hours of driving time. With stops at beaches, beach clubs, and ruins, plan for a full 6–8 hours. Most cruise ships dock for 8–10 hours, which is perfect."
      }
    }
  ]
};

export default async function CruiseExcursionPage() {
  const locale = await getLocale();
  const isEs = locale === "es";

  const steps = isEs
    ? [
        { n: "01", emoji: "🚢", title: "Bajas del barco", desc: "Tus pies tocan tierra en Puerta Maya o SSA. Desde aquí somos 5 minutos a pie." },
        { n: "02", emoji: "🤝", title: "Recoges tu buggy", desc: "Tu buggy ya está listo, tanque lleno. Firma, sube y arranca. No hay filas ni burocracia." },
        { n: "03", emoji: "🏝️", title: "La isla es tuya", desc: "Tú decides adónde ir y cuánto tiempo quedarte. Devuelves antes de tu hora de embarque y listo." },
      ]
    : [
        { n: "01", emoji: "🚢", title: "Step off your ship", desc: "Your feet hit the dock at Puerta Maya or SSA. We're a 5-minute walk from here." },
        { n: "02", emoji: "🤝", title: "Pick up your buggy", desc: "Your buggy is ready, full tank. Sign, hop in, and go. No lines, no paperwork shuffle." },
        { n: "03", emoji: "🏝️", title: "The island is yours", desc: "You decide where to go and how long to stay. Return before your all-aboard time and you're done." },
      ];

  const included = isEs
    ? [
        "Seguro de responsabilidad civil",
        "Tanque lleno — se devuelve lleno",
        "Hasta 5 personas por buggy",
        "Soporte por WhatsApp con Dani",
        "Sin cargos ocultos — nunca",
        "Tip: sabemos exactamente cuándo sale tu barco",
      ]
    : [
        "Liability insurance included",
        "Full tank on pickup — return full",
        "Up to 5 people per buggy",
        "WhatsApp support with Dani",
        "No hidden fees — ever",
        "We know your all-aboard time and will keep you on track",
      ];

  const faqs = isEs
    ? [
        {
          q: "¿Necesito reservar con anticipación?",
          a: "Sí, te recomendamos reservar antes de que llegue tu crucero. Cozumel es el puerto #1 del Caribe y los buggies se llenan rápido. Solo toma 2 minutos y requiere un depósito de $25.",
        },
        {
          q: "¿Qué pasa si mi barco llega tarde o cambia su horario?",
          a: "Sin problema. Al reservar, danos tu hora de embarque y nosotros organizamos desde ahí. Si el barco se retrasa, mándanos un WhatsApp — guardamos tu buggy.",
        },
        {
          q: "¿Qué tan lejos están de Puerta Maya?",
          a: "Estamos en el Km 4.3 de la Costera Sur, justo en la gasolinera Pemex — aproximadamente 5 minutos caminando desde los muelles Puerta Maya y SSA. Desde el muelle internacional, un taxi corto.",
        },
        {
          q: "¿A qué hora debo regresar el buggy?",
          a: "Recomendamos regresar al menos 1 hora antes de tu hora de embarque. Dinos tu horario al reservar y te recordamos. Somos 5 minutos del puerto.",
        },
        {
          q: "¿Puedo dar la vuelta completa a la isla en un día?",
          a: "¡Sí! El recorrido completo por la isla toma unas 2–3 horas de conducción. Con paradas en playas, beach clubs y ruinas, planea 6–8 horas. La mayoría de los cruceros atracan 8–10 horas — perfecto.",
        },
      ]
    : [
        {
          q: "Do I need to book in advance?",
          a: "Yes, we strongly recommend booking online before your cruise arrives. Cozumel is the #1 cruise port in the Caribbean and buggies fill up fast. Booking takes under 2 minutes and requires only a $25 deposit.",
        },
        {
          q: "What if my ship is delayed or changes arrival time?",
          a: "No problem. When you book, give us your all-aboard time and we'll work backwards from there. If your ship is delayed, just send us a WhatsApp — we'll hold your buggy.",
        },
        {
          q: "How far is the walk from Puerta Maya?",
          a: "We're at Km 4.3 on the Costera Sur highway, right at the Pemex gas station — about a 5-minute walk from the Puerta Maya and SSA piers. From the International Pier, it's a short taxi ride.",
        },
        {
          q: "What time should I return the buggy?",
          a: "We recommend returning at least 1 hour before your all-aboard time. Tell us your schedule when you book and we'll keep you on track. We're 5 minutes from the port.",
        },
        {
          q: "Can I drive around the whole island in one day?",
          a: "Yes! The full loop around Cozumel takes about 2–3 hours of driving time. With stops at beaches, clubs, and ruins, plan for 6–8 hours. Most ships dock for 8–10 hours — perfect.",
        },
      ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB]">

        {/* ── HERO ── */}
        <div
          className="relative overflow-hidden pt-28 pb-24 text-center"
          style={{ background: "linear-gradient(160deg, #1B4F72 0%, #0f2d42 70%, #091e2d 100%)" }}
        >
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

          <div className="relative max-w-4xl mx-auto px-4">
            <div className="inline-flex items-center gap-2 bg-[#E8836A]/20 border border-[#E8836A]/30 text-[#E8836A] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              🚢 {isEs ? "EXCURSIÓN DE CRUCERO · COZUMEL" : "CRUISE EXCURSION · COZUMEL"}
            </div>

            <h1 className="text-4xl sm:text-6xl font-black text-white leading-tight mb-4">
              {isEs
                ? <>Renta un buggy <span className="text-[#7FB5B5]">desde el puerto</span></>
                : <>Rent a Buggy <span className="text-[#7FB5B5]">From the Port</span></>}
            </h1>

            <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
              {isEs
                ? "Olvida el tour del barco. Estamos a 5 minutos caminando de Puerta Maya y SSA. Seguro incluido, sin guía necesario, sin itinerario fijo."
                : "Skip the ship excursion. We're a 5-minute walk from Puerta Maya & SSA. Insurance included, no guide needed, no fixed itinerary."}
            </p>

            {/* Stats strip */}
            <div className="inline-grid grid-cols-3 gap-px bg-white/10 rounded-2xl overflow-hidden text-sm mt-2">
              {(isEs
                ? [
                    { label: "Depósito", value: "$25 USD" },
                    { label: "Todo el día", value: "$75 / buggy" },
                    { label: "Distancia", value: "5 min a pie" },
                  ]
                : [
                    { label: "Deposit", value: "$25 USD" },
                    { label: "Full day", value: "$75 / buggy" },
                    { label: "Distance", value: "5-min walk" },
                  ]
              ).map((item) => (
                <div key={item.label} className="bg-white/5 px-5 py-3 text-center">
                  <div className="text-white/40 text-xs uppercase tracking-wider mb-0.5">{item.label}</div>
                  <div className="text-white font-bold">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-lg px-8 py-4 rounded-2xl transition-all hover:shadow-2xl hover:shadow-[#E8836A]/40 hover:-translate-y-0.5"
              >
                {isEs ? "Reservar mi buggy →" : "Book My Buggy →"}
              </Link>
              <a
                href="https://wa.me/529872743477?text=Hi!%20I%27m%20arriving%20on%20a%20cruise%20and%20want%20to%20book%20a%20buggy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-black text-base px-6 py-4 rounded-2xl transition-all hover:-translate-y-0.5"
              >
                💬 {isEs ? "WhatsApp a Dani" : "WhatsApp Dani"}
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-20">

          {/* ── HOW IT WORKS FOR CRUISE PASSENGERS ── */}
          <section>
            <div className="text-center mb-10">
              <span className="inline-block bg-[#1B4F72]/10 text-[#1B4F72] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {isEs ? "Proceso simple" : "How It Works"}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4F72]">
                {isEs ? "Para cruceristas: 3 pasos" : "For Cruise Passengers: 3 Steps"}
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {steps.map((s, i) => (
                <div key={i} className="bg-white rounded-3xl p-7 shadow-sm text-center relative overflow-hidden">
                  <div className="absolute top-3 right-4 text-6xl font-black text-[#1B4F72]/5 leading-none select-none">{s.n}</div>
                  <div className="text-4xl mb-3">{s.emoji}</div>
                  <h3 className="font-black text-[#1B4F72] text-lg mb-2">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ── HOW MUCH TIME ── */}
          <section className="bg-[#1B4F72] rounded-3xl p-10 text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
            <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />
            <div className="relative">
              <h2 className="text-2xl sm:text-3xl font-black mb-6">
                ⏱️ {isEs ? "¿Cuánto tiempo necesitas?" : "How Much Time Do You Need?"}
              </h2>
              <div className="grid sm:grid-cols-2 gap-5">
                {(isEs
                  ? [
                      { time: "4–5 horas", label: "Lo básico", desc: "Playa Palancar + costa este + regreso. Perfecto si tu escala es corta." },
                      { time: "6–8 horas", label: "La experiencia completa", desc: "La vuelta entera a la isla, con paradas en playas, pueblos y ruinas mayas. Lo ideal para la mayoría.", badge: "⭐ Recomendado" },
                    ]
                  : [
                      { time: "4–5 hours", label: "The highlights", desc: "Playa Palancar + east coast + return. Perfect if your port stop is on the short side." },
                      { time: "6–8 hours", label: "The full experience", desc: "The full island loop, with stops at beaches, towns, and Maya ruins. The sweet spot for most cruise days.", badge: "⭐ Recommended" },
                    ]
                ).map((item, i) => (
                  <div key={i} className="bg-white/10 rounded-2xl p-6 relative">
                    {item.badge && (
                      <div className="absolute -top-2 -right-2 bg-[#E8836A] text-white text-xs font-black px-3 py-1 rounded-full">{item.badge}</div>
                    )}
                    <div className="text-3xl font-black text-[#7FB5B5] mb-1">{item.time}</div>
                    <div className="text-white font-bold text-sm mb-2">{item.label}</div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>
              <p className="text-white/40 text-sm mt-6">
                {isEs
                  ? "* La mayoría de los cruceros atracan en Cozumel de 8 a 10 horas — tiempo más que suficiente."
                  : "* Most cruise ships dock in Cozumel for 8–10 hours — more than enough time for the full experience."}
              </p>
            </div>
          </section>

          {/* ── WHAT'S INCLUDED ── */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4F72]">
                {isEs ? "¿Qué incluye?" : "What's Included"}
              </h2>
              <p className="text-gray-400 mt-2">
                {isEs ? "Sin letra chica. Sin sorpresas." : "No fine print. No surprises."}
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {included.map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white rounded-2xl px-5 py-4 shadow-sm">
                  <div className="w-8 h-8 rounded-full bg-[#E8836A]/15 flex items-center justify-center shrink-0">
                    <svg className="w-4 h-4 text-[#E8836A]" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={2.5}>
                      <path d="M2 6l3 3 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-[#1B4F72] font-medium text-sm">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 bg-[#E8836A]/8 border border-[#E8836A]/20 rounded-2xl px-6 py-5 flex gap-4">
              <span className="text-2xl shrink-0">💡</span>
              <p className="text-[#1B4F72] text-sm leading-relaxed">
                {isEs
                  ? "El precio del buggy es por vehículo, no por persona. Dividido entre 5 personas, son solo $15 por persona por todo el día. Mucho mejor que cualquier excursión del barco."
                  : "The buggy price is per vehicle, not per person. Split between 5 people, that's just $15 per person for a full day of freedom — far cheaper than any ship excursion."}
              </p>
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="bg-[#E8836A] rounded-3xl p-10 text-center text-white relative overflow-hidden">
            <div className="absolute -bottom-10 -left-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10" />
            <div className="relative">
              <div className="text-4xl mb-4">🏝️</div>
              <h2 className="text-3xl font-black mb-3">
                {isEs ? "Tu barco sale hoy. Aprovecha el día." : "Your Ship Docks Today. Make It Count."}
              </h2>
              <p className="text-white/80 max-w-lg mx-auto mb-8 text-lg">
                {isEs
                  ? "Solo $25 de depósito. Cancelación gratuita 48 horas antes. La reserva toma menos de 2 minutos."
                  : "Just $25 deposit. Free cancellation 48 hours before. Booking takes under 2 minutes."}
              </p>
              <Link
                href={`/${locale}/book`}
                className="inline-flex items-center bg-white text-[#E8836A] font-black text-xl px-10 py-4 rounded-2xl transition-all hover:shadow-2xl hover:-translate-y-0.5"
              >
                {isEs ? "Reservar ahora — $75/día →" : "Book Now — $75/day →"}
              </Link>
              <p className="text-white/50 text-sm mt-4">
                {isEs ? "Sin tarjeta de crédito hasta el checkout" : "No credit card required until checkout"}
              </p>
            </div>
          </section>

          {/* ── FAQ ── */}
          <section>
            <div className="text-center mb-10">
              <h2 className="text-3xl sm:text-4xl font-black text-[#1B4F72]">
                {isEs ? "Preguntas frecuentes de cruceristas" : "Cruise Passenger FAQs"}
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((item, i) => (
                <details key={i} className="group bg-white rounded-2xl shadow-sm overflow-hidden">
                  <summary className="flex items-center justify-between gap-4 p-5 cursor-pointer list-none font-bold text-[#1B4F72] hover:text-[#E8836A] transition-colors">
                    <span>{item.q}</span>
                    <span className="shrink-0 w-8 h-8 rounded-full bg-[#F5F0EB] flex items-center justify-center text-[#1B4F72] group-open:rotate-45 transition-transform text-lg font-black">+</span>
                  </summary>
                  <div className="px-5 pb-5 border-l-4 border-[#E8836A] ml-5 mt-1">
                    <p className="text-gray-600 text-sm leading-relaxed">{item.a}</p>
                  </div>
                </details>
              ))}
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm mb-3">
                {isEs ? "¿Más preguntas?" : "Still have questions?"}
              </p>
              <a
                href="https://wa.me/529872743477?text=Hi!%20I%27m%20arriving%20on%20a%20cruise%20and%20have%20a%20question%20about%20buggy%20rentals"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-6 py-3 rounded-xl transition-all hover:-translate-y-0.5"
              >
                💬 {isEs ? "WhatsApp a Dani" : "WhatsApp Dani"}
              </a>
            </div>
          </section>

        </div>
      </main>
      <Footer />
    </>
  );
}
