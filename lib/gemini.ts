import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const processVoiceQuery = async (transcript: string): Promise<string> => {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
        You are a movie intent parser. The user is asking for a movie recommendation via voice.
        Extract the core search keyword or intent from this sentence: "${transcript}".
        
        Examples:
        "Show me some action movies from the 90s" -> "action movies 1990s"
        "I want to watch Interstellar" -> "Interstellar"
        "Funny movies" -> "comedy movies"
        "Movies with Tom Cruise" -> "Tom Cruise movies"

        Return ONLY the refined search query string, nothing else.
        `;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error("Gemini API Error:", error);
        return transcript; // Fallback to raw transcript
    }
}
