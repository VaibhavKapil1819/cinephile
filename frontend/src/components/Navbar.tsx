"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, User as UserIcon, Menu, X, LogOut, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { searchVideos, Video } from '@/lib/api';
import Image from 'next/image';

export default function Navbar() {
    const { user, logout } = useAuth();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<Video[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (searchQuery.length < 2) {
            setSearchResults([]);
            return;
        }
        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            const results = await searchVideos(searchQuery);
            setSearchResults(results);
            setIsSearching(false);
        }, 500);
        return () => clearTimeout(delayDebounce);
    }, [searchQuery]);

    return (
        <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-4 py-4 md:px-12 flex items-center justify-between ${isScrolled ? 'glass py-3 border-b border-white/5' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'}`}>
            <div className="flex items-center gap-4 md:gap-12">
                <div className="flex items-center gap-3">
                    <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                    <Link href="/">
                        <h1 className="text-primary font-black text-2xl md:text-3xl tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(229,9,20,0.5)] cursor-pointer">Cinephile</h1>
                    </Link>
                </div>
                <div className="hidden md:flex gap-8 text-[13px] font-bold text-gray-400 uppercase tracking-widest">
                    <Link href="/" className="text-white hover:text-primary transition-all">Home</Link>
                    <a href="#" className="hover:text-white transition-all">Movies</a>
                    <a href="#" className="hover:text-white transition-all">Trending</a>
                    <a href="#" className="hover:text-white transition-all">My List</a>
                </div>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <div className="relative group/search">
                    <div className="flex items-center">
                        <input
                            type="text"
                            placeholder="Search gems..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs w-9 md:w-12 group-hover/search:w-48 md:group-hover/search:w-64 focus:w-48 md:focus:w-64 transition-all duration-500 outline-none focus:border-primary/50 focus:bg-white/10"
                        />
                        <Search className="w-4 h-4 md:w-5 md:h-5 text-gray-400 group-focus-within/search:text-primary transition-colors absolute left-3 pointer-events-none" />
                    </div>

                    {searchQuery.length >= 2 && (
                        <div className="absolute top-full right-0 mt-4 w-[calc(100vw-2rem)] md:w-[450px] glass rounded-3xl border border-white/10 p-4 space-y-3 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300">
                            {isSearching ? (
                                <div className="flex items-center justify-center py-12">
                                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                </div>
                            ) : searchResults.length > 0 ? (
                                searchResults.map(video => (
                                    <Link key={video.id} href={`/watch/${video.id}`} className="flex gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5">
                                        <div className="w-24 md:w-32 aspect-video rounded-xl overflow-hidden relative flex-none shadow-lg">
                                            {/* Fallback to simple img if next/image is strict */}
                                            <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex flex-col justify-center min-w-0">
                                            <h4 className="font-bold text-sm md:text-base text-white truncate group-hover/item:text-primary transition-colors">{video.title}</h4>
                                            <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{video.category} • {video.duration}</p>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <div className="py-12 text-center text-gray-500">No results found</div>
                            )}
                        </div>
                    )}
                </div>

                {user ? (
                    <div className="relative">
                        <button
                            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary/40 to-primary/10 border border-primary/30 flex items-center justify-center cursor-pointer hover:scale-110 active:scale-95 transition-all overflow-hidden shadow-lg"
                        >
                            <span className="font-black text-white italic">{user.displayName.charAt(0).toUpperCase()}</span>
                        </button>
                        {isUserMenuOpen && (
                            <div className="absolute top-full right-0 mt-4 w-56 glass rounded-[2rem] border border-white/10 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-5 py-4 border-b border-white/5 mb-1">
                                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest">Active Profile</p>
                                    <p className="text-base text-white font-black truncate italic mt-1">{user.displayName}</p>
                                </div>
                                <div className="p-1 space-y-1">
                                    <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/10 hover:bg-primary transition-all text-sm font-bold text-primary hover:text-white group">
                                        <LogOut className="w-4 h-4" /> Sign Out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link href="/login" className="px-6 py-2 bg-primary text-white text-xs font-black uppercase italic tracking-tighter rounded-full hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)]">
                        Sign In
                    </Link>
                )}
            </div>

            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-[90] glass animate-in fade-in duration-300">
                    <div className="flex flex-col items-center justify-center h-full gap-8">
                        {['Home', 'Movies', 'Trending', 'My List'].map((item) => (
                            <Link key={item} href="/" className="text-4xl font-black italic uppercase text-white hover:text-primary transition-all tracking-tighter" onClick={() => setIsMobileMenuOpen(false)}>
                                {item}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    );
}
