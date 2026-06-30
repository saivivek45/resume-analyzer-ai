import { AlertCircle } from "lucide-react";

export function ErrorState({ message }: { message: string }) {
  return (
    <p className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-4 py-3 text-sm leading-6 text-rose-200">
      <AlertCircle className="mt-0.5 shrink-0" size={16} />
      <span>{message}</span>
    </p>
  );
}
