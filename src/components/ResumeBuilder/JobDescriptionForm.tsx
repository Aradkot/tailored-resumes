import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface JobDescriptionFormProps {
  onBack: () => void;
  onSubmit: (jobDescription: string) => void;
}

export function JobDescriptionForm({ onBack, onSubmit }: JobDescriptionFormProps) {
  const { toast } = useToast();

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

    onSubmit(jobDescription);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
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