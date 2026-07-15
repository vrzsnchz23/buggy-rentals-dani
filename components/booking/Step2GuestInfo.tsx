"use client";
import { useTranslations } from "next-intl";
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

  const canProceed =
    data.guestName.trim() &&
    data.guestEmail.trim() &&
    data.guestPhone.trim();

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-black text-[#1B4F72] mb-1">{t("step2")}</h2>
        <p className="text-gray-500 text-sm">Tell us about yourself</p>
      </div>

      {/* Personal info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="form-label">{t("name")} *</label>
          <input
            type="text"
            className="form-input"
            placeholder="John Smith"
            value={data.guestName}
            onChange={(e) => update({ guestName: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="form-label">{t("email")} *</label>
          <input
            type="email"
            className="form-input"
            placeholder="john@example.com"
            value={data.guestEmail}
            onChange={(e) => update({ guestEmail: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="form-label">{t("phone")} *</label>
          <input
            type="tel"
            className="form-input"
            placeholder="+1 555 000 0000"
            value={data.guestPhone}
            onChange={(e) => update({ guestPhone: e.target.value })}
            required
          />
        </div>
        <div className="sm:col-span-2">
          <label className="form-label">{t("driversLicense")} <span className="text-gray-400 font-normal">(optional)</span></label>
          <input
            type="text"
            className="form-input"
            placeholder="License number"
            value={data.driversLicense}
            onChange={(e) => update({ driversLicense: e.target.value })}
          />
          <p className="text-xs text-gray-400 mt-1">You can bring it on pickup — required to drive.</p>
        </div>
      </div>

      {/* Cruise info */}
      <div className="border-t border-gray-100 pt-5">
        <p className="form-label mb-4">{t("cruiseInfo")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="form-label text-gray-500 font-medium">{t("cruiseName")}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Royal Caribbean"
              value={data.cruiseName || ""}
              onChange={(e) => update({ cruiseName: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label text-gray-500 font-medium">{t("cruiseShip")}</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Symphony of the Seas"
              value={data.cruiseShip || ""}
              onChange={(e) => update({ cruiseShip: e.target.value })}
            />
          </div>
          <div className="sm:col-span-2">
            <label className="form-label text-gray-500 font-medium">
              {t("cruiseArrival")}
            </label>
            <p className="text-xs text-gray-400 mb-2">Approximate time your ship docks at port</p>
            <div className="grid grid-cols-4 gap-2">
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
                  className={`py-2 px-1 rounded-xl text-sm font-semibold border-2 transition-all ${
                    data.cruiseArrival === time
                      ? "border-[#1B4F72] bg-[#1B4F72] text-white"
                      : "border-gray-200 text-gray-600 hover:border-[#7FB5B5] hover:text-[#1B4F72]"
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
            {data.cruiseArrival && (
              <p className="text-xs text-[#1B4F72] font-semibold mt-2">
                ✓ Selected: {data.cruiseArrival}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="form-label text-gray-500 font-medium">{t("notes")}</label>
        <textarea
          className="form-input h-20 resize-none"
          placeholder="Any special requests?"
          value={data.notes || ""}
          onChange={(e) => update({ notes: e.target.value })}
        />
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" size="lg" onClick={onBack} className="flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> {t("back")}
        </Button>
        <Button onClick={onNext} disabled={!canProceed} size="lg" className="flex-1">
          {t("next")} →
        </Button>
      </div>
    </div>
  );
}
