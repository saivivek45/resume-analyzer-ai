"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  CheckSquare,
  FileClock,
  FileSearch,
  LayoutDashboard,
  LogOut,
  Mic,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  User,
  X,
} from "lucide-react";
import { Brand } from "@/components/brand";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/components/ui/cn";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/resume", label: "Resume Analysis", icon: FileSearch },
  { href: "/dashboard/interview", label: "Mock Interview", icon: Mic },
  { href: "/dashboard/ats", label: "ATS Checker", icon: CheckSquare },
  { href: "/dashboard/job-match", label: "Job Match", icon: BriefcaseBusiness },
  { href: "/dashboard/history", label: "Resume History", icon: FileClock },
  { href: "/profile", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar({
  collapsed,
  mobileOpen,
  onToggleCollapse,
  onCloseMobile,
}: {
  collapsed: boolean;
  mobileOpen: boolean;
  onToggleCollapse: () => void;
  onCloseMobile: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();

  async function handleLogout(): Promise<void> {
    await logout();
    router.replace("/login");
  }

  const content = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-white/[0.07] px-4">
        <div className={cn(collapsed && "lg:hidden")}>
          <Brand />
        </div>
        <button
          aria-label="Close sidebar"
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white lg:hidden"
          onClick={onCloseMobile}
          type="button"
        >
          <X size={18} />
        </button>
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden h-9 w-9 place-items-center rounded-lg text-slate-400 hover:bg-white/[0.06] hover:text-white lg:grid"
          onClick={onToggleCollapse}
          type="button"
        >
          {collapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.href === "/dashboard" ? pathname === item.href : pathname.startsWith(item.href);

          return (
            <Link
              className={cn(
                "group flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-400 hover:bg-white/[0.06] hover:text-white",
                isActive && "border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-100",
                collapsed && "lg:justify-center lg:px-0",
              )}
              href={item.href}
              key={item.href}
              onClick={onCloseMobile}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn("shrink-0", isActive ? "text-cyan-300" : "text-slate-500 group-hover:text-cyan-300")} size={18} />
              <span className={cn("truncate", collapsed && "lg:hidden")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/[0.07] p-3">
        <div className={cn("mb-3 rounded-xl border border-white/[0.07] bg-white/[0.035] p-3", collapsed && "lg:hidden")}>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            <BarChart3 size={14} />
            CareerPilot
          </div>
          <p className="mt-2 text-sm text-slate-300">AI career workspace</p>
        </div>
        <button
          className={cn(
            "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm font-medium text-slate-400 hover:bg-rose-400/[0.08] hover:text-rose-200",
            collapsed && "lg:justify-center lg:px-0",
          )}
          onClick={() => void handleLogout()}
          type="button"
        >
          <LogOut size={18} />
          <span className={cn(collapsed && "lg:hidden")}>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-white/[0.08] bg-slate-950/78 backdrop-blur-2xl lg:block",
          collapsed ? "w-20" : "w-72",
        )}
      >
        {content}
      </aside>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity lg:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onCloseMobile}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r border-white/[0.08] bg-slate-950/95 backdrop-blur-2xl transition-transform lg:hidden",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        {content}
      </aside>
    </>
  );
}
