interface StatusMessageProps {
  type: "error" | "success";
  children: React.ReactNode;
}

export function StatusMessage({ type, children }: StatusMessageProps) {
  const styles =
    type === "error"
      ? "border-rose-400/20 bg-rose-400/[0.07] text-rose-200"
      : "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200";

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm ${styles}`} role="status">
      {children}
    </div>
  );
}
