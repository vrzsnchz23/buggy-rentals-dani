"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface RangeProps {
  startDate: string;
  endDate: string;
  onStartChange: (val: string) => void;
  onEndChange: (val: string) => void;
}

export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange }: RangeProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [view, setView] = useState(() => {
    if (startDate) {
      const d = new Date(startDate + "T12:00:00");
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year = view.getFullYear();
  const month = view.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prev() { setView(new Date(year, month - 1, 1)); }
  function next() { setView(new Date(year, month + 1, 1)); }

  function select(day: number) {
    const d = new Date(year, month, day);
    if (d < today) return;
    const key = toKey(d);

    if (!startDate || (startDate && endDate)) {
      onStartChange(key);
      onEndChange("");
    } else {
      if (key < startDate) {
        onStartChange(key);
        onEndChange("");
      } else if (key === startDate) {
        onStartChange("");
        onEndChange("");
      } else {
        onEndChange(key);
      }
    }
  }

  const nights = startDate && endDate
    ? Math.round((new Date(endDate + "T12:00:00").getTime() - new Date(startDate + "T12:00:00").getTime()) / 86400000)
    : 0;

  return (
    <div className="bg-white border-2 border-[#1B4F72]/20 rounded-2xl overflow-hidden shadow-lg">
      <div className="bg-[#1B4F72] px-5 py-4 flex items-center justify-between">
        <button type="button" onClick={prev} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-white font-bold text-base">{MONTHS_EN[month]} {year}</span>
        <button type="button" onClick={next} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-7 bg-[#1B4F72]/5 border-b border-gray-100">
        {DAYS_EN.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">{d}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 p-3 gap-1">
        {[...Array(firstDay)].map((_, i) => <div key={`e${i}`} />)}
        {[...Array(daysInMonth)].map((_, i) => {
          const day = i + 1;
          const date = new Date(year, month, day);
          const key = toKey(date);
          const isPast = date < today;
          const isStart = key === startDate;
          const isEnd = key === endDate;
          const isInRange = startDate && endDate && key > startDate && key < endDate;

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => select(day)}
              className={cn(
                "aspect-square rounded-xl text-sm font-semibold transition-all flex items-center justify-center",
                isPast && "text-gray-200 cursor-not-allowed",
                !isPast && !isStart && !isEnd && !isInRange && "text-gray-700 hover:bg-[#1B4F72]/10 hover:text-[#1B4F72]",
                isInRange && "bg-[#1B4F72]/10 text-[#1B4F72] rounded-none",
                (isStart || isEnd) && "bg-[#E8836A] text-white shadow-md shadow-[#E8836A]/30 scale-110 font-black z-10 relative",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      <div className="mx-3 mb-3 space-y-2">
        <div className="bg-[#1B4F72]/5 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Pickup date</span>
          <span className="text-sm font-black text-[#1B4F72]">
            {startDate ? new Date(startDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "—"}
          </span>
        </div>
        <div className="bg-[#1B4F72]/5 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Return date</span>
          <span className="text-sm font-black text-[#1B4F72]">
            {endDate ? new Date(endDate + "T12:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }) : "tap a date →"}
          </span>
        </div>
        {nights > 0 && (
          <div className="bg-[#E8836A]/10 rounded-xl px-4 py-2 text-center text-sm font-bold text-[#E8836A]">
            {nights} {nights === 1 ? "day" : "days"} rental
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  value: string; // YYYY-MM-DD
  onChange: (val: string) => void;
}

const MONTHS_EN = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const DAYS_EN   = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

function toKey(d: Date) {
  return d.toISOString().split("T")[0];
}

export function DatePicker({ value, onChange }: Props) {
  const today = new Date();
  today.setHours(0,0,0,0);

  const [view, setView] = useState(() => {
    if (value) {
      const d = new Date(value + "T12:00:00");
      return new Date(d.getFullYear(), d.getMonth(), 1);
    }
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });

  const year  = view.getFullYear();
  const month = view.getMonth();
  const firstDay   = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  function prev() { setView(new Date(year, month - 1, 1)); }
  function next() { setView(new Date(year, month + 1, 1)); }

  function select(day: number) {
    const d = new Date(year, month, day);
    if (d < today) return;
    onChange(toKey(d));
  }

  const selectedKey = value;

  return (
    <div className="bg-white border-2 border-[#1B4F72]/20 rounded-2xl overflow-hidden shadow-lg">
      {/* Header */}
      <div className="bg-[#1B4F72] px-5 py-4 flex items-center justify-between">
        <button
          type="button"
          onClick={prev}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-white font-bold text-base">
          {MONTHS_EN[month]} {year}
        </span>
        <button
          type="button"
          onClick={next}
          className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Day labels */}
      <div className="grid grid-cols-7 bg-[#1B4F72]/5 border-b border-gray-100">
        {DAYS_EN.map((d) => (
          <div key={d} className="text-center text-xs font-bold text-gray-400 py-2">
            {d}
          </div>
        ))}
      </div>

      {/* Days grid */}
      <div className="grid grid-cols-7 p-3 gap-1">
        {/* Empty cells */}
        {[...Array(firstDay)].map((_, i) => (
          <div key={`e${i}`} />
        ))}

        {/* Day buttons */}
        {[...Array(daysInMonth)].map((_, i) => {
          const day  = i + 1;
          const date = new Date(year, month, day);
          const key  = toKey(date);
          const isPast     = date < today;
          const isToday    = key === toKey(today);
          const isSelected = key === selectedKey;

          return (
            <button
              key={day}
              type="button"
              disabled={isPast}
              onClick={() => select(day)}
              className={cn(
                "aspect-square rounded-xl text-sm font-semibold transition-all flex items-center justify-center",
                isPast && "text-gray-200 cursor-not-allowed",
                !isPast && !isSelected && !isToday && "text-gray-700 hover:bg-[#1B4F72]/10 hover:text-[#1B4F72]",
                isToday && !isSelected && "text-[#1B4F72] border-2 border-[#1B4F72]/30 font-black",
                isSelected && "bg-[#E8836A] text-white shadow-md shadow-[#E8836A]/30 scale-110 font-black",
              )}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Selected display */}
      {selectedKey && (
        <div className="mx-3 mb-3 bg-[#1B4F72]/5 rounded-xl px-4 py-2.5 flex items-center justify-between">
          <span className="text-xs text-gray-500 font-medium">Selected date</span>
          <span className="text-sm font-black text-[#1B4F72]">
            {new Date(selectedKey + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short", month: "short", day: "numeric", year: "numeric"
            })}
          </span>
        </div>
      )}
    </div>
  );
}
