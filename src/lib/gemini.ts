import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;
let model: GenerativeModel;

const generationConfig: GenerationConfig = {
  temperature: 0.7,
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
    existingCV?: string;
  },
  jobDescription: string,
) => {
  if (!genAI || !model) {
    throw new Error("Gemini API not initialized");
  }

  const prompt = `
    You are a professional resume writer specializing in ATS-optimized resumes.
    Create a highly effective resume following these strict guidelines:

    INPUT DATA:
    ${personalInfo.existingCV ? `EXISTING RESUME CONTENT:\n${personalInfo.existingCV}\n\n` : ""}
    
    CANDIDATE INFORMATION:
    - Name: ${personalInfo.fullName}
    - Email: ${personalInfo.email}
    ${personalInfo.phone ? `- Phone: ${personalInfo.phone}` : ""}
    ${personalInfo.location ? `- Location: ${personalInfo.location}` : ""}
    ${personalInfo.summary ? `\nProfessional Summary:\n${personalInfo.summary}` : ""}

    TARGET JOB DESCRIPTION:
    ${jobDescription}

    FORMATTING REQUIREMENTS:
    1. DO NOT use any Markdown syntax (no **, ##, ``` etc.)
    2. Use plain text formatting
    3. Use clear section headers without special characters
    4. Separate sections with blank lines
    5. Use standard bullet points (•) for lists
    6. Never repeat contact information
    7. Fix any spelling errors (e.g., "isreal" should be "Israel")

    CONTENT REQUIREMENTS:
    1. Extract and prominently feature keywords from the job description
    2. If an existing resume is provided, intelligently incorporate relevant experience
    3. Use strong action verbs
    4. Include measurable achievements
    5. Maintain professional language and tone
    6. Organize content in these sections:
       - Professional Summary (2-3 impactful sentences)
       - Core Skills (relevant to the job description)
       - Professional Experience
       - Education & Certifications

    The output should be clean, professional, and ready for formatting without any special characters or markup.
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