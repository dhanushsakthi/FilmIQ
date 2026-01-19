// Gemini API Client for Chrome Extension

const GEMINI_BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Get API key from Chrome storage
async function getGeminiApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['geminiApiKey'], (result) => {
            resolve(result.geminiApiKey || 'AIzaSyDgdb41GI78iidiFjtUw8k9rC4Xw3vOT6g');
        });
    });
}

async function processVoiceQuery(transcript) {
    try {
        const apiKey = await getGeminiApiKey();

        const prompt = `You are a movie intent parser. The user is asking for a movie recommendation via voice.
Extract the core search keyword or intent from this sentence: "${transcript}".

Examples:
"Show me some action movies from the 90s" -> "action movies 1990s"
"I want to watch Interstellar" -> "Interstellar"
"Funny movies" -> "comedy movies"
"Movies with Tom Cruise" -> "Tom Cruise movies"

Return ONLY the refined search query string, nothing else.`;

        const response = await fetch(`${GEMINI_BASE_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.status}`);
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text || transcript;
        return text.trim();
    } catch (error) {
        console.error('Gemini API Error:', error);
        return transcript; // Fallback to raw transcript
    }
}
