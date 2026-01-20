"use client";

import { useRef } from 'react';
import { Movie } from '@/lib/tmdb';
import MovieCard from './MovieCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MovieRowProps {
    title: string;
    movies: Movie[];
    onMovieClick: (movie: Movie) => void;
}

export default function MovieRow({ title, movies, onMovieClick }: MovieRowProps) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const { scrollLeft, clientWidth } = rowRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col space-y-4 px-4 md:px-8 my-10 group/row-parent">
            {/* Header: Title and Arrows */}
            <div className="flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                    {title}
                </h2>
                <div className="flex items-center space-x-2 opacity-0 group-hover/row-parent:opacity-100 transition-opacity duration-300">
                    <button
                        onClick={() => scroll('left')}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5 text-white" />
                    </button>
                    <button
                        onClick={() => scroll('right')}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ChevronRight className="w-5 h-5 text-white" />
                    </button>
                </div>
            </div>

            {/* Row Content */}
            <div className="relative">
                <div
                    ref={rowRef}
                    className="flex items-center space-x-4 overflow-x-auto scrollbar-hide pb-4 snap-x"
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="flex-shrink-0 snap-start">
                            <MovieCard movie={movie} onClick={onMovieClick} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
