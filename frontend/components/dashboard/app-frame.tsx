"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLoading } from "@/components/auth-loading";
import { useAuth } from "@/components/auth-provider";
import { Navbar } from "@/components/dashboard/navbar";
import { ResumeUploadProvider } from "@/components/dashboard/resume-upload-context";
import { Sidebar } from "@/components/dashboard/sidebar";
import { cn } from "@/components/ui/cn";

export function AppFrame({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  if (isLoading || !user) {
    return <AuthLoading />;
  }

  return (
    <ResumeUploadProvider>
      <div className="min-h-screen bg-slate-950 text-white">
        <div className="hero-glow" />
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onCloseMobile={() => setMobileOpen(false)}
          onToggleCollapse={() => setCollapsed((value) => !value)}
        />
        <div className={cn("relative min-h-screen transition-[padding] duration-200 lg:pl-72", collapsed && "lg:pl-20")}>
          <Navbar onOpenSidebar={() => setMobileOpen(true)} />
          <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:py-8">{children}</main>
        </div>
      </div>
    </ResumeUploadProvider>
  );
}
