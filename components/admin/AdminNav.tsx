"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  CalendarDays,
  List,
  Car,
  Menu,
  X,
  LogOut,
  ExternalLink,
  MessageCircle,
  Ticket,
  PlayCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  locale: string;
}

const LINKS = [
  { slug: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { slug: "bookings", icon: List, label: "Bookings" },
  { slug: "calendar", icon: CalendarDays, label: "Calendar" },
  { slug: "fleet", icon: Car, label: "Fleet" },
  { slug: "messages", icon: MessageCircle, label: "Messages" },
  { slug: "coupons", icon: Ticket, label: "Partner perks" },
  { slug: "resources", icon: PlayCircle, label: "Resources" },
] as const;

/**
 * The admin sidebar.
 *
 * `NavContent` used to be declared inside the component body, which is what
 * `react-hooks/static-components` was flagging: a new component type on every
 * render, so React threw away and rebuilt the whole subtree — including the
 * drawer's open state — any time the parent re-rendered. It is a module-level
 * component now and takes what it needs as props.
 *
 * Contrast: the idle link colour was `text-white/50` (5.05:1, passing) but the
 * logo subtitle and the "View Website" link were `text-white/40` at 3.73:1.
 * Secondary text in here is #94A3B8, which is 6.41:1 on #0F2035.
 */
function NavContent({
  locale,
  pathname,
  onNavigate,
}: {
  locale: string;
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-6 pb-5">
        {/* The logo is a 2201x593 wordmark. It was being rendered into a 40x40
            box with object-cover, which showed a sliver of the middle of it
            and downloaded 143KB to do so. */}
        <Image
          src="/logo-light.png"
          alt="Buggy Rentals with Dani"
          width={2201}
          height={593}
          sizes="150px"
          className="w-[9.375rem] h-auto"
          priority
        />
        <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-[#94A3B8] mt-2.5">Admin panel</p>
      </div>

      <div className="mx-5 h-px bg-white/10 mb-3" />

      <nav aria-label="Admin sections" className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {LINKS.map((link) => {
          const href = `/${locale}/admin/${link.slug}`;
          const Icon = link.icon;
          const active = pathname.startsWith(href);
          return (
            <Link
              key={link.slug}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 px-3 min-h-11 rounded-xl transition-colors text-sm font-semibold",
                active ? "bg-white/15 text-white" : "text-[#94A3B8] hover:bg-white/[0.08] hover:text-white"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", active && "text-[#FBC7B7]")} aria-hidden="true" />
              {link.label}
              {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FBC7B7]" aria-hidden="true" />}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 pt-2">
        <div className="h-px bg-white/10 mb-2" />
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2.5 px-3 min-h-11 text-sm font-semibold text-[#94A3B8] hover:text-white rounded-xl hover:bg-white/[0.08] transition-colors"
        >
          <ExternalLink className="w-4 h-4" aria-hidden="true" />
          View website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className="w-full flex items-center gap-2.5 px-3 min-h-11 text-sm font-semibold text-[#FCA5A5] hover:bg-red-500/15 hover:text-[#FECACA] rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" aria-hidden="true" /> Sign out
        </button>
      </div>
    </div>
  );
}

export function AdminNav({ locale }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  /* The drawer could only be closed by tapping the backdrop or a link — Escape
     did nothing, and it stayed open behind a route change. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  /* No effect to close the drawer on a route change: every link in it calls
     onNavigate, which is the only way to navigate from inside the drawer. */

  return (
    <>
      <aside className="on-dark hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 bg-[#0F2035] z-40">
        <NavContent locale={locale} pathname={pathname} onNavigate={() => setOpen(false)} />
      </aside>

      <div className="on-dark lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0F2035] flex items-center justify-between pl-4 pr-2 z-40 shadow-lg">
        <Image
          src="/logo-light.png"
          alt="Buggy Rentals with Dani"
          width={2201}
          height={593}
          sizes="112px"
          className="w-28 h-auto"
          priority
        />
        <button
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="admin-drawer"
          aria-label={open ? "Close menu" : "Open menu"}
          className="w-11 h-11 flex items-center justify-center text-[#94A3B8] hover:text-white transition-colors rounded-lg"
        >
          {open ? <X className="w-5 h-5" aria-hidden="true" /> : <Menu className="w-5 h-5" aria-hidden="true" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div id="admin-drawer" className="on-dark absolute left-0 top-0 h-full w-64 bg-[#0F2035] shadow-2xl">
            <NavContent locale={locale} pathname={pathname} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
