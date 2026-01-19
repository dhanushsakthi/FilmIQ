"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import TrailerModal from '@/components/TrailerModal';
import { getTrendingMovies, getTopRatedMovies, getNowPlayingMovies, searchMovies, Movie, getImageUrl } from '@/lib/tmdb';

export default function Home() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [trending, setTrending] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Initial Fetch
        const fetchData = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const [trend, top, now] = await Promise.all([
                    getTrendingMovies(),
                    getTopRatedMovies(),
                    getNowPlayingMovies()
                ]);
                setTrending(trend);
                setTopRated(top);
                setNowPlaying(now);
            } catch (err) {
                console.error("Failed to fetch initial data", err);
                setError("Failed to load movies. Please check your connection.");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Process Search
        if (searchQuery) {
            const performSearch = async () => {
                setError(null);
                try {
                    const results = await searchMovies(searchQuery);
                    setSearchResults(results);
                } catch (err) {
                    console.error("Search failed", err);
                    setError("Search failed. Please try again.");
                }
            };
            performSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovieId(movie.id);
    };

    if (error && !trending.length && !searchResults.length) {
        return (
            <div className="min-h-screen bg-[#141414] flex flex-col items-center justify-center text-white">
                <p className="text-xl mb-4">{error}</p>
                <button onClick={() => window.location.reload()} className="px-6 py-2 bg-red-600 rounded hover:bg-red-700 transition">
                    Retry
                </button>
            </div>
        );
    }

    return (
        <main className="relative bg-[#141414] min-h-screen pb-20">
            {/* If there is a search active, show search results at top */}
            {searchQuery && searchResults.length > 0 ? (
                <div className="pt-24 px-4 md:px-12">
                    <h2 className="text-2xl text-white mb-6">Search Results for "{searchQuery}"</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {searchResults.map(movie => (
                            <div key={movie.id} onClick={() => handleMovieClick(movie)} className="cursor-pointer transition hover:scale-105">
                                <img
                                    src={getImageUrl(movie.poster_path, 'w500')}
                                    alt={movie.title}
                                    className="rounded-md w-full aspect-[2/3] object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ) : (

                <>
                    <Hero movies={trending} onPlayClick={handleMovieClick} />
                    <div className="relative z-20 -mt-10 md:-mt-32 space-y-4">
                        <MovieRow title="Trending Now" movies={trending} onMovieClick={handleMovieClick} />
                        <MovieRow title="Top Rated" movies={topRated} onMovieClick={handleMovieClick} />
                        <MovieRow title="Recently Released" movies={nowPlaying} onMovieClick={handleMovieClick} />
                    </div>
                </>
            )}

            {selectedMovieId && (
                <TrailerModal movieId={selectedMovieId} onClose={() => setSelectedMovieId(null)} />
            )}
        </main>
    )
}
