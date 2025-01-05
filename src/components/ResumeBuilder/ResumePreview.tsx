import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PersonalInfo } from "./PersonalInfoForm";
import { useState } from "react";

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
  const [template, setTemplate] = useState("professional");

  const getTemplateStyles = () => {
    switch (template) {
      case "creative":
        return {
          container: "p-8 max-w-[800px] mx-auto bg-gradient-to-br from-blue-50 to-white shadow-lg",
          header: "text-center border-b border-blue-200 pb-6",
          name: "text-3xl font-bold text-blue-800",
          contact: "mt-2 text-blue-600 space-y-1",
          section: "border-l-4 border-blue-400 pl-4 py-2",
          sectionTitle: "text-xl font-bold text-blue-800 mb-2",
          content: "text-blue-900",
        };
      case "tech":
        return {
          container: "p-8 max-w-[800px] mx-auto bg-slate-50 shadow-lg border-t-4 border-indigo-500",
          header: "text-left border-b border-slate-200 pb-6",
          name: "text-3xl font-bold text-slate-800",
          contact: "mt-2 text-slate-600 space-y-1 flex flex-wrap gap-4",
          section: "border-b border-slate-200 py-4",
          sectionTitle: "text-xl font-bold text-indigo-600 mb-2",
          content: "text-slate-700",
        };
      default: // professional
        return {
          container: "p-8 max-w-[800px] mx-auto bg-white shadow-lg",
          header: "text-center border-b pb-6",
          name: "text-3xl font-bold text-gray-900",
          contact: "mt-2 text-gray-600 space-y-1",
          section: "py-4",
          sectionTitle: "text-xl font-bold text-gray-900 mb-2",
          content: "text-gray-700",
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-end mb-4">
        <Select value={template} onValueChange={setTemplate}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Choose template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="creative">Creative</SelectItem>
            <SelectItem value="tech">Tech-focused</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className={styles.container}>
        <div className="resume-preview">
          <div className={styles.header}>
            <h1 className={`resume-heading ${styles.name}`}>
              {personalInfo.fullName}
            </h1>
            <div className={styles.contact}>
              <p>{personalInfo.email}</p>
              {personalInfo.phone && <p>{personalInfo.phone}</p>}
              {personalInfo.location && <p>{personalInfo.location}</p>}
            </div>
          </div>

          {personalInfo.summary && (
            <div className={styles.section}>
              <h2 className={`resume-heading ${styles.sectionTitle}`}>
                Professional Summary
              </h2>
              <p className={`resume-body ${styles.content}`}>{personalInfo.summary}</p>
            </div>
          )}

          <div className={`resume-body whitespace-pre-wrap ${styles.content}`}>
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