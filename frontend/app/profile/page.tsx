"use client";

import { ArrowLeft, Mail, MapPin, Pencil, Link} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#020617] text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        <button
          onClick={() => router.push("/dashboard")}
          className="mb-8 flex items-center gap-2 text-slate-400 hover:text-cyan-300"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div className="flex items-center gap-6">
              <div className="flex h-28 w-28 items-center justify-center rounded-full bg-cyan-500 text-4xl font-bold">
                S
              </div>

              <div>
                <h1 className="text-4xl font-bold">
                  Siddardh
                </h1>

                <p className="mt-2 text-slate-400">
                  Full Stack Developer
                </p>

                <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-400">
                  <span className="flex items-center gap-2">
                    <Mail size={15} />
                    saisiddarth919@gmail.com
                  </span>

                  <span className="flex items-center gap-2">
                    <MapPin size={15} />
                    Hyderabad, India
                  </span>
                </div>
              </div>
            </div>

            <button className="flex items-center gap-2 rounded-xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-cyan-300">
              <Pencil size={16} />
              Edit Profile
            </button>
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-slate-500">ATS Score</p>
            <h2 className="mt-2 text-3xl font-bold text-cyan-300">
              92%
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-slate-500">Resume Score</p>
            <h2 className="mt-2 text-3xl font-bold text-emerald-300">
              88
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-slate-500">Projects</p>
            <h2 className="mt-2 text-3xl font-bold">
              12
            </h2>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <p className="text-slate-500">Skills</p>
            <h2 className="mt-2 text-3xl font-bold">
              24
            </h2>
          </div>

        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">
            About Me
          </h2>

          <p className="mt-4 leading-7 text-slate-400">
            Passionate Full Stack Developer focused on building scalable
            web applications using Next.js, FastAPI, PostgreSQL and AI.
            Interested in Product Based Companies and high-performance systems.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="text-xl font-semibold">
            Skills
          </h2>

          <div className="mt-5 flex flex-wrap gap-3">
            {[
              "Next.js",
              "React",
              "TypeScript",
              "Node.js",
              "FastAPI",
              "MongoDB",
              "PostgreSQL",
              "Docker",
              "Redis",
              "Tailwind"
            ].map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2">

          <a
            href="#"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30"
          >
            <Link />
            GitHub Profile
          </a>

          <a
            href="#"
            className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 hover:border-cyan-400/30"
          >
            <Link />
            LinkedIn Profile
          </a>

        </div>
      </div>
    </main>
  );
}