import Link from "next/link";

export function Brand() {
  return (
    <Link className="inline-flex items-center gap-2.5" href="/">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-cyan-300 to-blue-500 text-sm font-black text-slate-950 shadow-lg shadow-cyan-400/10">
        C
      </span>
      <span className="text-base font-semibold tracking-tight text-white">
        CareerPilot <span className="text-cyan-300">AI</span>
      </span>
    </Link>
  );
}
