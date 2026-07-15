import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

interface Props {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ error?: string }>;
}

export default async function DashboardLoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { error } = await searchParams;

  const session = await auth();
  if (session?.user) redirect(`/${locale}/dashboard`);

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-44 mx-auto mb-4">
            <Image src="/logo.png" alt="Buggy Rentals" width={176} height={52} className="w-full h-auto object-contain" />
          </div>
          <p className="text-gray-500 text-sm">Cozumel, Mexico</p>
        </div>

        <LoginForm locale={locale} error={error} />
      </div>
    </div>
  );
}
