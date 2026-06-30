import { BadgeCheck, CircleAlert, Lightbulb, SearchCheck } from "lucide-react";
import type { AnalysisResponse } from "@/src/lib/resume";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ScoreCard } from "@/components/ui/score-card";

function ListBlock({
  title,
  items,
  tone = "slate",
}: {
  title: string;
  items: string[];
  tone?: "slate" | "cyan" | "rose";
}) {
  const color = tone === "cyan" ? "text-cyan-200" : tone === "rose" ? "text-rose-200" : "text-slate-300";

  return (
    <Card>
      <h3 className="text-base font-semibold text-white">{title}</h3>
      {items.length ? (
        <ul className="mt-4 space-y-3 text-sm leading-6 text-slate-400">
          {items.map((item) => (
            <li className="flex gap-3" key={item}>
              <span className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${tone === "rose" ? "bg-rose-300" : "bg-cyan-300"}`} />
              <span className={color}>{item}</span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 text-sm text-slate-500">No items returned by the analyzer.</p>
      )}
    </Card>
  );
}

export function AnalysisReport({ analysis }: { analysis: AnalysisResponse | null }) {
  if (!analysis) {
    return (
      <EmptyState
        icon={SearchCheck}
        title="No analysis yet"
        description="Upload a resume and run analysis to see backend-generated scores, strengths, weaknesses, keywords, and suggestions."
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-3">
        <ScoreCard title="Resume Score" value={analysis.overall_score} subtitle="Overall backend score" icon={BadgeCheck} />
        <ScoreCard title="ATS Score" value={analysis.ats_score} subtitle="Compatibility signal" icon={SearchCheck} />
        <ScoreCard title="Content Score" value={analysis.content_score} subtitle="Impact and clarity" icon={Lightbulb} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <ListBlock title="Strengths" items={analysis.strengths} tone="cyan" />
        <ListBlock title="Weaknesses" items={analysis.weaknesses} tone="rose" />
      </div>

      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <Card>
          <div className="flex items-center gap-2">
            <CircleAlert size={18} className="text-cyan-300" />
            <h3 className="text-base font-semibold text-white">Missing Keywords</h3>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {analysis.missing_skills.length ? (
              analysis.missing_skills.map((keyword) => (
                <span
                  className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-xs font-medium text-cyan-100"
                  key={keyword}
                >
                  {keyword}
                </span>
              ))
            ) : (
              <span className="text-sm text-slate-500">No missing keywords returned by the analyzer.</span>
            )}
          </div>
        </Card>
        <ListBlock title="Improvement Suggestions" items={analysis.recommendations} />
      </div>
    </div>
  );
}
