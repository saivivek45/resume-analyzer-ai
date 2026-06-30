"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import api, { getApiErrorMessage } from "@/src/lib/api";
import type { AnalysisResponse, UploadResponse } from "@/src/lib/resume";
import { saveLatestAnalysis } from "@/src/lib/resume";
import { useAuth } from "@/components/auth-provider";

interface ResumeUploadContextValue {
  selectedFile: File | null;
  resumeText: string;
  analysis: AnalysisResponse | null;
  isUploading: boolean;
  isAnalyzing: boolean;
  uploadError: string;
  analysisError: string;
  uploadSuccess: string;
  selectFile: (file: File | null) => void;
  clearFile: () => void;
  uploadResume: () => Promise<void>;
  analyzeResume: () => Promise<void>;
}

const ResumeUploadContext = createContext<ResumeUploadContextValue | null>(null);

export function ResumeUploadProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [analysisError, setAnalysisError] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState("");

  const selectFile = useCallback((file: File | null) => {
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
      return;
    }

    setSelectedFile(file);
  }, []);

  const clearFile = useCallback(() => {
    setSelectedFile(null);
    setResumeText("");
    setAnalysis(null);
    setAnalysisError("");
    setUploadError("");
    setUploadSuccess("");
  }, []);

  const uploadResume = useCallback(async () => {
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
        headers: { "Content-Type": "multipart/form-data" },
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
  }, [selectedFile, user]);

  const analyzeResume = useCallback(async () => {
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
      saveLatestAnalysis(response.data, selectedFile?.name ?? "Uploaded resume");
    } catch (error) {
      setAnalysisError(getApiErrorMessage(error, "Analysis failed. Please try again."));
    } finally {
      setIsAnalyzing(false);
    }
  }, [resumeText, selectedFile, user]);

  const value = useMemo(
    () => ({
      selectedFile,
      resumeText,
      analysis,
      isUploading,
      isAnalyzing,
      uploadError,
      analysisError,
      uploadSuccess,
      selectFile,
      clearFile,
      uploadResume,
      analyzeResume,
    }),
    [
      analysis,
      analysisError,
      clearFile,
      isAnalyzing,
      isUploading,
      resumeText,
      selectFile,
      selectedFile,
      uploadError,
      uploadResume,
      uploadSuccess,
      analyzeResume,
    ],
  );

  return <ResumeUploadContext.Provider value={value}>{children}</ResumeUploadContext.Provider>;
}

export function useResumeUpload(): ResumeUploadContextValue {
  const context = useContext(ResumeUploadContext);
  if (!context) {
    throw new Error("useResumeUpload must be used inside ResumeUploadProvider");
  }

  return context;
}
