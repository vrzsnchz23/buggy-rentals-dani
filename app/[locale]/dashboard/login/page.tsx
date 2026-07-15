import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";
import Image from "next/image";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string; callbackUrl?: string }>;
}

export default async function DashboardLoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;
  const isEs = locale === "es";

  const session = await auth();
  if (session?.user) redirect(`/${locale}/dashboard`);

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

        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-4">
          <p className="text-gray-600 text-sm text-center mb-2">
            {isEs
              ? "Accede a tus reservaciones, cupones exclusivos y más"
              : "Access your bookings, exclusive coupons, and more"}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm text-center">
              {error === "OAuthAccountNotLinked"
                ? (isEs ? "Este correo ya está registrado con otro método" : "This email is already registered with another method")
                : (isEs ? "Ocurrió un error. Intenta de nuevo." : "Something went wrong. Please try again.")}
            </div>
          )}

          <GoogleSignInButton locale={locale} />

          <p className="text-xs text-gray-400 text-center pt-2">
            {isEs
              ? "Usa el correo de Google con el que hiciste tu reservación para ver tus bookings"
              : "Use the Google account linked to the email you booked with to see your bookings"}
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          {isEs ? "¿Eres admin?" : "Admin?"}{" "}
          <a href={`/${locale}/admin/login`} className="text-[#1B4F72] hover:underline font-medium">
            {isEs ? "Acceso admin →" : "Admin login →"}
          </a>
        </p>
      </div>
    </div>
  );
}
