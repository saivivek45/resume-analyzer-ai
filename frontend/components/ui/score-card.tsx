import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ProgressRing } from "@/components/ui/progress-ring";

export function ScoreCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value?: number;
  subtitle?: string;
  icon?: LucideIcon;
}) {
  return (
    <Card className="flex min-h-36 items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
          {Icon ? <Icon size={16} className="text-cyan-300" /> : null}
          {title}
        </div>
        <p className="mt-3 text-3xl font-semibold text-white">{typeof value === "number" ? value : "--"}</p>
        {subtitle ? <p className="mt-2 text-sm text-slate-500">{subtitle}</p> : null}
      </div>
      <ProgressRing value={value} />
    </Card>
  );
}
