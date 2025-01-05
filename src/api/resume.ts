import { PersonalInfo } from "@/components/ResumeBuilder/PersonalInfoForm";

const API_URL = "https://your-backend-url/api/generate-resume";

export const generateResume = async (
  personalInfo: PersonalInfo,
  jobDescription: string,
) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalInfo,
        jobDescription,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate resume");
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate resume. Please try again.");
  }
};