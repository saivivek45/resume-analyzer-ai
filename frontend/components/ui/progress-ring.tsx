export function ProgressRing({
  value,
  label,
  size = "md",
}: {
  value?: number;
  label?: string;
  size?: "sm" | "md" | "lg";
}) {
  const normalized = Math.max(0, Math.min(100, value ?? 0));
  const dimensions = size === "lg" ? "h-28 w-28 text-2xl" : size === "sm" ? "h-16 w-16 text-sm" : "h-20 w-20 text-lg";

  return (
    <div className="flex items-center gap-4">
      <div
        className={`${dimensions} grid shrink-0 place-items-center rounded-full font-semibold text-white`}
        style={{
          background: `radial-gradient(circle, #070d1a 58%, transparent 60%), conic-gradient(#22d3ee ${normalized}%, rgba(255,255,255,0.08) 0)`,
        }}
      >
        {typeof value === "number" ? `${normalized}%` : "--"}
      </div>
      {label ? <p className="text-sm text-slate-400">{label}</p> : null}
    </div>
  );
}
