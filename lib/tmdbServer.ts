export async function fetchTMDB(endpoint: string, params: Record<string, string> = {}) {
    const TMDB_TOKEN = process.env.TMDB_TOKEN;
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', TMDB_TOKEN || '');
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

    const response = await fetch(url.toString(), {
        next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
        throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.json();
}
