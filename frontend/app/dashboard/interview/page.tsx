"use client";

import { Clock, MessageSquareText, Mic, Send } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";

const roles = ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Data Analyst", "Product Manager"];
const levels = ["Entry", "Mid-level", "Senior", "Lead"];
const difficulties = ["Warm-up", "Standard", "Challenging"];

export default function MockInterviewPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mock Interview"
        title="Interview workspace"
        description="Prepare the session details now; AI question generation can connect here when the backend is ready."
      />

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-lg font-semibold text-white">Session Setup</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Select Role</span>
              <select className="form-input mt-2">
                {roles.map((role) => <option className="bg-slate-950" key={role}>{role}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Select Experience Level</span>
              <select className="form-input mt-2">
                {levels.map((level) => <option className="bg-slate-950" key={level}>{level}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Select Difficulty</span>
              <select className="form-input mt-2">
                {difficulties.map((difficulty) => <option className="bg-slate-950" key={difficulty}>{difficulty}</option>)}
              </select>
            </label>
            <button className="button-primary button-large w-full" type="button">
              <Mic size={18} />
              Start Interview
            </button>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">AI Question</h2>
              <MessageSquareText size={18} className="text-cyan-300" />
            </div>
            <div className="mt-4 min-h-32 rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-5 text-sm leading-6 text-slate-500">
              Questions will appear here when AI interview generation is implemented.
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
            <Card>
              <h2 className="text-lg font-semibold text-white">User Answer</h2>
              <textarea className="form-input mt-4 min-h-40 resize-none" placeholder="Type your answer during the session" />
              <button className="button-secondary mt-4" type="button">
                <Send size={16} />
                Submit Answer
              </button>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock size={16} className="text-cyan-300" />
                Timer
              </div>
              <p className="mt-5 text-4xl font-semibold text-white">00:00</p>
              <p className="mt-3 text-sm leading-6 text-slate-500">Reserved for timed interview sessions.</p>
            </Card>
          </div>
          <Card>
            <h2 className="text-lg font-semibold text-white">Feedback Panel</h2>
            <p className="mt-4 text-sm leading-6 text-slate-500">Feedback will appear here after the interview engine is connected.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
