// TMDB API Client for Chrome Extension

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Get API key from Chrome storage
async function getTMDBApiKey() {
    return new Promise((resolve) => {
        chrome.storage.sync.get(['tmdbApiKey'], (result) => {
            resolve(result.tmdbApiKey || '5f1fcfe4e92b652f168f5ca0025d91f9');
        });
    });
}

async function tmdbRequest(endpoint, params = {}) {
    const apiKey = await getTMDBApiKey();
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);
    url.searchParams.append('api_key', apiKey);

    Object.keys(params).forEach(key => {
        url.searchParams.append(key, params[key]);
    });

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`TMDB API Error: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('TMDB Request Error:', error);
        throw error;
    }
}

async function getTrendingMovies() {
    const data = await tmdbRequest('/trending/movie/week');
    return data.results || [];
}

async function getTopRatedMovies() {
    const data = await tmdbRequest('/movie/top_rated');
    return data.results || [];
}

async function getNowPlayingMovies() {
    const data = await tmdbRequest('/movie/now_playing');
    return data.results || [];
}

async function searchMovies(query) {
    const data = await tmdbRequest('/search/movie', { query });
    return data.results || [];
}

async function getMovieVideos(movieId) {
    const data = await tmdbRequest(`/movie/${movieId}/videos`);
    return data.results || [];
}

function getImageUrl(path, size = 'original') {
    if (!path) return 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
    return `https://image.tmdb.org/t/p/${size}${path}`;
}
