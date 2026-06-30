"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ClipboardCheck, FileSearch, History, Mic, Upload } from "lucide-react";
import { AnalysisReport } from "@/components/dashboard/analysis-report";
import { useResumeUpload } from "@/components/dashboard/resume-upload-context";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { FileUpload } from "@/components/ui/file-upload";
import { PageHeader } from "@/components/ui/page-header";
import { ScoreCard } from "@/components/ui/score-card";
import { useAuth } from "@/components/auth-provider";
import { getLatestAnalysis, getResumeHistory } from "@/src/lib/resume";
import type { AnalysisResponse, ResumeHistoryItem } from "@/src/lib/resume";

export default function DashboardPage() {
  const { user } = useAuth();
  const upload = useResumeUpload();
  const [latest, setLatest] = useState<AnalysisResponse | null>(null);
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setLatest(getLatestAnalysis());
      setHistory(getResumeHistory());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [upload.analysis]);

  const activeAnalysis = upload.analysis ?? latest;
  const displayName = user?.full_name ?? "there";
  const email = user?.email ?? "CareerPilot AI";

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={email}
        title={`Welcome, ${displayName}`}
        description="Upload a resume, review the latest analysis, and keep your next application moving without leaving the workspace."
        actions={<span className="rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">Account active</span>}
      />

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="flex flex-col">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-300">
              <Upload size={20} />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Upload Resume</h2>
              <p className="text-sm text-slate-500">Connected to the existing upload endpoint.</p>
            </div>
          </div>
          <div className="mt-5">
            <FileUpload
              selectedFile={upload.selectedFile}
              error={upload.uploadError}
              success={upload.uploadSuccess}
              isUploading={upload.isUploading}
              onClear={upload.clearFile}
              onSelect={upload.selectFile}
              onUpload={() => void upload.uploadResume()}
            />
          </div>
          {upload.resumeText ? (
            <button
              className="button-secondary button-large mt-4 w-full"
              disabled={upload.isAnalyzing}
              onClick={() => void upload.analyzeResume()}
              type="button"
            >
              <FileSearch size={18} />
              {upload.isAnalyzing ? "Analyzing..." : "Analyze Resume"}
            </button>
          ) : null}
          {upload.analysisError ? <div className="mt-4"><ErrorState message={upload.analysisError} /></div> : null}
        </Card>

        <div className="grid gap-5 md:grid-cols-2">
          <ScoreCard title="Resume Score" value={activeAnalysis?.overall_score} subtitle="Latest analysis" />
          <ScoreCard title="ATS Score" value={activeAnalysis?.ats_score} subtitle="Latest analysis" />
          <Card className="md:col-span-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500">Latest Analysis</p>
                <h2 className="mt-1 text-lg font-semibold text-white">{activeAnalysis?.file_name ?? "No resume analyzed yet"}</h2>
              </div>
              <Link className="button-secondary" href="/dashboard/resume">
                View Report
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="mt-5">
              {activeAnalysis ? (
                <div className="flex flex-wrap gap-2">
                  {activeAnalysis.detected_skills.slice(0, 8).map((skill) => (
                    <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-xs text-cyan-100" key={skill}>
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-sm leading-6 text-slate-500">Run your first analysis to populate this card.</p>
              )}
            </div>
          </Card>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_0.8fr]">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
            <History size={18} className="text-cyan-300" />
          </div>
          {history.length ? (
            <div className="space-y-3">
              {history.slice(0, 4).map((item) => (
                <div className="flex items-center justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3" key={item.id}>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-white">{item.resumeName}</p>
                    <p className="text-xs text-slate-500">{new Date(item.uploadDate).toLocaleDateString()}</p>
                  </div>
                  <span className="text-sm font-semibold text-cyan-200">{item.overallScore}/100</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState icon={History} title="No activity yet" description="Analyzed resumes will appear here after the backend returns a report." />
          )}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Quick Actions</h2>
          <div className="mt-5 grid gap-3">
            {[
              { href: "/dashboard/resume", label: "Resume Analysis", icon: FileSearch },
              { href: "/dashboard/interview", label: "Mock Interview", icon: Mic },
              { href: "/dashboard/ats", label: "ATS Checker", icon: ClipboardCheck },
            ].map((action) => {
              const Icon = action.icon;
              return (
                <Link className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-3 text-sm font-medium text-slate-300 hover:border-cyan-300/25 hover:bg-cyan-300/[0.06]" href={action.href} key={action.href}>
                  <span className="flex items-center gap-3"><Icon size={17} className="text-cyan-300" />{action.label}</span>
                  <ArrowRight size={16} />
                </Link>
              );
            })}
          </div>
        </Card>
      </div>

      {upload.analysis ? <AnalysisReport analysis={upload.analysis} /> : null}
    </div>
  );
}
