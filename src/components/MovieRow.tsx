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
        <div className="space-y-2 md:space-y-4 px-4 md:px-12 my-8 group">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-100 transition duration-200 hover:text-white cursor-pointer ml-2">
                {title}
            </h2>

            <div className="relative group/row">
                <ChevronLeft
                    className="absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover/row:opacity-100 text-white bg-black/30 rounded-full p-2"
                    onClick={() => scroll('left')}
                />

                <div
                    ref={rowRef}
                    className="flex items-center space-x-0.5 overflow-x-scroll scrollbar-hide md:space-x-2.5"
                >
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} onClick={onMovieClick} />
                    ))}
                </div>

                <ChevronRight
                    className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover/row:opacity-100 text-white bg-black/30 rounded-full p-2"
                    onClick={() => scroll('right')}
                />
            </div>
        </div>
    );
}
