
import { GoogleGenAI } from "@google/genai";

// Use process.env.API_KEY directly as per guidelines
export const summarizeArticle = async (title: string, content: string): Promise<string> => {
  try {
    // Initializing with the required named parameter and using process.env.API_KEY directly
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `بصفتك مساعداً أكاديمياً، قم بتلخيص هذا المقال باللغة العربية بأسلوب رصين ومختصر (في 3 نقاط أساسية):\nالعنوان: ${title}\nالمحتوى: ${content}`,
      config: {
        temperature: 0.7,
        topP: 0.8,
      }
    });

    // Accessing response.text as a property, not a method
    return response.text || "لم يتمكن الذكاء الاصطناعي من توليد ملخص.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "حدث خطأ أثناء محاولة تلخيص المقال.";
  }
};
