import { db } from "@/lib/db";
import { formatCurrency, formatDate, parseItems, VEHICLES } from "@/lib/utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { BookingActions } from "@/components/admin/BookingActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, Car, MapPin, CreditCard, FileText } from "lucide-react";

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function BookingDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const booking = await db.booking.findUnique({ where: { id } });
  if (!booking) notFound();

  const statusColor = (s: string): "default" | "success" | "warning" | "danger" | "info" => {
    if (s === "confirmed") return "success";
    if (s === "pending") return "warning";
    if (s === "cancelled") return "danger";
    if (s === "completed") return "info";
    return "default";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link href={`/${locale}/admin/bookings`} className="text-gray-400 hover:text-gray-600 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-black text-[#1B4F72]">
              Booking #{booking.id.slice(-8).toUpperCase()}
            </h1>
            <Badge variant={statusColor(booking.status)}>{booking.status}</Badge>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Guest */}
              <Section title="Guest Information" icon={<Phone className="w-4 h-4" />}>
                <Row label="Name" value={booking.guestName} />
                <Row label="Email" value={booking.guestEmail} />
                <Row label="Phone" value={booking.guestPhone} />
                <Row label="Driver&apos;s License" value={booking.driversLicense || "—"} />
              </Section>

              {/* Rental */}
              <Section title="Rental Details" icon={<Car className="w-4 h-4" />}>
                <Row label="Date" value={formatDate(booking.rentalDate)} />
                {parseItems(booking.items).filter((i) => i.qty > 0).map((item, idx) => (
                  <Row key={idx} label={`${item.qty}× ${VEHICLES[item.type].label}`} value={formatCurrency(item.subtotal)} />
                ))}
                <Row label="Pickup" value={booking.deliveryType === "pickup" ? "Port meeting point" : "Hotel delivery"} />
                {booking.hotelName && <Row label="Hotel" value={booking.hotelName} />}
                {booking.hotelAddress && <Row label="Hotel Address" value={booking.hotelAddress} />}
              </Section>

              {/* Cruise */}
              {(booking.cruiseName || booking.cruiseShip) && (
                <Section title="Cruise Information" icon={<MapPin className="w-4 h-4" />}>
                  {booking.cruiseName && <Row label="Cruise Line" value={booking.cruiseName} />}
                  {booking.cruiseShip && <Row label="Ship" value={booking.cruiseShip} />}
                  {booking.cruiseArrival && <Row label="Arrival" value={new Date(booking.cruiseArrival).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} />}
                </Section>
              )}

              {/* Notes */}
              {booking.notes && (
                <Section title="Notes" icon={<FileText className="w-4 h-4" />}>
                  <p className="text-sm text-gray-600">{booking.notes}</p>
                </Section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Payment */}
              <Section title="Payment" icon={<CreditCard className="w-4 h-4" />}>
                <Row label="Total" value={formatCurrency(booking.totalAmount)} highlight />
                <Row label="Deposit" value={formatCurrency(booking.depositAmount)} />
                <Row label="Method" value={booking.paymentMethod.replace(/_/g, " ")} />
                <Row label="Status" value={booking.paymentStatus} />
                {booking.stripePaymentId && (
                  <Row label="Stripe ID" value={booking.stripePaymentId.slice(0, 20) + "…"} />
                )}
              </Section>

              {/* Actions */}
              <BookingActions booking={booking} locale={locale} />

              {/* Waiver */}
              <div className={`rounded-xl p-4 ${booking.waiverAccepted ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}>
                <div className={`font-semibold text-sm mb-1 ${booking.waiverAccepted ? "text-green-700" : "text-red-700"}`}>
                  {booking.waiverAccepted ? "✅ Waiver Signed" : "⚠️ Waiver Not Signed"}
                </div>
                {booking.waiverSignedAt && (
                  <div className="text-xs text-gray-500">{new Date(booking.waiverSignedAt).toLocaleString()}</div>
                )}
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-400 space-y-1 p-4 bg-white rounded-xl">
                <div>Created: {new Date(booking.createdAt).toLocaleString()}</div>
                <div>Updated: {new Date(booking.updatedAt).toLocaleString()}</div>
                <div>Locale: {booking.locale}</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="font-bold text-[#1B4F72] text-sm flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        {icon} {title}
      </h2>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium text-right ${highlight ? "text-[#E8836A] font-bold text-base" : "text-gray-700"}`}>{value}</span>
    </div>
  );
}
