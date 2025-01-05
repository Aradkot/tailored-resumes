import { useState } from "react";
import { PersonalInfoForm, type PersonalInfo } from "@/components/ResumeBuilder/PersonalInfoForm";
import { JobDescriptionForm } from "@/components/ResumeBuilder/JobDescriptionForm";
import { ResumePreview } from "@/components/ResumeBuilder/ResumePreview";
import { generateResume } from "@/api/resume";
import { useToast } from "@/hooks/use-toast";
import html2pdf from "html2pdf.js";

const Index = () => {
  const [step, setStep] = useState(1);
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo | null>(null);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const { toast } = useToast();

  const handlePersonalInfoSubmit = (data: PersonalInfo) => {
    setPersonalInfo(data);
    setStep(2);
  };

  const handleJobDescriptionSubmit = async (jobDescription: string) => {
    try {
      toast({
        title: "Generating Resume",
        description: "Please wait while we create your tailored resume...",
      });

      const content = await generateResume(personalInfo!, jobDescription);
      setGeneratedContent(content);
      setStep(3);
    } catch (error) {
      console.error("Error generating resume:", error);
      toast({
        title: "Error",
        description: "Failed to generate resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDownload = () => {
    const element = document.querySelector(".resume-preview");
    if (!element) return;

    const opt = {
      margin: [0.75, 0.75],
      filename: `${personalInfo?.fullName.replace(/\s+/g, "_")}_resume.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { 
        scale: 4,
        useCORS: true,
        logging: true,
        letterRendering: true,
        backgroundColor: '#ffffff',
      },
      jsPDF: { 
        unit: "in", 
        format: "letter", 
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Resume Builder</h1>
          <p className="mt-2 text-gray-600">
            Create a professional, tailored resume in minutes
          </p>
        </div>

        <div className="bg-white shadow-sm rounded-lg p-6 md:p-8">
          {step === 1 && <PersonalInfoForm onNext={handlePersonalInfoSubmit} />}
          {step === 2 && (
            <JobDescriptionForm
              onBack={() => setStep(1)}
              onSubmit={handleJobDescriptionSubmit}
            />
          )}
          {step === 3 && personalInfo && (
            <ResumePreview
              personalInfo={personalInfo}
              generatedContent={generatedContent}
              onBack={() => setStep(2)}
              onDownload={handleDownload}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
