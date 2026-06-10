import { db } from "@/lib/db";
import { formatCurrency, formatDate, parseItems, VEHICLES } from "@/lib/utils";
import { AdminNav } from "@/components/admin/AdminNav";
import { Badge } from "@/components/ui/Badge";
import { BookingActions } from "@/components/admin/BookingActions";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Phone, Mail, Car, MapPin, CreditCard, FileText, User, CheckCircle2, XCircle } from "lucide-react";

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
    <div className="min-h-screen bg-[#F0F4F8]">
      <AdminNav locale={locale} />
      <main className="ml-0 lg:ml-60 p-6 pt-20 lg:pt-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-3 mb-8">
            <Link
              href={`/${locale}/admin/bookings`}
              className="w-9 h-9 bg-white rounded-xl shadow-sm flex items-center justify-center text-gray-400 hover:text-gray-700 hover:shadow-md transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-[#0F2035]">
                  Booking #{booking.id.slice(-8).toUpperCase()}
                </h1>
                <Badge variant={statusColor(booking.status)}>{booking.status}</Badge>
              </div>
              <p className="text-gray-400 text-sm mt-0.5">Created {new Date(booking.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main info */}
            <div className="lg:col-span-2 space-y-5">
              <Section title="Guest Information" icon={<User className="w-4 h-4" />} color="blue">
                <Row label="Name" value={booking.guestName} />
                <Row label="Email" value={booking.guestEmail} />
                <Row label="Phone" value={booking.guestPhone} />
                <Row label="Driver&apos;s License" value={booking.driversLicense || "—"} />
              </Section>

              <Section title="Rental Details" icon={<Car className="w-4 h-4" />} color="orange">
                <Row label="Date" value={formatDate(booking.rentalDate)} />
                {parseItems(booking.items)
                  .filter((i) => i.qty > 0)
                  .map((item, idx) => (
                    <Row key={idx} label={`${item.qty}× ${VEHICLES[item.type].label}`} value={formatCurrency(item.subtotal)} />
                  ))}
                <Row label="Pickup" value={booking.deliveryType === "pickup" ? "Port meeting point" : "Hotel delivery"} />
                {booking.hotelName && <Row label="Hotel" value={booking.hotelName} />}
                {booking.hotelAddress && <Row label="Hotel Address" value={booking.hotelAddress} />}
              </Section>

              {(booking.cruiseName || booking.cruiseShip) && (
                <Section title="Cruise Information" icon={<MapPin className="w-4 h-4" />} color="teal">
                  {booking.cruiseName && <Row label="Cruise Line" value={booking.cruiseName} />}
                  {booking.cruiseShip && <Row label="Ship" value={booking.cruiseShip} />}
                  {booking.cruiseArrival && (
                    <Row
                      label="Arrival"
                      value={new Date(booking.cruiseArrival).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    />
                  )}
                </Section>
              )}

              {booking.notes && (
                <Section title="Notes" icon={<FileText className="w-4 h-4" />} color="gray">
                  <p className="text-sm text-gray-600 leading-relaxed">{booking.notes}</p>
                </Section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-5">
              <Section title="Payment" icon={<CreditCard className="w-4 h-4" />} color="green">
                <Row label="Total" value={formatCurrency(booking.totalAmount)} highlight />
                <Row label="Deposit" value={formatCurrency(booking.depositAmount)} />
                <Row label="Method" value={booking.paymentMethod.replace(/_/g, " ")} />
                <Row label="Status" value={booking.paymentStatus} />
                {booking.stripePaymentId && (
                  <Row label="Stripe ID" value={booking.stripePaymentId.slice(0, 20) + "…"} />
                )}
              </Section>

              <BookingActions booking={booking} locale={locale} />

              {/* Waiver */}
              <div
                className={`rounded-2xl p-4 flex items-center gap-3 ${
                  booking.waiverAccepted
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-red-50 border border-red-200"
                }`}
              >
                {booking.waiverAccepted ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                )}
                <div>
                  <div className={`font-semibold text-sm ${booking.waiverAccepted ? "text-emerald-700" : "text-red-600"}`}>
                    {booking.waiverAccepted ? "Waiver Signed" : "Waiver Not Signed"}
                  </div>
                  {booking.waiverSignedAt && (
                    <div className="text-xs text-gray-500 mt-0.5">
                      {new Date(booking.waiverSignedAt).toLocaleString()}
                    </div>
                  )}
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-400 space-y-1.5 p-4 bg-white rounded-2xl shadow-sm">
                <div className="flex justify-between">
                  <span>Created</span>
                  <span className="text-gray-600">{new Date(booking.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Updated</span>
                  <span className="text-gray-600">{new Date(booking.updatedAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Locale</span>
                  <span className="text-gray-600 uppercase">{booking.locale}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const sectionColors = {
  blue: { bg: "bg-[#1B4F72]/10", text: "text-[#1B4F72]" },
  orange: { bg: "bg-[#E8836A]/10", text: "text-[#E8836A]" },
  teal: { bg: "bg-[#7FB5B5]/20", text: "text-[#0e7c7b]" },
  green: { bg: "bg-emerald-50", text: "text-emerald-600" },
  gray: { bg: "bg-gray-100", text: "text-gray-500" },
};

function Section({
  title,
  icon,
  children,
  color = "blue",
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  color?: keyof typeof sectionColors;
}) {
  const c = sectionColors[color];
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <h2 className="font-bold text-[#0F2035] text-sm flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
        <span className={`w-7 h-7 rounded-lg ${c.bg} flex items-center justify-center ${c.text}`}>{icon}</span>
        {title}
      </h2>
      <div className="space-y-2.5">{children}</div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex justify-between gap-4 text-sm">
      <span className="text-gray-400">{label}</span>
      <span className={`font-medium text-right ${highlight ? "text-[#E8836A] font-bold text-lg" : "text-gray-700"}`}>
        {value}
      </span>
    </div>
  );
}
