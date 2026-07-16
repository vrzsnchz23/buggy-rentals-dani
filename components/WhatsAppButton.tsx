"use client";
import { useState } from "react";
import { useLocale } from "next-intl";
import { MessageCircle, X } from "lucide-react";

const CHIPS = {
  en: [
    { label: "🚢 I want to book for my cruise stop", msg: "Hi! I want to book a buggy for my cruise stop in Cozumel 🚢" },
    { label: "💰 Question about pricing", msg: "Hi! I have a question about your rental prices 💰" },
    { label: "👀 Just browsing options", msg: "Hi! I'm exploring buggy rental options in Cozumel 🏝️" },
  ],
  es: [
    { label: "🚢 Quiero reservar para mi crucero", msg: "¡Hola! Quiero reservar un buggy para mi escala de crucero en Cozumel 🚢" },
    { label: "💰 Pregunta sobre precios", msg: "¡Hola! Tengo una pregunta sobre los precios de renta 💰" },
    { label: "👀 Solo estoy viendo opciones", msg: "¡Hola! Estoy explorando opciones de renta de buggies en Cozumel 🏝️" },
  ],
};

const PHONE = "529872743477";

export function WhatsAppButton() {
  const locale = useLocale() as "en" | "es";
  const [open, setOpen] = useState(false);
  const chips = CHIPS[locale] ?? CHIPS.en;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Popup */}
      {open && (
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="bg-[#075E54] px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 text-white fill-white stroke-none" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-white font-bold text-sm leading-tight">Buggy Rentals with Dani</div>
              <div className="text-green-300 text-xs">
                {locale === "es" ? "Normalmente responde en minutos" : "Typically replies in minutes"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Intro bubble */}
          <div className="px-4 pt-4 pb-2">
            <div className="bg-[#DCF8C6] rounded-2xl rounded-tl-sm px-4 py-3 text-sm text-gray-800 shadow-sm max-w-[90%]">
              {locale === "es"
                ? "¡Hola! 👋 ¿En qué te puedo ayudar?"
                : "Hi there! 👋 How can I help you?"}
            </div>
          </div>

          {/* Chips */}
          <div className="px-4 pb-4 pt-2 flex flex-col gap-2">
            {chips.map((chip, i) => (
              <a
                key={i}
                href={`https://wa.me/${PHONE}?text=${encodeURIComponent(chip.msg)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-left text-sm font-semibold text-[#075E54] bg-white border-2 border-[#075E54]/20 hover:border-[#075E54]/60 hover:bg-[#075E54]/5 rounded-xl px-4 py-2.5 transition-all"
                onClick={() => setOpen(false)}
              >
                {chip.label}
              </a>
            ))}

            {/* Write own message */}
            <a
              href={`https://wa.me/${PHONE}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-center text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1"
              onClick={() => setOpen(false)}
            >
              {locale === "es" ? "Escribir mi propio mensaje →" : "Write my own message →"}
            </a>
          </div>
        </div>
      )}

      {/* FAB button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Chat on WhatsApp"
        className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:-translate-y-1 group"
      >
        <MessageCircle className="w-6 h-6 fill-white stroke-none" />
        <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
          {open
            ? (locale === "es" ? "Cerrar" : "Close")
            : (locale === "es" ? "¡Escríbenos!" : "Chat with us!")}
        </span>
      </button>
    </div>
  );
}
