"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthLoading } from "@/components/auth-loading";
import { useAuth } from "@/components/auth-provider";
import { Brand } from "@/components/brand";
import { User } from "lucide-react";
export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  async function handleLogout(): Promise<void> {
    await logout();
    router.replace("/login");
  }

  if (isLoading || !user) {
    return <AuthLoading />;
  }

  const analysisRows = ["Overall resume score", "ATS compatibility", "Content impact"];

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/[0.07] bg-slate-950/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Brand />

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 transition-all duration-300 hover:scale-105 hover:border-cyan-400/40 hover:bg-cyan-400/10"
            >
              <User size={20} />
            </button>

            <button
              className="button-secondary"
              onClick={() => void handleLogout()}
              type="button"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-cyan-300">{user.email}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome, {user.full_name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Upload a resume to uncover its strengths, find opportunities, and get focused recommendations for your next application.</p>
          </div>
          <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">Account active</span>
        </div>
        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="glass-card flex min-h-80 flex-col items-center justify-center p-7 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] text-2xl text-cyan-300">+</div>
            <h2 className="mt-5 text-xl font-semibold text-white">Upload your resume</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Add a PDF or DOCX file to begin your personalized resume analysis.</p>
            <button className="button-primary button-large mt-6" disabled type="button">Upload coming soon</button>
            <p className="mt-3 text-xs text-slate-600">PDF or DOCX, up to 10 MB</p>
          </article>
          <article className="glass-card min-h-80 p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latest report</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Resume analysis</h2>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-500">Waiting</span>
            </div>
            <div className="mt-8 space-y-4">
              {analysisRows.map((label) => (
                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-4" key={label}>
                  <span className="text-sm text-slate-400">{label}</span>
                  <span className="h-2 w-20 rounded-full bg-white/[0.06]" />
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm leading-6 text-slate-500">Your insights and recommendations will appear here after your first resume upload.</p>
          </article>
        </section>
      </div>
    </main>
  );
}
