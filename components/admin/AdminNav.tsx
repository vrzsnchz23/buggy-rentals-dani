"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, CalendarDays, List, Car, Menu, X, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";

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
  ];

  const NavContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#1B4F72] flex items-center justify-center">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
          <div>
            <div className="font-bold text-gray-800 text-sm">Buggy Rentals</div>
            <div className="text-xs text-gray-400">Admin Panel</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm font-medium",
                active
                  ? "bg-[#1B4F72] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )}
            >
              <Icon className="w-4 h-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100 space-y-2">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 px-3 py-2 text-sm text-gray-500 hover:text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
        >
          View Website →
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}/admin/login` })}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col fixed left-0 top-0 h-full w-60 bg-white border-r border-gray-100 shadow-sm z-40">
        <NavContent />
      </aside>

      {/* Mobile topbar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#1B4F72] flex items-center justify-center">
            <span className="text-white font-bold text-xs">BD</span>
          </div>
          <span className="font-bold text-sm text-gray-800">Admin</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 text-gray-600">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-64 bg-white shadow-xl">
            <NavContent />
          </div>
        </div>
      )}
    </>
  );
}
