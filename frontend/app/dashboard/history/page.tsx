"use client";

import Link from "next/link";
import { FileClock } from "lucide-react";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/ui/page-header";
import { getResumeHistory } from "@/src/lib/resume";
import type { ResumeHistoryItem } from "@/src/lib/resume";

export default function ResumeHistoryPage() {
  const [history, setHistory] = useState<ResumeHistoryItem[]>([]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setHistory(getResumeHistory());
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resume History"
        title="Reports archive"
        description="Recent reports are stored locally after successful backend analysis until a history API is available."
      />

      <Card>
        {history.length ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-xs uppercase tracking-[0.14em] text-slate-500">
                <tr className="border-b border-white/[0.07]">
                  <th className="px-4 py-3 font-semibold">Resume Name</th>
                  <th className="px-4 py-3 font-semibold">Upload Date</th>
                  <th className="px-4 py-3 font-semibold">ATS Score</th>
                  <th className="px-4 py-3 font-semibold">Overall Score</th>
                  <th className="px-4 py-3 font-semibold">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.06]">
                {history.map((item) => (
                  <tr className="text-slate-300" key={item.id}>
                    <td className="px-4 py-4 font-medium text-white">{item.resumeName}</td>
                    <td className="px-4 py-4">{new Date(item.uploadDate).toLocaleString()}</td>
                    <td className="px-4 py-4 text-cyan-200">{item.atsScore}/100</td>
                    <td className="px-4 py-4 text-cyan-200">{item.overallScore}/100</td>
                    <td className="px-4 py-4">
                      <Link className="button-secondary" href="/dashboard/resume">View Report</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState icon={FileClock} title="No resume history" description="Once you analyze a resume, its name, upload date, ATS score, and overall score will appear here." />
        )}
      </Card>
    </div>
  );
}
