"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export function LoginForm({ locale, error }: { locale: string; error?: string }) {
  const isEs = locale === "es";
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingVerify, setLoadingVerify] = useState(false);
  const [formError, setFormError] = useState(error || "");

  // ── Step 1: send OTP ──
  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    setLoadingEmail(true);
    setFormError("");
    try {
      const res = await fetch("/api/customer/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, locale }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setCodeSent(true);
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Error sending code");
    } finally {
      setLoadingEmail(false);
    }
  }

  // ── Step 2: verify OTP ──
  function handleDigit(idx: number, val: string) {
    const digit = val.replace(/\D/g, "").slice(-1);
    const next = [...code];
    next[idx] = digit;
    setCode(next);
    if (digit && idx < 5) {
      (document.getElementById(`otp-${idx + 1}`) as HTMLInputElement)?.focus();
    }
    if (next.every((d) => d)) verifyCode(next.join(""));
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !code[idx] && idx > 0) {
      (document.getElementById(`otp-${idx - 1}`) as HTMLInputElement)?.focus();
    }
  }

  async function verifyCode(fullCode: string) {
    setLoadingVerify(true);
    setFormError("");
    const result = await signIn("email-otp", {
      email: email.toLowerCase().trim(),
      code: fullCode,
      redirect: false,
    });
    if (result?.error) {
      setFormError(isEs ? "Código incorrecto o expirado" : "Invalid or expired code");
      setCode(["", "", "", "", "", ""]);
      (document.getElementById("otp-0") as HTMLInputElement)?.focus();
      setLoadingVerify(false);
    } else {
      router.push(`/${locale}/dashboard`);
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 space-y-5">
      <h2 className="text-center font-bold text-[#1B4F72] text-lg">
        {isEs ? "Accede a tu cuenta" : "Access your account"}
      </h2>

      {formError && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm text-center">
          {formError === "OAuthAccountNotLinked"
            ? (isEs ? "Este correo ya está registrado con otro método" : "This email is already used with another sign-in method")
            : formError}
        </div>
      )}

      {/* Google */}
      <button
        onClick={() => { setLoadingGoogle(true); signIn("google", { callbackUrl: `/${locale}/dashboard` }); }}
        disabled={loadingGoogle}
        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 rounded-xl transition-all shadow-sm disabled:opacity-50"
      >
        {loadingGoogle ? <Loader2 className="w-5 h-5 animate-spin text-gray-400" /> : (
          <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
        )}
        {isEs ? "Continuar con Google" : "Continue with Google"}
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-xs text-gray-400 font-medium">{isEs ? "o con tu correo" : "or with your email"}</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* Email OTP */}
      {!codeSent ? (
        <form onSubmit={sendCode} className="space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="email"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1B4F72]/20 focus:border-[#1B4F72] text-sm"
              placeholder={isEs ? "tu@correo.com" : "your@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loadingEmail}
            className="w-full flex items-center justify-center gap-2 bg-[#E8836A] hover:bg-[#d4735c] text-white font-bold py-3 rounded-xl transition-colors disabled:opacity-50"
          >
            {loadingEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            {isEs ? "Enviar código" : "Send code"}
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 rounded-xl p-3">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{isEs ? `Código enviado a ${email}` : `Code sent to ${email}`}</span>
          </div>

          <div className="flex gap-2 justify-center">
            {code.map((digit, idx) => (
              <input
                key={idx}
                id={`otp-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleDigit(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                autoFocus={idx === 0}
                className="w-11 h-12 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#E8836A] focus:ring-2 focus:ring-[#E8836A]/20 transition-all"
              />
            ))}
          </div>

          {loadingVerify && (
            <div className="flex items-center justify-center gap-2 text-[#1B4F72] text-sm">
              <Loader2 className="w-4 h-4 animate-spin" />
              {isEs ? "Verificando..." : "Verifying..."}
            </div>
          )}

          <button
            onClick={() => { setCodeSent(false); setCode(["", "", "", "", "", ""]); setFormError(""); }}
            className="w-full text-xs text-gray-400 hover:text-gray-600 transition-colors py-1"
          >
            {isEs ? "← Cambiar correo" : "← Change email"}
          </button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-center">
        {isEs
          ? "Usa el correo con el que hiciste tu reservación"
          : "Use the email you booked with to see your reservations"}
      </p>
    </div>
  );
}
