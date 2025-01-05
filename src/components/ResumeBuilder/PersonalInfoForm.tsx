import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  existingCV?: string;
}

interface PersonalInfoFormProps {
  onNext: (data: PersonalInfo) => void;
}

export function PersonalInfoForm({ onNext }: PersonalInfoFormProps) {
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
    const data = {
      fullName: formData.get("fullName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      location: formData.get("location") as string,
      summary: formData.get("summary") as string,
      existingCV: existingCV,
    };

    if (!data.fullName || !data.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    onNext(data);
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

      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">
            Full Name *
          </label>
          <Input
            id="fullName"
            name="fullName"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-1">
            Email *
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
          />
        </div>
        
        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-1">
            Phone
          </label>
          <Input
            id="phone"
            name="phone"
            placeholder="+1 (555) 123-4567"
          />
        </div>
        
        <div>
          <label htmlFor="location" className="block text-sm font-medium mb-1">
            Location
          </label>
          <Input
            id="location"
            name="location"
            placeholder="City, Country"
          />
        </div>
        
        <div>
          <label htmlFor="summary" className="block text-sm font-medium mb-1">
            Professional Summary
          </label>
          <Textarea
            id="summary"
            name="summary"
            placeholder="Brief overview of your professional background..."
            className="h-32"
          />
        </div>
      </div>

      <Button type="submit" className="w-full">
        Next
      </Button>
    </form>
  );
}