import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { db } from "@/lib/db";
import { formatCurrency, formatDate, parseItems, VEHICLES } from "@/lib/utils";
import { CheckCircle, MessageCircle, Calendar } from "lucide-react";
import Link from "next/link";
import { getLocale } from "next-intl/server";

interface Props {
  searchParams: Promise<{ id?: string; session_id?: string }>;
}

export default async function ConfirmationPage({ searchParams }: Props) {
  const { id } = await searchParams;
  const locale = await getLocale();
  const whatsapp = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "+529872743477";

  if (!id) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found.</p>
      </div>
    );
  }

  const booking = await db.booking.findUnique({ where: { id } });

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Booking not found.</p>
      </div>
    );
  }

  const waMsg = encodeURIComponent(
    `Hi! I just booked a buggy rental. Confirmation #${booking.id.slice(-8).toUpperCase()}`
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0EB] pt-24 pb-16">
        <div className="max-w-xl mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            {/* Success icon */}
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>

            <h1 className="text-3xl font-black text-[#1B4F72] mb-2">You&apos;re all set!</h1>
            <p className="text-gray-500 mb-6">
              We sent a confirmation to <strong>{booking.guestEmail}</strong>
            </p>

            {/* Confirmation number */}
            <div className="bg-[#1B4F72] text-white rounded-xl p-4 mb-6">
              <div className="text-xs text-gray-300 mb-1">Confirmation Number</div>
              <div className="text-2xl font-black tracking-widest">
                #{booking.id.slice(-8).toUpperCase()}
              </div>
            </div>

            {/* Booking details */}
            <div className="bg-[#F5F0EB] rounded-xl p-4 text-sm text-left space-y-2 mb-6">
              <Detail label="Date" value={formatDate(booking.rentalDate)} />
              {parseItems(booking.items).filter((i) => i.qty > 0).map((item, idx) => (
                <Detail key={idx} label={`${item.qty}× ${VEHICLES[item.type].label}`} value={formatCurrency(item.subtotal)} />
              ))}
              <Detail label="Pickup" value={booking.deliveryType === "pickup" ? "Port meeting point (across from Puerta Maya)" : `Hotel: ${booking.hotelName}`} />
              <Detail label="Total" value={formatCurrency(booking.totalAmount)} />
              <Detail
                label="Payment"
                value={
                  booking.paymentMethod === "cash"
                    ? "Cash on pickup"
                    : booking.paymentMethod === "online_deposit"
                    ? `Deposit paid (${formatCurrency(booking.depositAmount)})`
                    : "Fully paid online"
                }
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-xl transition-colors"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Us
              </a>
              <Link
                href={`/${locale}`}
                className="flex-1 flex items-center justify-center gap-2 bg-[#F5F0EB] hover:bg-gray-200 text-[#1B4F72] font-bold py-3 px-4 rounded-xl transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>

          {/* Info box */}
          <div className="mt-6 bg-[#1B4F72]/5 border border-[#1B4F72]/10 rounded-xl p-4 text-sm text-gray-600">
            <strong className="text-[#1B4F72]">What&apos;s next?</strong>
            <ul className="mt-2 space-y-1 text-sm">
              <li>📧 Check your email for the full confirmation</li>
              <li>📱 We&apos;ll WhatsApp you the day before with details</li>
              <li>📍 Meet us across from Puerta Maya & SSA ports at 8:00 AM</li>
              <li>🪪 Bring your driver&apos;s license on the day</li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-gray-400">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
