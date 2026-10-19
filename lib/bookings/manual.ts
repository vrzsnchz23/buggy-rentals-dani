import { VEHICLES, type VehicleType } from "@/lib/utils";

/**
 * Shared vocabulary for manually-registered bookings.
 *
 * The dashboard only ever saw bookings that came through the website, while
 * most last-minute rentals are closed over WhatsApp, by phone, or at the
 * module by the port. The numbers were therefore far below the real
 * operation. These constants back the quick-entry form and the per-channel
 * reporting that fixes that.
 */

export const CHANNELS = ["web", "whatsapp", "call", "walk_in", "referral"] as const;
export type Channel = (typeof CHANNELS)[number];

export const CHANNEL_LABEL: Record<Channel, string> = {
  web: "Web",
  whatsapp: "WhatsApp",
  call: "Llamada",
  walk_in: "Módulo",
  referral: "Referido",
};

/** Channels a human can pick. `web` is assigned by the public booking API. */
export const MANUAL_CHANNELS = CHANNELS.filter((c) => c !== "web") as Exclude<Channel, "web">[];

export const UNIT_SOURCES = ["own", "partner"] as const;
export type UnitSource = (typeof UNIT_SOURCES)[number];

/** Who can be recorded as having taken the booking. */
export const STAFF = ["Dani", "Luis"] as const;
export type Staff = (typeof STAFF)[number];

/**
 * Payment state of a manual booking, mapped onto the columns the rest of the
 * app already uses, so manual bookings are indistinguishable from web ones
 * in every existing query.
 *
 * `deposit` carries an amount; the difference between `depositAmount` and
 * `totalAmount` is what is still owed. Nothing here is counted as collected
 * unless it really was.
 */
export const PAYMENT_STATES = ["paid", "deposit", "pending"] as const;
export type PaymentState = (typeof PAYMENT_STATES)[number];

/**
 * How many vehicles we own, as opposed to what we can source from partners.
 *
 * Deliberately separate from `VEHICLES[x].stock`, which is what the public
 * booking form is allowed to sell — that number can include partner capacity.
 * This one answers "did we fill our own fleet today?".
 */
export const OWN_FLEET: Record<VehicleType, number> = {
  buggy: 5,
  compact: 2,
  jimny: 1,
};

/** Default rate for a vehicle; the form lets staff override a negotiated price. */
export function defaultPrice(type: VehicleType): number {
  return VEHICLES[type].price;
}

export type ManualBookingInput = {
  guestName: string;
  guestPhone: string;
  guestEmail?: string;
  rentalDate: string;
  vehicleType: VehicleType;
  qty: number;
  days: number;
  unitPrice: number;
  unitSource: UnitSource;
  partnerName?: string;
  paymentState: PaymentState;
  depositAmount?: number;
  channel: Exclude<Channel, "web">;
  createdBy: Staff;
  notes?: string;
};

export type ValidationResult =
  | { ok: true; value: ManualBookingInput }
  | { ok: false; errors: string[] };

/**
 * Server-side validation. The form validates too, but a browser can be
 * bypassed and this endpoint writes money figures into the dashboard, so
 * every field is re-checked here and nothing is trusted from the client.
 */
export function validateManualBooking(raw: unknown): ValidationResult {
  const errors: string[] = [];
  const b = (raw ?? {}) as Record<string, unknown>;

  const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
  const num = (v: unknown) => (typeof v === "number" ? v : Number(v));

  const guestName = str(b.guestName);
  const guestPhone = str(b.guestPhone);
  const guestEmail = str(b.guestEmail);
  if (!guestName) errors.push("El nombre del cliente es obligatorio.");
  if (!guestPhone) errors.push("El teléfono es obligatorio.");
  if (guestEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestEmail)) {
    errors.push("El email no tiene un formato válido.");
  }

  const vehicleType = str(b.vehicleType) as VehicleType;
  if (!(vehicleType in VEHICLES)) errors.push("Selecciona un vehículo válido.");

  const rentalDate = str(b.rentalDate);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(rentalDate)) errors.push("La fecha de renta no es válida.");

  const qty = num(b.qty);
  if (!Number.isInteger(qty) || qty < 1 || qty > 20) errors.push("La cantidad debe estar entre 1 y 20.");

  const days = num(b.days);
  if (!Number.isInteger(days) || days < 1 || days > 60) errors.push("Los días deben estar entre 1 y 60.");

  // Allowed to differ from the list price — a Jimny goes out at the buggy
  // rate when the buggies are gone — but never negative or absurd.
  const unitPrice = num(b.unitPrice);
  if (!Number.isFinite(unitPrice) || unitPrice < 0 || unitPrice > 10000) {
    errors.push("El precio por unidad no es válido.");
  }

  const unitSource = str(b.unitSource) as UnitSource;
  if (!UNIT_SOURCES.includes(unitSource)) errors.push("Origen de la unidad no válido.");
  const partnerName = str(b.partnerName);

  const channel = str(b.channel) as Exclude<Channel, "web">;
  if (!MANUAL_CHANNELS.includes(channel)) errors.push("Canal no válido.");

  const createdBy = str(b.createdBy) as Staff;
  if (!STAFF.includes(createdBy)) errors.push("Selecciona quién atendió.");

  const paymentState = str(b.paymentState) as PaymentState;
  if (!PAYMENT_STATES.includes(paymentState)) errors.push("Estado de pago no válido.");

  const total = unitPrice * qty * days;
  let depositAmount = num(b.depositAmount);
  if (paymentState === "deposit") {
    if (!Number.isFinite(depositAmount) || depositAmount <= 0) {
      errors.push("Indica el monto del anticipo.");
    } else if (depositAmount > total) {
      errors.push("El anticipo no puede ser mayor que el total.");
    }
  } else {
    // Paid in full means the deposit field is the whole total; pending means
    // nothing has been collected. Either way the client's value is ignored.
    depositAmount = paymentState === "paid" ? total : 0;
  }

  if (errors.length) return { ok: false, errors };

  return {
    ok: true,
    value: {
      guestName,
      guestPhone,
      guestEmail: guestEmail || undefined,
      rentalDate,
      vehicleType,
      qty,
      days,
      unitPrice,
      unitSource,
      partnerName: unitSource === "partner" ? partnerName || undefined : undefined,
      paymentState,
      depositAmount,
      channel,
      createdBy,
      notes: str(b.notes) || undefined,
    },
  };
}

/**
 * Maps a manual booking onto the columns the existing dashboard queries read,
 * so it counts in every metric without any of them being special-cased.
 */
export function toBookingRow(input: ManualBookingInput) {
  const total = input.unitPrice * input.qty * input.days;
  const items = [
    {
      type: input.vehicleType,
      qty: input.qty,
      unitPrice: input.unitPrice,
      subtotal: total,
    },
  ];

  const paymentStatus =
    input.paymentState === "paid" ? "paid" : input.paymentState === "deposit" ? "deposit_paid" : "unpaid";

  const rentalDate = new Date(`${input.rentalDate}T12:00:00.000Z`);
  const returnDate =
    input.days > 1
      ? new Date(rentalDate.getTime() + (input.days - 1) * 86400000)
      : null;

  return {
    guestName: input.guestName,
    guestEmail: input.guestEmail ?? "",
    guestPhone: input.guestPhone,
    rentalDate,
    returnDate,
    items: JSON.stringify(items),
    totalAmount: total,
    depositAmount: input.depositAmount ?? 0,
    // Staff registering a booking have already agreed it with the guest, so
    // it is confirmed on creation rather than sitting in "pending" like an
    // unpaid web booking.
    status: "confirmed",
    paymentStatus,
    paymentMethod: input.paymentState === "pending" ? "cash" : "cash",
    deliveryType: "pickup",
    customerType: "cruise",
    channel: input.channel,
    unitSource: input.unitSource,
    partnerName: input.partnerName ?? null,
    createdBy: input.createdBy,
    notes: input.notes ?? null,
    waiverAccepted: false,
    locale: "es",
  };
}
