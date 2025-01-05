import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PersonalInfo } from "./PersonalInfoForm";

interface ResumePreviewProps {
  personalInfo: PersonalInfo;
  generatedContent: string;
  onBack: () => void;
  onDownload: () => void;
}

export function ResumePreview({
  personalInfo,
  generatedContent,
  onBack,
  onDownload,
}: ResumePreviewProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="p-8 max-w-[800px] mx-auto bg-white shadow-lg">
        <div className="space-y-6">
          <div className="text-center border-b pb-6">
            <h1 className="resume-heading text-3xl font-bold text-gray-900">
              {personalInfo.fullName}
            </h1>
            <div className="mt-2 text-gray-600 space-y-1">
              <p>{personalInfo.email}</p>
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>

          {personalInfo.summary && (
            <div>
              <h2 className="resume-heading text-xl font-bold text-gray-900 mb-2">
                Professional Summary
              </h2>
              <p className="resume-body text-gray-700">{personalInfo.summary}</p>
            </div>
          )}

          <div className="resume-body whitespace-pre-wrap text-gray-700">
            {generatedContent}
          </div>
        </div>
      </Card>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button onClick={onDownload} className="flex-1">
          Download PDF
        </Button>
      </div>
    </div>
  );
}