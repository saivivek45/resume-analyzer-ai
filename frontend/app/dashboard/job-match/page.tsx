"use client";

import { BriefcaseBusiness, GitCompareArrows, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { FileUpload } from "@/components/ui/file-upload";
import { PageHeader } from "@/components/ui/page-header";
import { ProgressRing } from "@/components/ui/progress-ring";
import { useResumeUpload } from "@/components/dashboard/resume-upload-context";

export default function JobMatchPage() {
  const upload = useResumeUpload();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Job Match"
        title="Resume to role fit"
        description="Compare a resume against a role description once matching endpoints are available."
      />

      <div className="grid gap-5 xl:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-white">Upload Resume</h2>
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
        </Card>
        <Card>
          <h2 className="text-lg font-semibold text-white">Paste Job Description</h2>
          <textarea className="form-input mt-4 min-h-64 resize-none" placeholder="Paste the role description and requirements" />
          <button className="button-primary mt-4" type="button">
            <BriefcaseBusiness size={16} />
            Calculate Match
          </button>
        </Card>
      </div>

      <div className="grid gap-5 lg:grid-cols-[18rem_1fr]">
        <Card>
          <ProgressRing label="Match Percentage" size="lg" />
        </Card>
        <EmptyState icon={GitCompareArrows} title="Skills Comparison" description="Matched and missing skills will appear here after backend matching is connected." />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <EmptyState icon={BriefcaseBusiness} title="Missing Skills" description="Role-specific skill gaps will be listed from the future job-match response." />
        <EmptyState icon={Sparkles} title="Recommended Improvements" description="Recommendations will be shown when the endpoint returns them." />
      </div>
    </div>
  );
}
