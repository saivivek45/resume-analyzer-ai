"use client";
import { ChangeEvent, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthLoading } from "@/components/auth-loading";
import { useAuth } from "@/components/auth-provider";
import { Brand } from "@/components/brand";
import { AlertCircle, CheckCircle2, FileSearch, FileText, Upload, User, X } from "lucide-react";
import api, { getApiErrorMessage } from "@/src/lib/api";

interface UploadResponse {
  text?: string;
}

interface AnalysisResponse {
  overall_score: number;
  ats_score: number;
  content_score: number;
  detected_skills: string[];
  missing_skills: string[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  file_name?: string;
  user_email?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [analysisError, setAnalysisError] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, router, user]);

  async function handleLogout(): Promise<void> {
    await logout();
    router.replace("/login");
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    const file = event.target.files?.[0] ?? null;

    setUploadError("");
    setUploadSuccess("");
    setResumeText("");
    setAnalysis(null);
    setAnalysisError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      setSelectedFile(null);
      setUploadError("Please choose a PDF resume file.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  }

  function clearSelectedFile(): void {
    setSelectedFile(null);
    setResumeText("");
    setAnalysis(null);
    setAnalysisError("");
    setUploadError("");
    setUploadSuccess("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleUpload(): Promise<void> {
    if (!selectedFile) {
      setUploadError("Choose a PDF resume before uploading.");
      return;
    }

    if (!user) {
      setUploadError("Please log in again before uploading.");
      return;
    }

    setIsUploading(true);
    setUploadError("");
    setUploadSuccess("");

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await api.post<UploadResponse>("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const extractedText = response.data.text?.trim() ?? "";

      if (!extractedText) {
        setUploadError("The upload worked, but no readable text was found in this PDF.");
        setResumeText("");
        return;
      }

      setResumeText(extractedText);

      setUploadSuccess("Resume uploaded and extracted.");
    } catch (error) {
      setUploadError(getApiErrorMessage(error, "Upload failed. Please try another PDF."));
    } finally {
      setIsUploading(false);
    }
  }


  async function handleAnalyzeResume(): Promise<void> {
    if (!resumeText) {
      setAnalysisError("Upload a resume before running analysis.");
      return;
    }

    if (!user) {
      setAnalysisError("Please log in again before analyzing.");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");

    try {
      const response = await api.post<AnalysisResponse>("/resume/analyze", {
        text: resumeText,
        file_name: selectedFile?.name,
        user_email: user.email,
      });

      setAnalysis(response.data);
    } catch (error) {
      setAnalysisError(getApiErrorMessage(error, "Analysis failed. Please try again."));
    } finally {
      setIsAnalyzing(false);
    }

  }

  if (isLoading || !user) {
    return <AuthLoading />;
  }

  const analysisRows = [
    { label: "Overall resume score", value: analysis?.overall_score },
    { label: "ATS compatibility", value: analysis?.ats_score },
    { label: "Content impact", value: analysis?.content_score },
  ];

  return (
    <main className="min-h-screen">
      <header className="border-b border-white/[0.07] bg-slate-950/40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
          <Brand />

          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push("/profile")}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-cyan-400/20 bg-cyan-400/5 text-cyan-300 transition-all duration-300 hover:scale-105 hover:border-cyan-400/40 hover:bg-cyan-400/10"
            >
              <User size={20} />
            </button>

            <button
              className="button-secondary"
              onClick={() => void handleLogout()}
              type="button"
            >
              Log out
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
        <div className="flex flex-col justify-between gap-5 border-b border-white/[0.07] pb-8 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-cyan-300">{user.email}</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Welcome, {user.full_name}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Upload a resume to uncover its strengths, find opportunities, and get focused recommendations for your next application.</p>
          </div>
          <span className="w-fit rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-300">Account active</span>
        </div>
        <section className="mt-8 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="glass-card flex min-h-80 flex-col items-center justify-center p-7 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-300">
              <Upload size={24} />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-white">Upload your resume</h2>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">Add a PDF file to begin your personalized resume analysis.</p>
            <input
              id={fileInputId}
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="sr-only"
              onChange={handleFileChange}
            />
            <label
              htmlFor={fileInputId}
              className="mt-6 flex w-full max-w-sm cursor-pointer flex-col items-center rounded-2xl border border-dashed border-cyan-300/25 bg-cyan-300/[0.04] px-5 py-6 text-sm text-slate-300 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]"
            >
              <FileText className="mb-3 text-cyan-300" size={28} />
              <span className="font-semibold text-white">
                {selectedFile ? "Change selected PDF" : "Choose a PDF file"}
              </span>
              <span className="mt-1 text-xs text-slate-500">PDF resumes are supported right now.</span>
            </label>

            {selectedFile && (
              <div className="mt-4 flex w-full max-w-sm items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-left">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">{selectedFile.name}</p>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  aria-label="Remove selected file"
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
                  onClick={clearSelectedFile}
                  type="button"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            {uploadError && (
              <p className="mt-4 flex max-w-sm items-start gap-2 text-left text-sm leading-6 text-rose-300">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{uploadError}</span>
              </p>
            )}

            {uploadSuccess && (
              <p className="mt-4 flex max-w-sm items-start gap-2 text-left text-sm leading-6 text-emerald-300">
                <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
                <span>{uploadSuccess}</span>
              </p>
            )}

            <button
              className="button-primary button-large mt-5"
              disabled={!selectedFile || isUploading}
              onClick={() => void handleUpload()}
              type="button"
            >
              {isUploading ? "Uploading..." : "Upload Resume"}
            </button>

            {resumeText && (
              <button
                className="button-secondary button-large mt-3"
                disabled={isAnalyzing}
                onClick={() => void handleAnalyzeResume()}
                type="button"
              >
                <FileSearch size={18} />
                {isAnalyzing ? "Analyzing..." : "Analyze Resume"}
              </button>
            )}
          </article>
          <article className="glass-card min-h-80 p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Latest report</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Resume analysis</h2>
              </div>
              <span className="rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-500">
                {analysis ? "Analyzed" : resumeText ? "Ready" : "Waiting"}
              </span>
            </div>
            <div className="mt-8 space-y-4">
              {analysisRows.map((row) => (
                <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.025] px-4 py-4" key={row.label}>
                  <span className="text-sm text-slate-400">{row.label}</span>
                  {typeof row.value === "number" ? (
                    <span className="text-sm font-semibold text-cyan-200">{row.value}/100</span>
                  ) : (
                    <span className="h-2 w-20 rounded-full bg-white/[0.06]" />
                  )}
                </div>
              ))}
            </div>
            {analysisError && (
              <p className="mt-5 flex items-start gap-2 text-sm leading-6 text-rose-300">
                <AlertCircle className="mt-0.5 shrink-0" size={16} />
                <span>{analysisError}</span>
              </p>
            )}
            <p className="mt-6 text-sm leading-6 text-slate-500">
              {analysis
                ? "Analysis complete. Review the recommendations below and refine your resume for the role you want."
                : resumeText
                  ? "Your resume text was extracted successfully. Run analysis to generate scores and recommendations."
                : "Your insights and recommendations will appear here after your first resume upload."}
            </p>
            {analysis && (
              <div className="mt-6 space-y-5">
                <div>
                  <h3 className="text-sm font-semibold text-white">Detected skills</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {analysis.detected_skills.length ? (
                      analysis.detected_skills.map((skill) => (
                        <span className="rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-1 text-xs text-cyan-200" key={skill}>
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-sm text-slate-500">No searchable skills detected yet.</span>
                    )}
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <h3 className="text-sm font-semibold text-white">Strengths</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                      {analysis.strengths.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">Improve next</h3>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-400">
                      {analysis.recommendations.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </article>
        </section>
        {resumeText && (
          <section className="mt-8">
            <article className="glass-card p-7">
              <h2 className="text-xl font-semibold text-white">Extracted Resume Text</h2>

              <pre className="mt-4 max-h-[32rem] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4 text-left text-sm leading-6 text-slate-300">
                {resumeText}
              </pre>
            </article>
          </section>
        )}
      </div>
    </main>
  );
}
