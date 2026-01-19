export async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    // Try BOTH TMDB_TOKEN and NEXT_PUBLIC_TMDB_API_KEY for Vercel compatibility
    const TMDB_TOKEN = process.env.TMDB_TOKEN || process.env.NEXT_PUBLIC_TMDB_API_KEY;
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    if (!TMDB_TOKEN) {
        console.error("TMDB API Key is missing! Please set TMDB_TOKEN or NEXT_PUBLIC_TMDB_API_KEY in environment variables.");
        throw new Error("API configuration missing");
    }

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_TOKEN);
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    try {
        const response = await fetch(url.toString(), {
            next: { revalidate: 3600 } // Cache for 1 hour
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`TMDB API Error (${response.status}): ${errorText}`);
            throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
        }

        return response.json();
    } catch (error: any) {
        console.error("Fetch TMDB failed:", error.message);
        throw error;
    }
}
