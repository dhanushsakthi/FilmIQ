"use client";

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Hero from '@/components/Hero';
import MovieRow from '@/components/MovieRow';
import TrailerModal from '@/components/TrailerModal';
import { getTrendingMovies, getTopRatedMovies, getNowPlayingMovies, searchMovies, Movie } from '@/lib/tmdb';

export default function Home() {
    const searchParams = useSearchParams();
    const searchQuery = searchParams.get('search');

    const [trending, setTrending] = useState<Movie[]>([]);
    const [topRated, setTopRated] = useState<Movie[]>([]);
    const [nowPlaying, setNowPlaying] = useState<Movie[]>([]);
    const [searchResults, setSearchResults] = useState<Movie[]>([]);
    const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);

    useEffect(() => {
        // Initial Fetch
        const fetchData = async () => {
            const [trend, top, now] = await Promise.all([
                getTrendingMovies(),
                getTopRatedMovies(),
                getNowPlayingMovies()
            ]);
            setTrending(trend);
            setTopRated(top);
            setNowPlaying(now);
        };
        fetchData();
    }, []);

    useEffect(() => {
        // Process Search
        if (searchQuery) {
            const performSearch = async () => {
                const results = await searchMovies(searchQuery);
                setSearchResults(results);
            };
            performSearch();
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovieId(movie.id);
    };

    return (
        <main className="relative bg-[#141414] min-h-screen pb-20">
            {/* If there is a search active, show search results at top */}
            {searchQuery && searchResults.length > 0 ? (
                <div className="pt-24 px-4 md:px-12">
                    <h2 className="text-2xl text-white mb-6">Search Results for "{searchQuery}"</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                        {searchResults.map(movie => (
                            <div key={movie.id} onClick={() => handleMovieClick(movie)} className="cursor-pointer transition hover:scale-105">
                                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} className="rounded-md" />
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
