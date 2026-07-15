import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { CouponsManager } from "@/components/admin/CouponsManager";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminCouponsPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/admin/login`);

  const coupons = await db.coupon.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  const serialized = coupons.map((c) => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    validUntil: c.validUntil?.toISOString() || null,
  }));

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-black text-[#0F2035]">Partner Coupons</h1>
          </div>
          <CouponsManager initialCoupons={serialized} />
        </div>
      </main>
    </div>
  );
}
