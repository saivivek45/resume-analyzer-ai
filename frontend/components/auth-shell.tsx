import Link from "next/link";
import { Brand } from "@/components/brand";

interface AuthShellProps {
  children: React.ReactNode;
  title: string;
  description: string;
  footerText: string;
  footerLinkText: string;
  footerHref: string;
}

export function AuthShell({
  children,
  title,
  description,
  footerText,
  footerLinkText,
  footerHref,
}: AuthShellProps) {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5 py-12">
      <div className="hero-glow" />
      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Brand />
        </div>
        <section className="glass-card p-6 sm:p-8">
          <div className="mb-7 text-center">
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {title}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              {description}
            </p>
          </div>
          {children}
        </section>
        <p className="mt-6 text-center text-sm text-slate-500">
          {footerText}{" "}
          <Link className="font-medium text-cyan-300 hover:text-cyan-200" href={footerHref}>
            {footerLinkText}
          </Link>
        </p>
      </div>
    </main>
  );
}
