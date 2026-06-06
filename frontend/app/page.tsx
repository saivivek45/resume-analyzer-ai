import Link from "next/link";
import { Brand } from "@/components/brand";

const features = [
  {
    number: "01",
    title: "ATS-ready feedback",
    description: "See how well your resume matches the roles you want.",
  },
  {
    number: "02",
    title: "Clear recommendations",
    description: "Turn generic bullet points into focused, measurable wins.",
  },
  {
    number: "03",
    title: "Confident applications",
    description: "Know what to improve before your resume reaches a recruiter.",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      <div className="hero-glow" />
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-12">
        <Brand />
        <div className="flex items-center gap-2 sm:gap-3">
          <Link className="button-ghost" href="/login">
            Log in
          </Link>
          <Link className="button-primary" href="/signup">
            Get started
          </Link>
        </div>
      </nav>

      <section className="relative z-10 mx-auto grid max-w-7xl gap-14 px-5 pb-20 pt-16 sm:px-8 sm:pt-24 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-12 lg:pb-28 lg:pt-32">
        <div>
          <div className="eyebrow">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            AI-powered career intelligence
          </div>
          <h1 className="mt-7 max-w-3xl text-5xl font-semibold leading-[1.04] tracking-[-0.055em] text-white sm:text-6xl lg:text-7xl">
            Build a resume that gets{" "}
            <span className="gradient-text">noticed.</span>
          </h1>
          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-300">
            CareerPilot AI gives you precise, actionable feedback to help your
            resume stand out, pass screening systems, and earn more interviews.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link className="button-primary button-large" href="/signup">
              Analyze your resume
              <span aria-hidden="true">→</span>
            </Link>
            <Link className="button-secondary button-large" href="/login">
              I already have an account
            </Link>
          </div>
          <p className="mt-5 text-sm text-slate-500">
            Free to get started. No credit card required.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="absolute -inset-5 rounded-[2.5rem] bg-cyan-400/10 blur-3xl" />
          <div className="glass-card relative p-5 sm:p-7">
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Resume score
                </p>
                <p className="mt-1 text-lg font-medium text-white">
                  Product Designer
                </p>
              </div>
              <div className="score-ring">
                <span>92</span>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                ["Impact & clarity", "Excellent", "w-[92%]"],
                ["Skills alignment", "Strong", "w-[84%]"],
                ["ATS compatibility", "Excellent", "w-[95%]"],
              ].map(([label, value, width]) => (
                <div key={label}>
                  <div className="mb-2 flex justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="font-medium text-cyan-300">{value}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-white/5">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 ${width}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-7 rounded-2xl border border-emerald-400/15 bg-emerald-400/[0.06] p-4">
              <p className="text-sm font-medium text-emerald-300">
                Your resume is interview-ready
              </p>
              <p className="mt-1 text-sm leading-6 text-slate-400">
                Three targeted improvements could make it even stronger.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-10 border-t border-white/[0.07] bg-slate-950/50">
        <div className="mx-auto grid max-w-7xl gap-px px-5 py-16 sm:px-8 md:grid-cols-3 lg:px-12">
          {features.map((feature) => (
            <article className="feature-card" key={feature.number}>
              <span className="text-xs font-semibold tracking-[0.2em] text-cyan-400">
                {feature.number}
              </span>
              <h2 className="mt-4 text-lg font-semibold text-white">
                {feature.title}
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
