"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function DashboardLoginPage() {
  const params = useParams();
  const locale = params.locale as string;
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEs = locale === "es";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customer/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push(`/${locale}/dashboard/verify?email=${encodeURIComponent(email)}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
            <Image src="/images/buggy12.png" alt="Buggy Rentals" width={64} height={64} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-black text-[#1B4F72]">
            {isEs ? "Tu Dashboard" : "Your Dashboard"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">Buggy Rentals with Dani · Cozumel</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600 text-sm text-center mb-6">
            {isEs
              ? "Ingresa tu correo para recibir un código de acceso"
              : "Enter your email to receive an access code"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/30 focus:border-[#1B4F72] text-sm"
                placeholder={isEs ? "tu@correo.com" : "your@email.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E8836A] hover:bg-[#d4735c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
              {isEs ? "Enviar código" : "Send code"}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6">
            {isEs
              ? "Usa el mismo correo con el que hiciste tu reservación"
              : "Use the same email you booked with"}
          </p>
        </div>
      </div>
    </div>
  );
}
