import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

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

export const getTrendingMovies = async (): Promise<Movie[]> => {
    const response = await tmdbClient.get('/trending/movie/week');
    return response.data.results;
};

export const getTopRatedMovies = async (): Promise<Movie[]> => {
    const response = await tmdbClient.get('/movie/top_rated');
    return response.data.results;
};

export const getNowPlayingMovies = async (): Promise<Movie[]> => {
    const response = await tmdbClient.get('/movie/now_playing');
    return response.data.results;
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
    const response = await tmdbClient.get('/search/movie', {
        params: {
            query: query
        }
    });
    return response.data.results;
};

export const getMovieVideos = async (movieId: number) => {
    const response = await tmdbClient.get(`/movie/${movieId}/videos`);
    return response.data.results;
}

export const getImageUrl = (path: string, size: 'original' | 'w500' = 'original') => {
    if (!path) return '';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
