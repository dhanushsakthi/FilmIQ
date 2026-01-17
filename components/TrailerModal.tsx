"use client";

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import ReactPlayer from 'react-player/youtube';
import { getMovieVideos } from '@/lib/tmdb';
import { motion, AnimatePresence } from 'framer-motion';

interface TrailerModalProps {
    movieId: number | null;
    onClose: () => void;
}

export default function TrailerModal({ movieId, onClose }: TrailerModalProps) {
    const [trailerKey, setTrailerKey] = useState<string | null>(null);

    useEffect(() => {
        const fetchTrailer = async () => {
            if (movieId) {
                try {
                    const videos = await getMovieVideos(movieId);
                    const trailer = videos.find((v: any) => v.type === "Trailer" && v.site === "YouTube");
                    if (trailer) {
                        setTrailerKey(trailer.key);
                    } else if (videos.length > 0) {
                        setTrailerKey(videos[0].key); // Fallback to any video
                    }
                } catch (err) {
                    console.error("Failed to fetch trailer", err);
                }
            }
        };

        fetchTrailer();
    }, [movieId]);

    if (!movieId) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full hover:bg-white/20 text-white transition"
                    >
                        <X className="w-6 h-6" />
                    </button>

                    {trailerKey ? (
                        <ReactPlayer
                            url={`https://www.youtube.com/watch?v=${trailerKey}`}
                            width="100%"
                            height="100%"
                            playing={true}
                            controls={true}
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-white">
                            <p>No trailer available</p>
                        </div>
                    )}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
