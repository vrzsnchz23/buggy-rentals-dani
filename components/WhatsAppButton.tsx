"use client";
import { useLocale } from "next-intl";
import { MessageCircle } from "lucide-react";

export function WhatsAppButton() {
  const locale = useLocale();
  const msg = locale === "es"
    ? "¡Hola! Me interesa rentar un buggy en Cozumel 🚗"
    : "Hi! I'm interested in renting a buggy in Cozumel 🚗";

  return (
    <a
      href={`https://wa.me/529872743477?text=${encodeURIComponent(msg)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-green-500/30 transition-all hover:scale-105 hover:-translate-y-1 group"
    >
      <MessageCircle className="w-6 h-6 fill-white stroke-none" />
      <span className="text-sm max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap">
        {locale === "es" ? "¡Escríbenos!" : "Chat with us!"}
      </span>
    </a>
  );
}
