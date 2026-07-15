import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/AdminNav";
import { MessagesPanel } from "@/components/admin/MessagesPanel";

interface Props {
  params: Promise<{ locale: string }>;
}

export default async function AdminMessagesPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session) redirect(`/${locale}/admin/login`);

  const users = await db.user.findMany({
    where: { messages: { some: {} } },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
      bookings: { select: { id: true, rentalDate: true, status: true }, orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { createdAt: "desc" },
  });

  const serialized = users.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    bookings: u.bookings.map((b) => ({ ...b, rentalDate: b.rentalDate.toISOString() })),
    messages: u.messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() })),
  }));

  return (
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-black text-[#0F2035] mb-6">Messages</h1>
          <MessagesPanel users={serialized} />
        </div>
      </main>
    </div>
  );
}
