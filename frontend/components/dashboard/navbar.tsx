"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

export function Navbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { user } = useAuth();
  const initials = user?.full_name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-slate-950/70 backdrop-blur-2xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          aria-label="Open sidebar"
          className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white lg:hidden"
          onClick={onOpenSidebar}
          type="button"
        >
          <Menu size={18} />
        </button>

        <div className="hidden min-w-0 flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2 text-sm text-slate-500 md:flex">
          <Search size={16} />
          <span>Search resumes, reports, and career tools</span>
        </div>

        <div className="ml-auto flex items-center gap-3">
          <button
            aria-label="Notifications"
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 hover:text-white"
            type="button"
          >
            <Bell size={17} />
          </button>
          <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-3 py-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-cyan-300 text-sm font-semibold text-slate-950">
              {initials || <User size={16} />}
            </div>
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-medium text-white">{user?.full_name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
