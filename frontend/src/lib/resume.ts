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

const latestAnalysisKey = "careerpilot.latestAnalysis";
const historyKey = "careerpilot.resumeHistory";

export function saveLatestAnalysis(analysis: AnalysisResponse, resumeName: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    latestAnalysisKey,
    JSON.stringify({
      ...analysis,
      file_name: analysis.file_name ?? resumeName,
    }),
  );

  const history = getResumeHistory();
  const item: ResumeHistoryItem = {
    id: `${Date.now()}-${resumeName}`,
    resumeName,
    uploadDate: new Date().toISOString(),
    atsScore: analysis.ats_score,
    overallScore: analysis.overall_score,
  };

  window.localStorage.setItem(historyKey, JSON.stringify([item, ...history].slice(0, 12)));
}

export function getLatestAnalysis(): AnalysisResponse | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(latestAnalysisKey);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AnalysisResponse;
  } catch {
    return null;
  }
}

export function getResumeHistory(): ResumeHistoryItem[] {
  if (typeof window === "undefined") {
    return [];
  }

  const raw = window.localStorage.getItem(historyKey);
  if (!raw) {
    return [];
  }

  try {
    return JSON.parse(raw) as ResumeHistoryItem[];
  } catch {
    return [];
  }
}
