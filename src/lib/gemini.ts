import { GoogleGenerativeAI, GenerativeModel, GenerationConfig } from "@google/generative-ai";

let genAI: GoogleGenerativeAI;
let model: GenerativeModel;

const generationConfig: GenerationConfig = {
  temperature: 0.7, // Reduced for more consistent output
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
    Act as a professional resume writer with expertise in creating ATS-optimized resumes. 
    Create a highly effective, professional resume using the following information:

    ${personalInfo.existingCV ? `EXISTING CV CONTENT TO INCORPORATE:\n${personalInfo.existingCV}\n\n` : ""}

    CANDIDATE INFORMATION:
    - Full Name: ${personalInfo.fullName}
    - Email: ${personalInfo.email}
    ${personalInfo.phone ? `- Phone: ${personalInfo.phone}` : ""}
    ${personalInfo.location ? `- Location: ${personalInfo.location}` : ""}
    ${personalInfo.summary ? `\nProfessional Summary:\n${personalInfo.summary}` : ""}

    TARGET JOB DESCRIPTION:
    ${jobDescription}

    REQUIREMENTS:
    1. Create a resume that strongly aligns with the job requirements, emphasizing relevant keywords and skills
    2. If an existing CV is provided, intelligently incorporate the most relevant experiences and achievements
    3. Use clear, professional business English
    4. Structure the content in these sections:
       - Professional Summary (2-3 impactful sentences)
       - Core Skills (bullet points of key technical and soft skills relevant to the role)
       - Professional Experience (with measurable achievements)
       - Education & Certifications
    5. Ensure the content is ATS-friendly and optimized for the specific role
    6. Use action verbs and quantifiable achievements where possible
    7. Keep the formatting clean and simple, using only plain text

    Format each section with clear headings and maintain professional spacing.
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