export function AuthLoading() {
  return (
    <main className="grid min-h-screen place-items-center">
      <div className="flex items-center gap-3 text-sm text-slate-400">
        <span className="h-5 w-5 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-300" />
        Securing your workspace...
      </div>
    </main>
  );
}
