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
        <nav className="w-[240px] w-60 flex-shrink-0 h-screen bg-black border-r border-white/10 flex flex-col items-flex-start p-6 z-50 relative">
            {/* Logo */}
            <Link href="/" className="text-red-600 font-bold text-3xl tracking-tighter cursor-pointer mb-10 block">
                FILMIQ
            </Link>

            {/* Search Input In Sidebar */}
            <form onSubmit={handleSearchSubmit} className={`w-full flex items-center bg-[#141414] border border-white/20 rounded-lg px-3 py-2 mb-8 transition-all ${isListening ? 'border-red-500 ring-1 ring-red-500' : 'hover:border-white/40'}`}>
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <input
                    type="text"
                    placeholder={isListening ? "Listening..." : "Search..."}
                    className="bg-transparent border-none focus:outline-none text-white text-sm ml-2 w-full"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                />
                <button type="button" onClick={startVoiceSearch} className="ml-1 hover:bg-white/10 rounded-full p-1 transition">
                    <Mic className={`w-3.5 h-3.5 ${isListening ? 'text-red-500 animate-pulse' : 'text-gray-400'}`} />
                </button>
            </form>

            {/* Navigation Items */}
            <div className="w-full flex-1">
                <ul className="flex flex-col space-y-6 text-sm font-medium text-gray-400 items-start">
                    <li className="hover:text-white cursor-pointer transition flex items-center space-x-3 text-white">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        <span className="font-bold">Home</span>
                    </li>
                    <li className="hover:text-white cursor-pointer transition pl-4">Series</li>
                    <li className="hover:text-white cursor-pointer transition pl-4">Films</li>
                    <li className="hover:text-white cursor-pointer transition pl-4">New & Popular</li>
                </ul>
            </div>

            {/* Bottom Profile/Info */}
            <div className="w-full pt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center cursor-pointer overflow-hidden flex-shrink-0">
                        <User className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col overflow-hidden">
                        <span className="text-xs font-bold text-white uppercase tracking-wider truncate">S. Dhanush</span>
                        <span className="text-[10px] text-gray-500">Sr. Developer</span>
                    </div>
                </div>
                <div className="flex items-center space-x-4 text-gray-500">
                    <Bell className="w-5 h-5 cursor-pointer hover:text-white transition" />
                </div>
            </div>
        </nav>
    )
}
