"use client";
import { useId } from "react";
import { useLocale, useTranslations } from "next-intl";
import { type BookingData } from "./BookingWizard";
import { Button } from "@/components/ui/Button";
import { ChevronLeft } from "lucide-react";

interface Props {
  data: BookingData;
  update: (p: Partial<BookingData>) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Step2GuestInfo({ data, update, onBack, onNext }: Props) {
  const t = useTranslations("booking");
  const locale = useLocale();
  const es = locale === "es";

  /**
   * Ids, so every visible label actually points at its field.
   *
   * These were plain <label> elements sitting next to the input, which looks
   * identical and behaves worse: tapping the word "Email" did nothing, and a
   * screen reader announced an unnamed edit box. `useId` rather than hardcoded
   * strings, because duplicate ids would silently re-point a label at the
   * first copy if this step were ever mounted twice on one page.
   */
  const id = useId();
  const fid = (name: string) => `${id}-${name}`;

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.guestEmail.trim());
  const emailInvalid = data.guestEmail.trim().length > 0 && !emailOk;
  const canProceed =
    data.guestName.trim() &&
    emailOk &&
    data.guestPhone.trim();

  const missing: string[] = [];
  if (!data.guestName.trim()) missing.push(es ? "tu nombre" : "your name");
  if (!data.guestEmail.trim()) missing.push(es ? "tu email" : "your email");
  else if (!emailOk) missing.push(es ? "un email válido" : "a valid email");
  if (!data.guestPhone.trim()) missing.push(es ? "tu teléfono" : "your phone");

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-[#1B4F72] mb-1">{t("step2")}</h2>
        <p className="text-[#5A616B] text-sm">{es ? "Cuéntanos sobre ti" : "Tell us about yourself"}</p>
      </div>

      {/* Personal info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor={fid("name")}>{t("name")} *</label>
          {/* autoComplete through this block is the one change that makes the
              form bearable on a phone: it lets iOS and Android offer the
              guest's own contact card instead of making them thumb-type an
              email address on a moving ship with port wifi. */}
          <input
            id={fid("name")}
            type="text"
            autoComplete="name"
            className="form-input"
            placeholder={es ? "Juan Pérez" : "John Smith"}
            value={data.guestName}
            onChange={(e) => update({ guestName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="form-label" htmlFor={fid("email")}>{t("email")} *</label>
          <input
            id={fid("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            spellCheck={false}
            className="form-input"
            style={emailInvalid ? { borderColor: "#dc2626" } : undefined}
            placeholder="john@example.com"
            value={data.guestEmail}
            onChange={(e) => update({ guestEmail: e.target.value })}
            aria-invalid={emailInvalid}
            aria-describedby={emailInvalid ? fid("email-error") : undefined}
            required
          />
          {emailInvalid && (
            // #ef4444 on white is 3.76:1 — under the 4.5:1 an error message of
            // all things has to clear. #b91c1c is 6.35:1 and still reads red.
            <p id={fid("email-error")} className="text-xs text-[#b91c1c] mt-1">
              {es ? "Revisa tu email — ahí te enviamos la confirmación." : "Check your email — that's where we send your confirmation."}
            </p>
          )}
        </div>
        <div>
          <label className="form-label" htmlFor={fid("phone")}>{t("phone")} *</label>
          <input
            id={fid("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            className="form-input"
            placeholder="+1 555 000 0000"
            value={data.guestPhone}
            onChange={(e) => update({ guestPhone: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label" htmlFor={fid("license")}>{t("driversLicense")} <span className="text-[#5A616B] font-normal">({es ? "opcional" : "optional"})</span></label>
          <input
            id={fid("license")}
            type="text"
            className="form-input"
            placeholder={es ? "Número de licencia" : "License number"}
            value={data.driversLicense}
            onChange={(e) => update({ driversLicense: e.target.value })}
          />
          <p className="text-xs text-[#5A616B] mt-1">{es ? "Puedes traerla al recoger — es obligatoria para manejar." : "You can bring it on pickup — required to drive."}</p>
        </div>
      </div>

      {/* Cruise info — only for cruise customers */}
      {data.customerType === "cruise" && <div className="border-t border-gray-100 pt-5">
        <p className="form-label mb-4">{t("cruiseInfo")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-[#5A616B] font-medium" htmlFor={fid("cruise-line")}>{t("cruiseName")}</label>
            <input
              id={fid("cruise-line")}
              type="text"
              className="form-input"
              placeholder="e.g. Royal Caribbean"
              value={data.cruiseName || ""}
              onChange={(e) => update({ cruiseName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-[#5A616B] font-medium" htmlFor={fid("ship")}>{t("cruiseShip")}</label>
            <input
              id={fid("ship")}
              type="text"
              className="form-input"
              placeholder="e.g. Symphony of the Seas"
              value={data.cruiseShip || ""}
              onChange={(e) => update({ cruiseShip: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            {/* A group of buttons, not a field, so this is a group label and
                not a <label>: a <label> with no control to point at is read
                out as a stray line of text. */}
            <p className="form-label text-[#5A616B] font-medium" id={fid("arrival")}>
              {t("cruiseArrival")}
            </p>
            <p className="text-xs text-[#5A616B] mb-2">{es ? "Hora aproximada en que tu barco llega al puerto" : "Approximate time your ship docks at port"}</p>
            <div className="grid grid-cols-4 gap-2" role="group" aria-labelledby={fid("arrival")}>
              {[
                "7:30 AM",
                "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM",
                "10:00 AM", "10:30 AM", "11:00 AM", "11:30 AM",
                "12:00 PM", "12:30 PM", "1:00 PM", "2:00 PM",
              ].map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => update({ cruiseArrival: time })}
                  aria-pressed={data.cruiseArrival === time}
                  className={`min-h-11 py-2 px-1 rounded-xl text-sm font-semibold border-2 transition-all ${
                    data.cruiseArrival === time
                      ? "border-[#1B4F72] bg-[#1B4F72] text-white"
                      : "border-gray-200 text-[#44505E] hover:border-[#7FB5B5] hover:text-[#1B4F72]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {data.cruiseArrival && (
              <p className="text-xs text-[#1B4F72] font-semibold mt-2">
                ✓ {es ? "Elegido" : "Selected"}: {data.cruiseArrival}
              </p>
            )}
          </div>
        </div>
      </div>}

      {/* Notes */}
      <div>
        <label className="form-label text-[#5A616B] font-medium" htmlFor={fid("notes")}>{t("notes")}</label>
        <textarea
          id={fid("notes")}
          className="form-input h-20 resize-none"
          placeholder={es ? "¿Alguna petición especial?" : "Any special requests?"}
          value={data.notes || ""}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      {/* Navigation */}
      <div className="space-y-2">
        {missing.length > 0 && (
          // role="status" so the list of what is still missing is announced
          // when it changes, instead of only being visible.
          <p className="text-xs text-[#5A616B] text-center" role="status">
            {es ? "Para continuar necesitamos: " : "To continue we need: "}
            <span className="font-semibold text-[#1B4F72]">{missing.join(", ")}</span>
          </p>
        )}
        <div className="flex gap-3">
          <Button variant="outline" size="lg" onClick={onBack} className="flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" /> {t("back")}
          </Button>
          <Button onClick={onNext} disabled={!canProceed} size="lg" className="flex-1">
            {t("next")} →
          </Button>
        </div>
      </div>
    </div>
  );
}
