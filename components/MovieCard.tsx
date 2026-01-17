"use client";

import { Movie, getImageUrl } from '@/lib/tmdb';
import { motion } from 'framer-motion';

interface MovieCardProps {
    movie: Movie;
    onClick: (movie: Movie) => void;
}

export default function MovieCard({ movie, onClick }: MovieCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.05, zIndex: 10 }}
            className="relative min-w-[160px] md:min-w-[200px] h-[240px] md:h-[300px] cursor-pointer rounded-md overflow-hidden mr-2 md:mr-4"
            onClick={() => onClick(movie)}
        >
            <img
                src={getImageUrl(movie.poster_path, 'w500')}
                alt={movie.title}
                className="w-full h-full object-cover rounded-md"
                loading="lazy"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors" />
        </motion.div>
    );
}
