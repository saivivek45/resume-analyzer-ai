"use client";

import { useState } from "react";
import { Clock, MessageSquareText, Mic, Send, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/ui/page-header";
import api from "@/src/lib/api";

const roles = ["Frontend Engineer", "Backend Engineer", "Full Stack Engineer", "Data Analyst", "Product Manager"];
const levels = ["Entry", "Mid-level", "Senior", "Lead"];
const difficulties = ["Warm-up", "Standard", "Challenging"];

export default function MockInterviewPage() {
  const [role, setRole] = useState(roles[0]);
  const [level, setLevel] = useState(levels[0]);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEvaluating, setIsEvaluating] = useState(false);
  
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState<string | null>(null);

  const startInterview = async () => {
    setIsGenerating(true);
    setError(null);
    setQuestions([]);
    setFeedback("");
    setCurrentIdx(0);
    setAnswer("");
    try {
      const res = await api.post("/interview/generate", {
        role,
        level,
        difficulty
      });
      setQuestions(res.data.questions);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to generate questions. Ensure you have an uploaded resume.");
    } finally {
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (!answer) return;
    setIsEvaluating(true);
    setError(null);
    try {
      const res = await api.post("/interview/evaluate", {
        question: questions[currentIdx],
        answer
      });
      setFeedback(res.data.feedback);
    } catch (err: any) {
      setError("Failed to evaluate answer.");
    } finally {
      setIsEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setAnswer("");
      setFeedback("");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Mock Interview"
        title="Interview workspace"
        description="Practice AI-generated interview questions tailored to your target role and resume."
      />

      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-200 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-lg font-semibold text-white">Session Setup</h2>
          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Select Role</span>
              <select className="form-input mt-2" value={role} onChange={e => setRole(e.target.value)}>
                {roles.map((r) => <option className="bg-slate-950" key={r}>{r}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Select Experience Level</span>
              <select className="form-input mt-2" value={level} onChange={e => setLevel(e.target.value)}>
                {levels.map((l) => <option className="bg-slate-950" key={l}>{l}</option>)}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-medium text-slate-300">Select Difficulty</span>
              <select className="form-input mt-2" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                {difficulties.map((d) => <option className="bg-slate-950" key={d}>{d}</option>)}
              </select>
            </label>
            <button 
              className="button-primary button-large w-full" 
              type="button" 
              onClick={startInterview}
              disabled={isGenerating}
            >
              <Mic size={18} className={isGenerating ? "animate-pulse text-red-500" : ""} />
              {isGenerating ? "Generating Questions..." : "Start Interview"}
            </button>
          </div>
        </Card>

        <div className="grid gap-5">
          <Card>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <MessageSquareText size={18} className="text-cyan-300" />
                AI Question {questions.length > 0 ? `(${currentIdx + 1}/${questions.length})` : ""}
              </h2>
            </div>
            <div className="mt-4 min-h-32 rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-5 text-sm leading-6 text-slate-300">
              {questions.length > 0 ? questions[currentIdx] : "Questions will appear here when you start the interview."}
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-[1fr_15rem]">
            <Card>
              <h2 className="text-lg font-semibold text-white">User Answer</h2>
              <textarea 
                className="form-input mt-4 min-h-40 resize-none" 
                placeholder="Type your answer here..." 
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                disabled={questions.length === 0 || feedback !== ""}
              />
              <button 
                className="button-secondary mt-4" 
                type="button"
                onClick={submitAnswer}
                disabled={isEvaluating || !answer || feedback !== ""}
              >
                <Send size={16} />
                {isEvaluating ? "Evaluating..." : "Submit Answer"}
              </button>
            </Card>
            <Card>
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <Clock size={16} className="text-cyan-300" />
                Next Steps
              </div>
              <p className="mt-5 text-sm leading-6 text-slate-400">
                After receiving feedback on this question, you can proceed to the next one.
              </p>
              <button 
                className="button-primary mt-4 w-full" 
                onClick={nextQuestion}
                disabled={feedback === "" || currentIdx === questions.length - 1}
              >
                Next Question
              </button>
            </Card>
          </div>
          <Card>
            <h2 className="text-lg font-semibold text-white">Feedback Panel</h2>
            <div className="mt-4 min-h-24 p-4 rounded-xl bg-slate-900/50 border border-white/5">
              <p className="text-sm leading-6 text-slate-400 whitespace-pre-wrap">
                {feedback || "Feedback will appear here after you submit your answer."}
              </p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
