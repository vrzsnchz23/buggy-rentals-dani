"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CalendarDays, List, Car, Menu, X, LogOut, ExternalLink, MessageCircle, Ticket, PlayCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  locale: string;
}

export function AdminNav({ locale }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const links = [
    { href: `/${locale}/admin/dashboard`, icon: LayoutDashboard, label: "Dashboard" },
    { href: `/${locale}/admin/bookings`, icon: List, label: "Bookings" },
    { href: `/${locale}/admin/calendar`, icon: CalendarDays, label: "Calendar" },
    { href: `/${locale}/admin/fleet`, icon: Car, label: "Fleet" },
    { href: `/${locale}/admin/messages`, icon: MessageCircle, label: "Messages" },
    { href: `/${locale}/admin/coupons`, icon: Ticket, label: "Coupons" },
    { href: `/${locale}/admin/resources`, icon: PlayCircle, label: "Resources" },
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0">
            <Image src="/images/buggy12.png" alt="Buggy Rentals" width={40} height={40} className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="font-bold text-white text-sm leading-none">Buggy Rentals</div>
            <div className="text-xs text-white/40 mt-0.5">Admin Panel</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-white/10 mb-4" />

      <nav className="flex-1 px-3 space-y-0.5">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium",
                active
                  ? "bg-white/15 text-white shadow-sm"
                  : "text-white/50 hover:bg-white/8 hover:text-white/80"
              )}
            >
              <Icon className={cn("w-4 h-4", active ? "text-[#E8836A]" : "")} />
              {link.label}
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#E8836A]" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-4 space-y-1">
        <div className="mx-0 h-px bg-white/10 mb-3" />
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-white/40 hover:text-white/70 rounded-xl hover:bg-white/8 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Website
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 bg-[#0F2035] z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-[#0F2035] flex items-center justify-between px-4 z-40 shadow-lg">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg overflow-hidden shrink-0">
            <Image src="/images/buggy12.png" alt="Buggy Rentals" width={28} height={28} className="w-full h-full object-cover" />
          </div>
          <span className="font-bold text-sm text-white">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-white/60 hover:text-white transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-[#0F2035] shadow-2xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
