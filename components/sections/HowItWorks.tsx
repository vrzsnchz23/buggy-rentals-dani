import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Image from "next/image";

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
        <span className="text-white text-xs font-black">D</span>
      </div>
      <div className="bg-[#DCF8C6] text-gray-800 text-sm rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[75%] shadow-sm leading-relaxed relative">
        {text}
        {time && (
          <span className="block text-right text-[10px] text-gray-400 mt-1 -mb-0.5">{time} ✓✓</span>
        )}
      </div>
    </div>
  );
}

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const locale = useLocale();
  const isEs = locale === "es";

  return (
    <section id="how-it-works" className="py-24 bg-[#F5F0EB] relative overflow-hidden">

      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#7FB5B5]/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#E8836A]/10 blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative">

        <div className="text-center mb-14">
          <span className="inline-block bg-[#1B4F72]/10 text-[#1B4F72] font-bold text-xs uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
            {isEs ? "Proceso simple" : "Simple Process"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-black text-[#1B4F72] mb-3">{t("title")}</h2>
          <p className="text-gray-400 text-lg">{t("subtitle")}</p>
        </div>

        {/* Two-column layout: chat on left, bullets on right */}
        <div className="flex flex-col lg:flex-row gap-10 items-center justify-center">

          {/* WhatsApp chat mockup */}
          <div className="w-full max-w-sm shrink-0">
            {/* Phone frame */}
            <div className="rounded-3xl overflow-hidden shadow-2xl border border-black/10" style={{ background: "#ECE5DD" }}>

              {/* WhatsApp header */}
              <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <span className="text-white font-black text-sm">D</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-bold text-sm leading-tight">Dani 🌴</div>
                  <div className="text-white/60 text-xs">Buggy Rentals Cozumel</div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-[#25D366]" />
                  <span className="text-white/60 text-xs">{isEs ? "en línea" : "online"}</span>
                </div>
              </div>

              {/* Chat area */}
              <div className="px-3 py-4 space-y-1 min-h-[380px] flex flex-col justify-end"
                   style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Ccircle cx='30' cy='30' r='1' fill='%23000' fill-opacity='0.03'/%3E%3C/svg%3E\")" }}>

                {/* Date separator */}
                <div className="flex justify-center mb-3">
                  <span className="bg-white/70 text-gray-500 text-xs px-3 py-1 rounded-full shadow-sm">
                    {isEs ? "Hoy" : "Today"}
                  </span>
                </div>

                <CustomerBubble text={isEs
                  ? "Hola! Quiero rentar un buggy para 4 personas el sábado 🙋"
                  : "Hi! I'd like to rent a buggy for 4 people on Saturday 🙋"
                } />

                <DaniBubble
                  text={isEs
                    ? "¡Hola! Qué bien 🎉 Aquí está tu link de reserva → buggycozumel.com/book\nSolo $25 de depósito y listo. Sin tarjeta de crédito. ¿A qué hora quieres recoger?"
                    : "Hey! Love it 🎉 Here's your booking link → buggycozumel.com/book\nJust $25 deposit and you're set. No credit card needed. What time works for pickup?"
                  }
                />

                <CustomerBubble text={isEs ? "Como a las 8am!" : "Around 8am works!"} />

                <DaniBubble
                  text={isEs
                    ? "¡Perfecto, confirmado! 🏁 Te espero el sábado a las 8am con el tanque lleno. Tip: empieza hacia el sur, primera playa a la derecha. 🏖️"
                    : "Perfect, you're confirmed! 🏁 See you Saturday at 8am, full tank ready. Tip: head south past the port, first beach on the right. 🏖️"
                  }
                  time="8:14"
                />

              </div>

              {/* Input bar */}
              <div className="bg-[#F0F0F0] px-3 py-2.5 flex items-center gap-2 border-t border-black/5">
                <div className="flex-1 bg-white rounded-full px-4 py-2 text-xs text-gray-300">
                  {isEs ? "Escribe un mensaje..." : "Type a message..."}
                </div>
                <div className="w-8 h-8 rounded-full bg-[#075E54] flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-center text-gray-400 text-xs mt-4 italic">
              {isEs ? "* Así funciona de verdad cada reserva." : "* This is literally how every booking works."}
            </p>
          </div>

          {/* Steps on the right */}
          <div className="flex flex-col gap-6 max-w-md w-full">
            {[
              {
                n: "01",
                title: isEs ? "Reserva en 2 minutos" : "Book online in 2 min",
                desc: isEs
                  ? "Elige tu fecha y cuántas personas van. $25 aseguran tu buggy — nada más necesitas."
                  : "Pick your date and group size. $25 holds your buggy — nothing else needed.",
                tag: isEs ? "$25 de depósito · sin tarjeta" : "$25 deposit · no credit card",
                color: "#7FB5B5",
              },
              {
                n: "02",
                title: isEs ? "Dani te escribe" : "Dani texts you",
                desc: isEs
                  ? "Recibes un WhatsApp confirmando hora y lugar. Pregunta lo que quieras — responde de verdad."
                  : "You get a WhatsApp confirming your pickup time and spot. Ask anything — she actually replies.",
                tag: isEs ? "Normalmente en menos de una hora" : "Usually within the hour",
                color: "#E8836A",
              },
              {
                n: "03",
                title: isEs ? "Recoge y sal a la isla" : "Pick up & go",
                desc: isEs
                  ? "Tanque lleno. Llaves. Un tip rápido de por dónde empezar. La isla es tuya."
                  : "Full tank. Keys. A quick tip on where to head first. The island is yours.",
                tag: isEs ? "Todo el día · regresas cuando quieras" : "All day · return whenever you're done",
                color: "#1B4F72",
              },
            ].map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="w-10 h-10 rounded-2xl shrink-0 flex items-center justify-center font-black text-white text-xs mt-0.5"
                  style={{ background: s.color }}
                >
                  {s.n}
                </div>
                <div>
                  <h3 className="font-black text-[#1B4F72] text-lg leading-tight mb-1">{s.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-2">{s.desc}</p>
                  <span className="inline-flex items-center gap-1.5 text-xs text-gray-400 bg-white rounded-full px-3 py-1 border border-gray-100">
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: s.color }} />
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}

            <Link
              href={`/${locale}/book`}
              className="mt-2 inline-flex items-center justify-center bg-[#E8836A] hover:bg-[#d4724f] text-white font-black text-base px-8 py-4 rounded-full transition-all hover:shadow-xl hover:shadow-[#E8836A]/30 hover:-translate-y-0.5 self-start"
            >
              {isEs ? "Reservar ahora →" : "Reserve Your Buggy →"}
            </Link>
            <p className="text-gray-400 text-xs -mt-3">
              {isEs ? "Menos de 3 minutos · Sin compromiso hasta el checkout" : "Takes less than 3 minutes · No commitment until checkout"}
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
