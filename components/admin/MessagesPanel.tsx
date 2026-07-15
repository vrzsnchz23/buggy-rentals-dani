"use client";
import { useState } from "react";
import { Send, Loader2, MessageCircle } from "lucide-react";

type Msg = { id: string; content: string; fromAdmin: boolean; read: boolean; createdAt: string };
type User = {
  id: string; email: string; name?: string | null;
  messages: Msg[];
  bookings: { id: string; rentalDate: string; status: string }[];
};

export function MessagesPanel({ users: initial }: { users: User[] }) {
  const [users, setUsers] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id || null);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const selected = users.find((u) => u.id === selectedId);
  const unread = (u: User) => u.messages.filter((m) => !m.fromAdmin && !m.read).length;

  async function send(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim() || !selectedId) return;
    setSending(true);
    const res = await fetch(`/api/admin/messages/${selectedId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: text }),
    });
    if (res.ok) {
      const msg = await res.json();
      setUsers((prev) => prev.map((u) => u.id === selectedId ? { ...u, messages: [...u.messages, msg] } : u));
      setText("");
    }
    setSending(false);
  }

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-12 text-center text-gray-400">
        <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
        <p>No messages yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ height: "calc(100vh - 180px)" }}>
      <div className="flex h-full">
        {/* User list */}
        <div className="w-72 border-r border-gray-100 overflow-y-auto shrink-0">
          {users.map((u) => {
            const last = u.messages[u.messages.length - 1];
            const nr = unread(u);
            return (
              <button
                key={u.id}
                onClick={() => setSelectedId(u.id)}
                className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedId === u.id ? "bg-[#F5F0EB]" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="font-semibold text-sm text-[#0F2035] truncate">{u.email}</div>
                    {last && (
                      <div className="text-xs text-gray-400 truncate mt-0.5">
                        {last.fromAdmin ? "You: " : ""}{last.content}
                      </div>
                    )}
                  </div>
                  {nr > 0 && (
                    <span className="shrink-0 bg-[#E8836A] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                      {nr}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Chat */}
        {selected ? (
          <div className="flex-1 flex flex-col min-w-0">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
              <div className="font-semibold text-[#0F2035] text-sm">{selected.email}</div>
              {selected.bookings[0] && (
                <div className="text-xs text-gray-400 mt-0.5">
                  Latest booking: {new Date(selected.bookings[0].rentalDate).toLocaleDateString()} — {selected.bookings[0].status}
                </div>
              )}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {selected.messages.map((m) => (
                <div key={m.id} className={`flex ${m.fromAdmin ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                    m.fromAdmin
                      ? "bg-[#1B4F72] text-white rounded-tr-sm"
                      : "bg-[#F5F0EB] text-[#0F2035] rounded-tl-sm"
                  }`}>
                    <p className="leading-relaxed">{m.content}</p>
                    <div className={`text-xs mt-1 ${m.fromAdmin ? "text-white/50" : "text-gray-400"}`}>
                      {new Date(m.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      {" · "}
                      {new Date(m.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Reply */}
            <form onSubmit={send} className="p-4 border-t border-gray-100 flex gap-2">
              <input
                type="text"
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] text-sm"
                placeholder="Reply to customer..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={sending}
              />
              <button
                type="submit"
                disabled={sending || !text.trim()}
                className="bg-[#1B4F72] hover:bg-[#154060] text-white px-4 py-2.5 rounded-xl transition-colors disabled:opacity-40 flex items-center gap-2 text-sm font-medium"
              >
                {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Send
              </button>
            </form>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}
