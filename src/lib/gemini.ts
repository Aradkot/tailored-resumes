import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;
let model: GenerativeModel;

const generationConfig: GenerationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
};

export const initializeGemini = (apiKey: string) => {
  genAI = new GoogleGenerativeAI(apiKey);
  model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp",
    generationConfig,
  });
};

export const generateResume = async (
  personalInfo: {
    fullName: string;
    email: string;
    phone?: string;
    location?: string;
    summary?: string;
  },
  jobDescription: string,
  existingCV?: string
) => {
  if (!genAI || !model) {
    throw new Error("Gemini API not initialized");
  }

  const prompt = `
    Create a professional resume for a job application. Here are the details:

    ${existingCV ? `Existing CV Content:\n${existingCV}\n\n` : ""}

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
    2. Highlights relevant skills and experiences from the existing CV if provided
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