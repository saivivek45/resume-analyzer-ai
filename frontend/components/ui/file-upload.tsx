"use client";

import { ChangeEvent, useId, useRef } from "react";
import { CheckCircle2, FileText, Upload, X } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export function FileUpload({
  selectedFile,
  error,
  success,
  isUploading,
  onSelect,
  onClear,
  onUpload,
  compact = false,
}: {
  selectedFile: File | null;
  error?: string;
  success?: string;
  isUploading?: boolean;
  onSelect: (file: File | null) => void;
  onClear: () => void;
  onUpload?: () => void;
  compact?: boolean;
}) {
  const fileInputId = useId();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>): void {
    onSelect(event.target.files?.[0] ?? null);
  }

  function clear(): void {
    onClear();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <div className="w-full">
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
        className="flex cursor-pointer flex-col items-center rounded-2xl border border-dashed border-cyan-300/25 bg-cyan-300/[0.04] px-5 py-6 text-center text-sm text-slate-300 hover:border-cyan-300/45 hover:bg-cyan-300/[0.07]"
      >
        <FileText className="mb-3 text-cyan-300" size={compact ? 22 : 28} />
        <span className="font-semibold text-white">
          {selectedFile ? "Change selected PDF" : "Choose a PDF resume"}
        </span>
        <span className="mt-1 text-xs text-slate-500">PDF resumes are supported right now.</span>
      </label>

      {selectedFile ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-xl border border-white/[0.08] bg-white/[0.035] px-4 py-3 text-left">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-white">{selectedFile.name}</p>
            <p className="mt-0.5 text-xs text-slate-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            aria-label="Remove selected file"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 hover:text-white"
            onClick={clear}
            type="button"
          >
            <X size={16} />
          </button>
        </div>
      ) : null}

      {error ? <div className="mt-4"><ErrorState message={error} /></div> : null}

      {success ? (
        <p className="mt-4 flex items-start gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3 text-sm leading-6 text-emerald-200">
          <CheckCircle2 className="mt-0.5 shrink-0" size={16} />
          <span>{success}</span>
        </p>
      ) : null}

      {onUpload ? (
        <button
          className="button-primary button-large mt-5 w-full"
          disabled={!selectedFile || isUploading}
          onClick={onUpload}
          type="button"
        >
          <Upload size={18} />
          {isUploading ? "Uploading..." : "Upload Resume"}
        </button>
      ) : null}
    </div>
  );
}
