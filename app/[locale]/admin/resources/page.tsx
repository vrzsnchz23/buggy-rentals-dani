import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminShell, AdminHeader } from "@/components/admin/AdminShell";
import { ResourcesManager } from "@/components/admin/ResourcesManager";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminResourcesPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/admin/login`);

  const resources = await db.resource.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
  const serialized = resources.map((r) => ({ ...r, createdAt: r.createdAt.toISOString() }));

  return (
    <AdminShell locale={locale} width="4xl">
      <AdminHeader title="Resources" eyebrow="Videos" meta="Clips guests can watch before they arrive" />
      <ResourcesManager initialResources={serialized} />
    </AdminShell>
  );
}
