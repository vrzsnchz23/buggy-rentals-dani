"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CalendarDays, Ticket, PlayCircle, MessageCircle, LogOut,
  CheckCircle2, Clock, XCircle, Send, Loader2, ExternalLink,
  ChevronRight, Car
} from "lucide-react";
import Image from "next/image";

type Message = { id: string; content: string; fromAdmin: boolean; createdAt: string; read: boolean };
type Coupon = { id: string; partnerName: string; title: string; description: string; code?: string; imageEmoji: string; validUntil?: string };
type Resource = { id: string; title: string; description?: string; youtubeUrl: string; category: string };
type Booking = {
  id: string; status: string; paymentStatus: string; rentalDate: string; returnDate?: string;
  items: { label: string; labelEs: string; qty: number; subtotal: string }[];
  totalAmount: string; deliveryType: string;
};

function getYouTubeId(url: string) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return match?.[1] || null;
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { icon: React.ReactNode; cls: string; label: string }> = {
    confirmed: { icon: <CheckCircle2 className="w-3 h-3" />, cls: "bg-emerald-100 text-emerald-700", label: "Confirmed" },
    pending: { icon: <Clock className="w-3 h-3" />, cls: "bg-amber-100 text-amber-700", label: "Pending" },
    cancelled: { icon: <XCircle className="w-3 h-3" />, cls: "bg-red-100 text-red-600", label: "Cancelled" },
    completed: { icon: <CheckCircle2 className="w-3 h-3" />, cls: "bg-blue-100 text-blue-700", label: "Completed" },
  };
  const s = map[status] || map.pending;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${s.cls}`}>
      {s.icon} {s.label}
    </span>
  );
}

export default function DashboardPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();
  const isEs = locale === "es";

  const [tab, setTab] = useState<"bookings" | "coupons" | "resources" | "messages">("bookings");
  const [data, setData] = useState<{
    user: { id: string; email: string; name?: string };
    bookings: Booking[];
    messages: Message[];
    coupons: Coupon[];
    resources: Resource[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgText, setMsgText] = useState("");
  const [sending, setSending] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const msgEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/customer/me")
      .then((r) => {
        if (r.status === 401) { router.replace(`/${locale}/dashboard/login`); return null; }
        return r.json();
      })
      .then((d) => {
        if (!d) return;
        setData(d);
        setMessages(d.messages || []);
        setLoading(false);
      });
  }, [locale, router]);

  useEffect(() => {
    if (tab === "messages") msgEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [tab, messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!msgText.trim()) return;
    setSending(true);
    const res = await fetch("/api/customer/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: msgText }),
    });
    if (res.ok) {
      const msg = await res.json();
      setMessages((prev) => [...prev, msg]);
      setMsgText("");
    }
    setSending(false);
  }

  async function logout() {
    const { signOut } = await import("next-auth/react");
    signOut({ callbackUrl: `/${locale}/dashboard/login` });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#1B4F72] animate-spin" />
      </div>
    );
  }

  const tabs = [
    { id: "bookings", icon: <CalendarDays className="w-4 h-4" />, label: isEs ? "Reservas" : "Bookings" },
    { id: "coupons", icon: <Ticket className="w-4 h-4" />, label: isEs ? "Cupones" : "Coupons" },
    { id: "resources", icon: <PlayCircle className="w-4 h-4" />, label: isEs ? "Recursos" : "Resources" },
    { id: "messages", icon: <MessageCircle className="w-4 h-4" />, label: "Mensajes" },
  ] as const;

  const unreadCount = messages.filter((m) => m.fromAdmin && !m.read).length;

  return (
    <div className="min-h-screen bg-[#F5F0EB]">
      {/* Header */}
      <header className="bg-[#1B4F72] text-white">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
              <Image src="/images/buggy12.png" alt="Buggy Rentals" width={36} height={36} className="w-full h-full object-cover" />
            </div>
            <div>
              <div className="font-bold text-sm leading-none">Buggy Rentals with Dani</div>
              <div className="text-xs text-white/50 mt-0.5">{data?.user.email}</div>
            </div>
          </div>
          <button onClick={logout} className="text-white/50 hover:text-white transition-colors p-1">
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-3xl mx-auto px-4 flex gap-0 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-all relative ${
                tab === t.id
                  ? "border-[#E8836A] text-white"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              {t.icon}
              {t.label}
              {t.id === "messages" && unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#E8836A] rounded-full text-xs flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          ))}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6">

        {/* ── BOOKINGS ── */}
        {tab === "bookings" && (
          <div className="space-y-4">
            <h2 className="font-bold text-[#0F2035] text-lg">
              {isEs ? "Mis Reservaciones" : "My Bookings"}
            </h2>
            {data?.bookings.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
                <Car className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>{isEs ? "Aún no tienes reservaciones" : "No bookings yet"}</p>
                <a href={`/${locale}/book`} className="mt-4 inline-block text-[#E8836A] font-semibold text-sm hover:underline">
                  {isEs ? "Reservar ahora →" : "Book now →"}
                </a>
              </div>
            )}
            {data?.bookings.map((b) => (
              <div key={b.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="font-bold text-[#0F2035] text-sm">
                      {b.rentalDate}{b.returnDate ? ` → ${b.returnDate}` : ""}
                    </div>
                    <div className="text-xs text-gray-400 mt-0.5">#{b.id.slice(-8).toUpperCase()}</div>
                  </div>
                  <StatusBadge status={b.status} />
                </div>
                <div className="space-y-1.5 text-sm">
                  {b.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-gray-600">
                      <span>{item.qty}× {isEs ? item.labelEs : item.label}</span>
                      <span className="font-medium">{item.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between text-sm">
                  <span className="text-gray-400">{isEs ? "Total" : "Total"}</span>
                  <span className="font-bold text-[#E8836A] text-base">{b.totalAmount}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── COUPONS ── */}
        {tab === "coupons" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-[#0F2035] text-lg">
                {isEs ? "Cupones Exclusivos" : "Exclusive Coupons"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEs
                  ? "Beneficios especiales para los clientes de Buggy Rentals with Dani"
                  : "Special perks for Buggy Rentals with Dani customers"}
              </p>
            </div>
            {data?.coupons.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
                <Ticket className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>{isEs ? "Próximamente más cupones" : "More coupons coming soon"}</p>
              </div>
            )}
            {data?.coupons.map((c) => (
              <div key={c.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-[#1B4F72] to-[#7FB5B5] p-5 flex items-center gap-4">
                  <span className="text-4xl">{c.imageEmoji}</span>
                  <div>
                    <div className="text-xs text-white/60 font-medium uppercase tracking-wider">{c.partnerName}</div>
                    <div className="text-white font-bold text-lg leading-tight">{c.title}</div>
                  </div>
                </div>
                <div className="p-5">
                  <p className="text-gray-600 text-sm mb-4">{c.description}</p>
                  {c.code && (
                    <div className="bg-[#F5F0EB] rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-400 mb-1">{isEs ? "Tu código" : "Your code"}</div>
                      <div className="font-mono font-bold text-[#1B4F72] text-xl tracking-widest">{c.code}</div>
                    </div>
                  )}
                  {!c.code && (
                    <div className="bg-[#E8836A]/10 rounded-xl p-3 text-center text-sm text-[#E8836A] font-medium">
                      {isEs ? "Solo muestra esta pantalla al llegar" : "Just show this screen when you arrive"}
                    </div>
                  )}
                  {c.validUntil && (
                    <div className="text-xs text-gray-400 mt-3 text-right">
                      {isEs ? "Válido hasta:" : "Valid until:"} {new Date(c.validUntil).toLocaleDateString()}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── RESOURCES ── */}
        {tab === "resources" && (
          <div className="space-y-4">
            <div>
              <h2 className="font-bold text-[#0F2035] text-lg">
                {isEs ? "Recursos Importantes" : "Important Resources"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEs
                  ? "Videos y guías para aprovechar al máximo tu visita a Cozumel"
                  : "Videos and guides to make the most of your Cozumel visit"}
              </p>
            </div>
            {data?.resources.length === 0 && (
              <div className="bg-white rounded-2xl p-8 text-center text-gray-400 shadow-sm">
                <PlayCircle className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                <p>{isEs ? "Próximamente videos" : "Videos coming soon"}</p>
              </div>
            )}
            {data?.resources.map((r) => {
              const ytId = getYouTubeId(r.youtubeUrl);
              return (
                <div key={r.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                  {ytId && (
                    <div className="aspect-video relative bg-black">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${ytId}`}
                        title={r.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-bold text-[#0F2035] text-sm">{r.title}</div>
                        {r.description && <p className="text-gray-500 text-sm mt-1">{r.description}</p>}
                      </div>
                      <a href={r.youtubeUrl} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 text-[#E8836A] hover:text-[#d4735c] transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <div className="mt-2">
                      <span className="inline-block text-xs bg-[#7FB5B5]/20 text-[#0e7c7b] px-2 py-0.5 rounded-full font-medium capitalize">
                        {r.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── MESSAGES ── */}
        {tab === "messages" && (
          <div className="flex flex-col" style={{ height: "calc(100vh - 200px)" }}>
            <div className="mb-4">
              <h2 className="font-bold text-[#0F2035] text-lg">
                {isEs ? "Mensajes con Dani" : "Messages with Dani"}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {isEs ? "Escríbenos cualquier duda sobre tu reservación" : "Ask us anything about your booking"}
              </p>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <MessageCircle className="w-10 h-10 mb-3 text-gray-300" />
                  <p className="text-sm">{isEs ? "Inicia la conversación" : "Start the conversation"}</p>
                </div>
              )}
              {messages.map((m) => (
                <div key={m.id} className={`flex ${m.fromAdmin ? "justify-start" : "justify-end"}`}>
                  <div className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.fromAdmin
                      ? "bg-[#F5F0EB] text-[#0F2035] rounded-tl-sm"
                      : "bg-[#E8836A] text-white rounded-tr-sm"
                  }`}>
                    {m.fromAdmin && (
                      <div className="text-xs font-bold text-[#1B4F72] mb-1">Dani 🌴</div>
                    )}
                    <p className="leading-relaxed">{m.content}</p>
                    <div className={`text-xs mt-1 ${m.fromAdmin ? "text-gray-400" : "text-white/60"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={msgEndRef} />
            </div>

            <form onSubmit={sendMessage} className="mt-3 flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#E8836A]/30 focus:border-[#E8836A] text-sm shadow-sm"
                placeholder={isEs ? "Escribe tu mensaje..." : "Type your message..."}
                value={msgText}
                onChange={(e) => setMsgText(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !msgText.trim()}
                className="bg-[#E8836A] hover:bg-[#d4735c] text-white px-4 py-3 rounded-xl transition-colors disabled:opacity-40 shadow-sm"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
