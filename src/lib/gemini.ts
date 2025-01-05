import { GoogleGenerativeAI } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
};

export const generateResume = async (
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
  },
  jobDescription: string
) => {
  if (!genAI) {
    throw new Error("Gemini API not initialized");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    Create a professional resume for a job application. Here are the details:

    Personal Information:
    - Name: ${personalInfo.fullName}
    - Email: ${personalInfo.email}
    ${personalInfo.phone ? `- Phone: ${personalInfo.phone}` : ""}
    ${personalInfo.location ? `- Location: ${personalInfo.location}` : ""}
    ${personalInfo.summary ? `\nProfessional Summary:\n${personalInfo.summary}` : ""}

    Job Description:
    ${jobDescription}

    Please generate a resume that:
    1. Is tailored to match the job requirements
    2. Highlights relevant skills and experiences
    3. Uses professional, clear language
    4. Is formatted in clear sections (Skills, Experience, Education)
    5. Is ATS-friendly

    Format the output in a clean, readable way with proper spacing between sections.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating resume:", error);
    throw new Error("Failed to generate resume. Please try again.");
  }
};