"use client";

import { FileSearch } from "lucide-react";
import { AnalysisReport } from "@/components/dashboard/analysis-report";
import { useResumeUpload } from "@/components/dashboard/resume-upload-context";
import { Card } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { FileUpload } from "@/components/ui/file-upload";
import { PageHeader } from "@/components/ui/page-header";

export default function ResumeAnalysisPage() {
  const upload = useResumeUpload();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Resume Analysis"
        title="Resume intelligence"
        description="Upload a PDF, extract its text through the existing backend, then run the analyzer without adding invented insights."
      />

      <div className="grid gap-5 xl:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <h2 className="text-lg font-semibold text-white">Upload and Analyze</h2>
          <p className="mt-2 text-sm leading-6 text-slate-400">The report only displays fields returned by the backend response.</p>
          <div className="mt-5">
            <FileUpload
              selectedFile={upload.selectedFile}
              error={upload.uploadError}
              success={upload.uploadSuccess}
              isUploading={upload.isUploading}
              onClear={upload.clearFile}
              onSelect={upload.selectFile}
              onUpload={() => void upload.uploadResume()}
            />
          </div>
          <button
            className="button-primary button-large mt-4 w-full"
            disabled={!upload.resumeText || upload.isAnalyzing}
            onClick={() => void upload.analyzeResume()}
            type="button"
          >
            <FileSearch size={18} />
            {upload.isAnalyzing ? "Analyzing..." : "Run Analysis"}
          </button>
          {upload.analysisError ? <div className="mt-4"><ErrorState message={upload.analysisError} /></div> : null}
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white">Extracted Text</h2>
          {upload.resumeText ? (
            <pre className="mt-4 max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-2xl border border-white/[0.07] bg-slate-950/45 p-4 text-sm leading-6 text-slate-300">
              {upload.resumeText}
            </pre>
          ) : (
            <p className="mt-4 rounded-2xl border border-dashed border-white/10 bg-white/[0.025] p-6 text-sm leading-6 text-slate-500">
              Resume text will appear here after upload.
            </p>
          )}
        </Card>
      </div>

      <AnalysisReport analysis={upload.analysis} />
    </div>
  );
}
