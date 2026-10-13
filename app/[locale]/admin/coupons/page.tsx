import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminShell, AdminHeader } from "@/components/admin/AdminShell";
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
    <AdminShell locale={locale} width="4xl">
      <AdminHeader title="Partner perks" eyebrow="Offers" meta="What guests see in their dashboard" />
      <CouponsManager initialCoupons={serialized} />
    </AdminShell>
  );
}
