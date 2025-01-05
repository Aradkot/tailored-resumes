import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface JobDescriptionFormProps {
  onBack: () => void;
  onSubmit: (jobDescription: string, existingCV?: string) => void;
}

export function JobDescriptionForm({ onBack, onSubmit }: JobDescriptionFormProps) {
  const { toast } = useToast();
  const [existingCV, setExistingCV] = useState<string>("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/plain") {
      toast({
        title: "Invalid File Type",
        description: "Please upload a text file (.txt)",
        variant: "destructive",
      });
      return;
    }

    try {
      const text = await file.text();
      setExistingCV(text);
      toast({
        title: "CV Uploaded",
        description: "Your existing CV has been successfully loaded.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const jobDescription = formData.get("jobDescription") as string;

    if (!jobDescription) {
      toast({
        title: "Job Description Required",
        description: "Please enter a job description to continue.",
        variant: "destructive",
      });
      return;
    }

    onSubmit(jobDescription, existingCV);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div>
        <label htmlFor="existingCV" className="block text-sm font-medium mb-1">
          Upload Existing CV (Optional)
        </label>
        <Input
          id="existingCV"
          type="file"
          accept=".txt"
          onChange={handleFileUpload}
          className="mb-4"
        />
      </div>

      <div>
        <label htmlFor="jobDescription" className="block text-sm font-medium mb-1">
          Job Description *
        </label>
        <Textarea
          id="jobDescription"
          name="jobDescription"
          placeholder="Paste the job description here..."
          className="h-64"
          required
        />
      </div>

      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1">
          Generate Resume
        </Button>
      </div>
    </form>
  );
}