"use client";

import { useState, useEffect, useRef } from 'react';
import { Search, Mic, Bell, User } from 'lucide-react';
import Link from 'next/link';
import { processVoiceQuery } from '@/lib/gemini';
import { useRouter } from 'next/navigation';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [isListening, setIsListening] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setIsScrolled(true);
            } else {
                setIsScrolled(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchInput.trim()) {
            // In a real app we might route to a search page, 
            // passing query params. For now we will just emit an event or 
            // assume the Home page reads this from URL? 
            // For simplicity let's use a query param
            router.push(`/?search=${encodeURIComponent(searchInput)}`);
        }
    };

    const startVoiceSearch = () => {
        if (!('webkitSpeechRecognition' in window)) {
            alert("Voice search not supported in this browser. Try Chrome.");
            return;
        }

        const SpeechRecognition = (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.lang = 'en-US';
        recognition.interimResults = false;

        setIsListening(true);
        recognition.start();

        recognition.onresult = async (event: any) => {
            const transcript = event.results[0][0].transcript;
            console.log("Heard:", transcript);
            setIsListening(false);
            const refinedQuery = await processVoiceQuery(transcript);
            setSearchInput(refinedQuery);
            router.push(`/?search=${encodeURIComponent(refinedQuery)}`);
        };

        recognition.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        }
    };

    return (
        <header className={`fixed top-0 w-full z-50 transition-all duration-500 ease-in-out ${isScrolled ? "bg-[#141414]" : "bg-gradient-to-b from-black/80 to-transparent"}`}>
            <div className="flex items-center justify-between px-4 md:px-10 py-4">
                {/* Left: Logo */}
                <div className="flex items-center space-x-8">
                    <Link href="/" className="text-red-600 font-bold text-3xl tracking-tighter cursor-pointer">
                        FILMIQ
                    </Link>
                    <ul className="hidden md:flex space-x-4 text-sm font-light text-[#e5e5e5]">
                        <li className="hover:text-gray-300 cursor-pointer transition">Home</li>
                        <li className="hover:text-gray-300 cursor-pointer transition">Series</li>
                        <li className="hover:text-gray-300 cursor-pointer transition">Films</li>
                        <li className="hover:text-gray-300 cursor-pointer transition">New & Popular</li>
                    </ul>
                </div>

                {/* Right: Search & Profile */}
                <div className="flex items-center space-x-4">
                    <form onSubmit={handleSearchSubmit} className={`flex items-center bg-black/50 border border-white/30 rounded-full px-3 py-1 transition-all ${isListening ? 'border-red-500 ring-red-500 ring-1' : ''}`}>
                        <Search className="w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder={isListening ? "Listening..." : "Search..."}
                            className="bg-transparent border-none focus:outline-none text-white text-sm ml-2 w-24 md:w-64"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <button type="button" onClick={startVoiceSearch} className="ml-2 hover:bg-white/10 rounded-full p-1 transition">
                            <Mic className={`w-4 h-4 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                        </button>
                    </form>

                    <div className="hidden md:flex items-center space-x-4 text-sm font-light">
                        <span className="text-gray-300">Developed by S. DHANUSH</span>
                        <Bell className="w-5 h-5 text-white cursor-pointer" />
                        <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center cursor-pointer">
                            <User className="text-white w-5 h-5" />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}
