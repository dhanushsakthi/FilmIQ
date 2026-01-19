const API_BASE_URL = '/api';

export interface Movie {
    id: number;
    title: string;
    original_title?: string;
    poster_path: string;
    backdrop_path: string;
    overview: string;
    release_date: string;
    vote_average: number;
    genre_ids?: number[];
}

const fetchInternal = async (endpoint: string) => {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        return data.results || [];
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        return [];
    }
};

export const getTrendingMovies = async (): Promise<Movie[]> => {
    return fetchInternal('/trending');
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
    return fetchInternal('/top-rated');
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
    return fetchInternal('/now-playing');
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    return fetchInternal(`/search?query=${encodeURIComponent(query)}`);
};

export const getMovieVideos = async (movieId: number) => {
    return fetchInternal(`/movie/${movieId}/videos`);
}

export const getImageUrl = (path: string, size: 'original' | 'w500' = 'original') => {
    if (!path) return 'https://images.unsplash.com/photo-1440404653325-ab127d49abc1?q=80&w=500&auto=format&fit=crop';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};

