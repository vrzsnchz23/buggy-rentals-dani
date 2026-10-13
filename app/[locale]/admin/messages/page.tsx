import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { AdminShell, AdminHeader } from "@/components/admin/AdminShell";
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
    <AdminShell locale={locale} width="5xl">
      <AdminHeader title="Messages" eyebrow="Inbox" />
      <MessagesPanel users={serialized} />
    </AdminShell>
  );
}
