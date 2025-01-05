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
    const baseStyles = {
      container: "p-8 max-w-[800px] mx-auto bg-white shadow-lg h-[1056px] overflow-hidden", // US Letter size in pixels
      header: "text-center border-b border-gray-200 pb-6 mb-6",
      name: "text-3xl font-bold text-gray-900 mb-2",
      contact: "mt-2 text-gray-600 flex flex-wrap gap-3 justify-center",
      section: "mb-6",
      sectionTitle: "text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1",
      content: "text-gray-700 leading-relaxed",
      bullet: "list-disc ml-4 mb-2",
    };

    switch (template) {
      case "creative":
        return {
          ...baseStyles,
          container: `${baseStyles.container} bg-gradient-to-br from-blue-50 to-white`,
        };
      case "tech":
        return {
          ...baseStyles,
          container: `${baseStyles.container} bg-slate-50 border-t-4 border-indigo-500`,
        };
      default: // professional
        return baseStyles;
    }
  };

  const styles = getTemplateStyles();

  const formatContent = (content: string) => {
    return content
      .split('\n')
      .map((line, index) => {
        if (line.trim().startsWith('•')) {
          return <li key={index} className={styles.bullet}>{line.trim().substring(1)}</li>;
        }
        return <p key={index} className="mb-2">{line}</p>;
      });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Resume Preview</h2>
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
          <header className={styles.header}>
            <h1 className={`resume-heading ${styles.name}`}>
              {personalInfo.fullName}
            </h1>
            <div className={styles.contact}>
              <span>{personalInfo.email}</span>
              {personalInfo.phone && <span>•</span>}
              {personalInfo.phone && <span>{personalInfo.phone}</span>}
              {personalInfo.location && <span>•</span>}
              {personalInfo.location && <span>{personalInfo.location}</span>}
            </div>
          </header>

          <div className={`resume-body ${styles.content}`}>
            {formatContent(generatedContent)}
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
