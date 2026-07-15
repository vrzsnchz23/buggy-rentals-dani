"use client";
import { useState, useRef } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function DashboardVerifyPage() {
  const params = useParams();
  const locale = params.locale as string;
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const router = useRouter();
  const isEs = locale === "es";

  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  function handleChange(idx: number, val: string) {
    const char = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[idx] = char;
    setCode(next);
    if (char && idx < 5) inputs.current[idx + 1]?.focus();
    if (next.every((c) => c)) verifyCode(next.join(""));
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      inputs.current[idx - 1]?.focus();
    }
  }

  async function verifyCode(fullCode: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/customer/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push(`/${locale}/dashboard`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Invalid code");
      setCode(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
      setLoading(false);
    }
  }

  async function resend() {
    setResending(true);
    await fetch("/api/customer/auth/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, locale }),
    });
    setResending(false);
    setResent(true);
    setTimeout(() => setResent(false), 5000);
  }

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-[#1B4F72] flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl">✉️</span>
          </div>
          <h1 className="text-2xl font-black text-[#1B4F72]">
            {isEs ? "Revisa tu correo" : "Check your email"}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEs ? "Código enviado a" : "Code sent to"}{" "}
            <span className="font-medium text-[#1B4F72]">{email}</span>
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600 text-sm text-center mb-6">
            {isEs ? "Ingresa el código de 6 dígitos:" : "Enter the 6-digit code:"}
          </p>

          <div className="flex gap-2 justify-center mb-6">
            {code.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => { inputs.current[idx] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className="w-11 h-13 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8836A] focus:ring-2 focus:ring-[#E8836A]/20 transition-all"
                autoFocus={idx === 0}
              />
            ))}
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-[#1B4F72] mb-4">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm">{isEs ? "Verificando..." : "Verifying..."}</span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm text-center mb-4">
              {error}
            </div>
          )}

          {resent && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl p-3 text-sm text-center mb-4 flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              {isEs ? "Código reenviado" : "Code resent"}
            </div>
          )}

          <button
            onClick={resend}
            disabled={resending}
            className="w-full text-sm text-gray-400 hover:text-[#1B4F72] transition-colors py-2"
          >
            {isEs ? "¿No recibiste el código? Reenviar" : "Didn't receive it? Resend code"}
          </button>
        </div>
      </div>
    </div>
  );
}
