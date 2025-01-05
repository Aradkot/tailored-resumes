import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import * as mammoth from "mammoth";
import * as pdfjsLib from 'pdfjs-dist';

// Initialize pdf.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

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

    try {
      let text = "";
      
      if (file.type === "application/pdf") {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const maxPages = pdf.numPages;
        const textContent = [];
        
        for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const content = await page.getTextContent();
          textContent.push(content.items.map((item: any) => item.str).join(' '));
        }
        
        text = textContent.join('\n');
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        text = result.value;
      } else if (file.type === "text/plain") {
        text = await file.text();
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF, Word (.docx), or text file (.txt)",
          variant: "destructive",
        });
        return;
      }

      setExistingCV(text);
      toast({
        title: "CV Uploaded",
        description: "Your existing CV has been successfully loaded.",
      });
    } catch (error) {
      console.error('Error reading file:', error);
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

    // Validate required fields
    if (!data.fullName || !data.email) {
      toast({
        title: "Required Fields Missing",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Remove empty fields
    Object.keys(data).forEach((key) => {
      if (!data[key as keyof PersonalInfo]) {
        delete data[key as keyof PersonalInfo];
      }
    });

    onNext(data as PersonalInfo);
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
          accept=".txt,.pdf,.docx"
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