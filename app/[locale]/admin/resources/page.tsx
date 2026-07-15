import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
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
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-black text-[#0F2035] mb-6">Resources / Videos</h1>
          <ResourcesManager initialResources={serialized} />
        </div>
      </main>
    </div>
  );
}
