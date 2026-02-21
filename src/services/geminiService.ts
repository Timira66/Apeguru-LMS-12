import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function chatWithGemini(message: string, history: any[] = []) {
  const model = ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      { role: "user", parts: [{ text: "You are Ape Guru AI, a helpful educational assistant for the Ape Guru Smart LMS. You can speak in Sinhala and any other language. You are friendly, encouraging, and knowledgeable." }] },
      ...history.map(h => ({
        role: h.role === 'user' ? 'user' : 'model',
        parts: [{ text: h.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ],
  });

  const response = await model;
  return response.text;
}
