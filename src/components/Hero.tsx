"use client";

import { useEffect, useState } from 'react';
import { Movie, getImageUrl } from '@/lib/tmdb';
import { Info, Play } from 'lucide-react';

interface HeroProps {
    movies: Movie[];
    onPlayClick: (movie: Movie) => void;
}

export default function Hero({ movies, onPlayClick }: HeroProps) {
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [movie, setMovie] = useState<Movie | null>(null);

    useEffect(() => {
        if (movies && movies.length > 0) {
            setMovie(movies[currentMovieIndex]);
        }
    }, [movies, currentMovieIndex]);

    // Auto change background every 10 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (movies.length > 0) {
                setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
            }
        }, 10000);
        return () => clearInterval(interval);
    }, [movies]);

    if (!movie) return null;

    return (
        <div className="relative h-[56.25vw] md:h-[85vh] w-full flex flex-col justify-end pb-12 md:pb-24 pl-4 md:pl-12 text-white overflow-hidden transition-all duration-700">
            {/* Background Image */}
            <div className="absolute top-0 left-0 w-full h-full -z-10">
                <img
                    src={getImageUrl(movie.backdrop_path, 'original')}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-opacity duration-1000 ease-in-out"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-black/20" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414]/80 via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="z-10 max-w-2xl space-y-4 animate-fade-in">
                <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg text-balance">{movie.title || movie.original_title}</h1>

                <div className="flex items-center space-x-2 text-green-400 font-semibold mb-2">
                    <span>{Math.round(movie.vote_average * 10)}% Match</span>
                    <span className="text-gray-300 font-normal">{movie.release_date?.split('-')[0]}</span>
                </div>

                <p className="text-base md:text-lg text-shadow-md line-clamp-3 text-gray-100 max-w-lg">
                    {movie.overview}
                </p>

                <div className="flex space-x-3 pt-4">
                    <button
                        onClick={() => onPlayClick(movie)}
                        className="flex items-center space-x-2 bg-white text-black px-6 py-2 rounded font-bold hover:bg-opacity-80 transition"
                    >
                        <Play className="fill-black w-5 h-5" />
                        <span>Play Trailer</span>
                    </button>
                    <button className="flex items-center space-x-2 bg-gray-500/70 text-white px-6 py-2 rounded font-bold hover:bg-gray-500/50 transition">
                        <Info className="w-5 h-5" />
                        <span>More Info</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
