"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Plus, Minus, Check, AlertCircle } from "lucide-react";
import { VEHICLES, VEHICLE_ORDER, formatCurrency, type VehicleType } from "@/lib/utils";
import {
  MANUAL_CHANNELS,
  CHANNEL_LABEL,
  STAFF,
  type PaymentState,
  type UnitSource,
  type Staff,
} from "@/lib/bookings/manual";

function todayYmd() {
  const d = new Date();
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 10);
}

/**
 * Quick entry for a booking taken off the website.
 *
 * The business rule is "if it is not in the system, the booking does not
 * exist", which only holds if registering one takes under 30 seconds on a
 * phone. So the common case — one buggy, today, one day, our own unit, paid,
 * over WhatsApp — is already filled in: a name, a phone, and Save.
 *
 * Everything is a big tap target, and the numeric fields ask for the numeric
 * keyboard. Nothing here is a dropdown the user has to hunt through.
 */
export function QuickBookingForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [rentalDate, setRentalDate] = useState(todayYmd());
  const [vehicleType, setVehicleType] = useState<VehicleType>("buggy");
  const [qty, setQty] = useState(1);
  const [days, setDays] = useState(1);
  const [unitSource, setUnitSource] = useState<UnitSource>("own");
  const [partnerName, setPartnerName] = useState("");
  // Tracked separately from the vehicle so an edited price is not silently
  // overwritten when the vehicle is switched back and forth.
  const [priceTouched, setPriceTouched] = useState(false);
  const [unitPrice, setUnitPrice] = useState<number>(VEHICLES.buggy.price);
  const [paymentState, setPaymentState] = useState<PaymentState>("paid");
  const [depositAmount, setDepositAmount] = useState<string>("");
  const [channel, setChannel] = useState<(typeof MANUAL_CHANNELS)[number]>("whatsapp");
  const [createdBy, setCreatedBy] = useState<Staff>("Dani");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const total = (Number(unitPrice) || 0) * qty * days;

  function pickVehicle(type: VehicleType) {
    setVehicleType(type);
    if (!priceTouched) setUnitPrice(VEHICLES[type].price);
  }

  const canSave = guestName.trim() && guestPhone.trim() && !saving;

  async function save() {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          guestName,
          guestPhone,
          rentalDate,
          vehicleType,
          qty,
          days,
          unitPrice: Number(unitPrice),
          unitSource,
          partnerName,
          paymentState,
          depositAmount: Number(depositAmount) || 0,
          channel,
          createdBy,
          notes,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "No se pudo guardar.");
      onClose();
      // Re-runs the dashboard's server queries so the new booking lands in
      // the metrics immediately, without a full page reload.
      router.refresh();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "No se pudo guardar.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Nueva reserva"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl max-h-[92vh] overflow-y-auto"
      >
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <h2 className="font-black text-[#1B4F72] text-lg">Nueva reserva</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar"
            className="w-9 h-9 rounded-full hover:bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-5 space-y-5">
          {/* Who */}
          <div className="space-y-3">
            <div>
              <label className="form-label" htmlFor="qb-name">Nombre *</label>
              <input
                id="qb-name"
                className="form-input"
                autoFocus
                autoComplete="name"
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="Nombre del cliente"
              />
            </div>
            <div>
              <label className="form-label" htmlFor="qb-phone">Teléfono / WhatsApp *</label>
              <input
                id="qb-phone"
                className="form-input"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                value={guestPhone}
                onChange={(e) => setGuestPhone(e.target.value)}
                placeholder="+1 555 000 0000"
              />
            </div>
          </div>

          {/* Vehicle */}
          <div>
            <label className="form-label">Vehículo</label>
            <div className="grid grid-cols-3 gap-2">
              {VEHICLE_ORDER.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => pickVehicle(type)}
                  className={`py-3 px-2 rounded-xl border-2 text-center transition-all ${
                    vehicleType === type
                      ? "border-[#1B4F72] bg-[#1B4F72]/5 text-[#1B4F72]"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  <div className="text-xl leading-none mb-1">{VEHICLES[type].emoji}</div>
                  <div className="text-xs font-bold">{VEHICLES[type].labelEs.split(" ")[0]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Qty / days / date */}
          <div className="grid grid-cols-2 gap-3">
            <Stepper label="Cantidad" value={qty} onChange={setQty} min={1} max={20} />
            <Stepper label="Días" value={days} onChange={setDays} min={1} max={60} />
          </div>

          <div>
            <label className="form-label" htmlFor="qb-date">Fecha de renta</label>
            <input
              id="qb-date"
              className="form-input"
              type="date"
              value={rentalDate}
              onChange={(e) => setRentalDate(e.target.value)}
            />
          </div>

          {/* Price */}
          <div>
            <label className="form-label" htmlFor="qb-price">Precio por unidad (USD)</label>
            <input
              id="qb-price"
              className="form-input"
              type="number"
              inputMode="decimal"
              min={0}
              value={unitPrice}
              onChange={(e) => {
                setPriceTouched(true);
                setUnitPrice(e.target.value === "" ? 0 : Number(e.target.value));
              }}
            />
            <p className="text-xs text-gray-400 mt-1">
              Se llena solo según el vehículo. Edítalo si negociaste otro precio.
            </p>
          </div>

          {/* Live total */}
          <div className="bg-[#F5F0EB] rounded-xl px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-500">
              {qty} × {formatCurrency(Number(unitPrice) || 0)}
              {days > 1 ? ` × ${days} días` : ""}
            </span>
            <span className="font-black text-[#C05232] text-xl">{formatCurrency(total)}</span>
          </div>

          {/* Unit source */}
          <div>
            <label className="form-label">Origen de la unidad</label>
            <Segmented
              options={[
                { value: "own", label: "Propio" },
                { value: "partner", label: "Socio" },
              ]}
              value={unitSource}
              onChange={(v) => setUnitSource(v as UnitSource)}
            />
            {unitSource === "partner" && (
              <input
                className="form-input mt-2"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="Nombre del socio (opcional)"
              />
            )}
          </div>

          {/* Payment */}
          <div>
            <label className="form-label">Estado de pago</label>
            <Segmented
              options={[
                { value: "paid", label: "Pagado" },
                { value: "deposit", label: "Anticipo" },
                { value: "pending", label: "Pendiente" },
              ]}
              value={paymentState}
              onChange={(v) => setPaymentState(v as PaymentState)}
            />
            {paymentState === "deposit" && (
              <input
                className="form-input mt-2"
                type="number"
                inputMode="decimal"
                min={0}
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="Monto del anticipo (USD)"
              />
            )}
            {paymentState === "pending" && (
              <p className="text-xs text-gray-400 mt-1">Paga al recoger. No cuenta como cobrado.</p>
            )}
          </div>

          {/* Channel */}
          <div>
            <label className="form-label">Canal</label>
            <div className="grid grid-cols-4 gap-2">
              {MANUAL_CHANNELS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setChannel(c)}
                  className={`py-2.5 px-1 rounded-xl border-2 text-xs font-bold transition-all ${
                    channel === c
                      ? "border-[#1B4F72] bg-[#1B4F72] text-white"
                      : "border-gray-200 text-gray-600"
                  }`}
                >
                  {CHANNEL_LABEL[c]}
                </button>
              ))}
            </div>
          </div>

          {/* Staff */}
          <div>
            <label className="form-label">Atendió</label>
            <Segmented
              options={STAFF.map((s) => ({ value: s, label: s }))}
              value={createdBy}
              onChange={(v) => setCreatedBy(v as Staff)}
            />
          </div>

          <div>
            <label className="form-label" htmlFor="qb-notes">Notas (opcional)</label>
            <textarea
              id="qb-notes"
              className="form-input h-16 resize-none"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-3 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}
        </div>

        {/* Save bar stays reachable without scrolling back down. */}
        <div className="sticky bottom-0 bg-white border-t border-gray-100 px-5 py-4">
          <button
            onClick={save}
            disabled={!canSave}
            className="w-full bg-[#C05232] hover:bg-[#A8411F] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
          >
            {saving ? "Guardando…" : <><Check className="w-5 h-5" strokeWidth={3} /> Guardar {formatCurrency(total)}</>}
          </button>
          {!canSave && !saving && (
            <p className="text-xs text-gray-400 text-center mt-2">Falta nombre y teléfono.</p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Big +/- control: faster and more reliable than a number keyboard on a phone. */
function Stepper({
  label,
  value,
  onChange,
  min,
  max,
}: {
  label: string;
  value: number;
  /**
   * A state setter, not a plain callback: two taps landing in the same render
   * frame would both read the same stale `value` and only advance the count
   * once. Rare for a human, but this runs on a phone at the module where
   * people tap fast, and a silently dropped unit is a wrong invoice.
   */
  onChange: React.Dispatch<React.SetStateAction<number>>;
  min: number;
  max: number;
}) {
  return (
    <div>
      <label className="form-label">{label}</label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label={`Menos ${label}`}
          onClick={() => onChange((v) => Math.max(min, v - 1))}
          disabled={value <= min}
          className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center disabled:opacity-30"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="flex-1 text-center font-black text-[#1B4F72] text-xl">{value}</span>
        <button
          type="button"
          aria-label={`Más ${label}`}
          onClick={() => onChange((v) => Math.min(max, v + 1))}
          disabled={value >= max}
          className="w-11 h-11 rounded-xl border-2 border-gray-200 flex items-center justify-center disabled:opacity-30"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function Segmented({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={`py-3 px-2 rounded-xl border-2 text-sm font-bold transition-all ${
            value === o.value
              ? "border-[#1B4F72] bg-[#1B4F72] text-white"
              : "border-gray-200 text-gray-600"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
