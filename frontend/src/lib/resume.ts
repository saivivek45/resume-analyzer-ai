import api from "./api";

export interface UploadResponse {
  text?: string;
}

export interface AnalysisResponse {
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

export interface ResumeHistoryItem {
  id: string;
  resumeName: string;
  uploadDate: string;
  atsScore: number;
  overallScore: number;
}

export async function fetchLatestAnalysis(): Promise<AnalysisResponse | null> {
  try {
    const res = await api.get<AnalysisResponse>("/resume/latest");
    return res.data;
  } catch (error) {
    return null;
  }
}

export async function fetchResumeHistory(): Promise<ResumeHistoryItem[]> {
  try {
    const res = await api.get<ResumeHistoryItem[]>("/resume/history");
    return res.data;
  } catch (error) {
    return [];
  }
}

