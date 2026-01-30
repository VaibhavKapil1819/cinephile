"use client";

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell, User as UserIcon, Loader2, LogOut, Menu, X, ChevronRight, Sparkles } from 'lucide-react';
import { fetchHomeFeed, searchVideos, Video } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';

const CATEGORIES = [
  { title: "Sci-Fi Hits", type: "Sci-Fi" },
  { title: "High Octane Action", type: "Action" },
  { title: "Grimy Crime Dramas", type: "Crime" },
  { title: "All Masterpieces", type: "" }
];

export default function Home() {
  const { user, token, logout } = useAuth();
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';
  const [isScrolled, setIsScrolled] = useState(false);
  const [videoSections, setVideoSections] = useState<Record<string, Video[]>>({});
  const [watchHistory, setWatchHistory] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const loadAllContent = async () => {
      try {
        const sections: Record<string, Video[]> = {};

        const results = await Promise.all(
          CATEGORIES.map(cat => fetchHomeFeed(cat.type))
        );

        CATEGORIES.forEach((cat, i) => {
          sections[cat.type || 'all'] = results[i];
        });

        setVideoSections(sections);
      } catch (error) {
        console.error("Failed to load feed", error);
      } finally {
        setIsLoading(false);
      }
    };

    const loadHistory = async () => {
      if (!token) return;
      try {
        const historyResponse = await fetch(`${API_BASE_URL}/user/watch-history?limit=10`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (historyResponse.ok) {
          const history = await historyResponse.json();
          setWatchHistory(history);
        }
      } catch (error) {
        console.error("Failed to load history", error);
      }
    };

    if (token) {
      loadHistory();
    }
    loadAllContent();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [token]);

  useEffect(() => {
    if (searchQuery.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchVideos(searchQuery);
      setSearchResults(results);
      setIsSearching(false);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const allVideos = Object.values(videoSections).flat();
  const heroVideo = allVideos.length > 0 ? allVideos[0] : null;

  return (
    <main className="relative bg-[#050505] min-h-screen selection:bg-primary/30">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-[100] transition-all duration-700 px-4 py-4 md:px-12 flex items-center justify-between ${isScrolled ? 'glass py-3 border-b border-white/5' : 'bg-gradient-to-b from-black/90 via-black/40 to-transparent'}`}>
        <div className="flex items-center gap-4 md:gap-12">
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <h1 className="text-primary font-black text-2xl md:text-3xl tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(229,9,20,0.5)] cursor-pointer">Cinephile</h1>
          </div>
          <div className="hidden md:flex gap-8 text-[13px] font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="text-white hover:text-primary transition-all relative group">
              Home
              <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary scale-x-100 transition-transform origin-left" />
            </a>
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

            {/* Search Results Dropdown */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full right-0 mt-4 w-[calc(100vw-2rem)] md:w-[450px] glass rounded-3xl border border-white/10 p-4 space-y-3 max-h-[70vh] overflow-y-auto no-scrollbar shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-in fade-in slide-in-from-top-4 duration-300">
                {isSearching ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(video => (
                    <Link
                      key={video.id}
                      href={`/watch/${video.id}`}
                      className="flex gap-4 p-2 rounded-2xl hover:bg-white/5 transition-all group/item border border-transparent hover:border-white/5"
                    >
                      <div className="w-24 md:w-32 aspect-video rounded-xl overflow-hidden relative flex-none shadow-lg">
                        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-sm md:text-base text-white truncate group-hover/item:text-primary transition-colors">{video.title}</h4>
                        <p className="text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{video.category} • {video.duration}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-2">
                    <p className="text-gray-400 font-medium">No results found for</p>
                    <p className="text-white font-black italic">"{searchQuery}"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="hidden sm:block">
            <Bell className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
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
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-white/5 transition-all text-sm font-bold text-gray-300 hover:text-white">
                      <UserIcon className="w-4 h-4" /> Account Settings
                    </button>
                    <button
                      onClick={() => { logout(); setIsUserMenuOpen(false); }}
                      className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl bg-primary/10 hover:bg-primary transition-all text-sm font-bold text-primary hover:text-white group"
                    >
                      <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> Sign Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="px-6 py-2 bg-primary text-white text-xs font-black uppercase italic tracking-tighter rounded-full hover:bg-primary-hover transition-all shadow-[0_0_20px_rgba(229,9,20,0.4)] hover:scale-105 active:scale-95"
            >
              Sign In
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[90] glass animate-in fade-in duration-300">
          <div className="flex flex-col items-center justify-center h-full gap-8">
            {['Home', 'Movies', 'Trending', 'My List'].map((item) => (
              <a
                key={item}
                href="#"
                className="text-4xl font-black italic uppercase text-white hover:text-primary transition-all tracking-tighter"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative h-[80vh] md:h-[90vh] w-full overflow-hidden">
        {heroVideo ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroVideo.thumbnailUrl}
                alt={heroVideo.title}
                fill
                priority
                className="object-cover brightness-[0.5] scale-105 animate-pulse-slow"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/40 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-transparent to-transparent hidden md:block" />
            </div>

            <div className="absolute bottom-[10%] md:bottom-[20%] left-4 md:left-12 max-w-[90%] md:max-w-3xl space-y-4 md:space-y-8 animate-in slide-in-from-left-12 fade-in duration-1000">
              <div className="space-y-2 md:space-y-4">
                {heroVideo.trending && (
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full animate-glow-pulse shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                      <Sparkles className="w-3 h-3" /> Trending Now
                    </span>
                  </div>
                )}
                <h2 className="text-5xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] drop-shadow-2xl">{heroVideo.title}</h2>
              </div>
              <p className="text-sm md:text-xl text-gray-300 line-clamp-2 md:line-clamp-3 font-medium max-w-2xl leading-relaxed drop-shadow-md">{heroVideo.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-5 pt-4">
                <Link
                  href={`/watch/${heroVideo.id}`}
                  className="flex items-center justify-center gap-3 px-12 py-4 md:py-5 bg-white text-black rounded-2xl font-black uppercase italic tracking-tighter hover:bg-gray-200 transition-all hover:scale-105 active:scale-95 shadow-xl"
                >
                  <Play className="fill-black w-5 h-5 md:w-6 md:h-6" /> Play Now
                </Link>
                <button className="flex items-center justify-center gap-3 px-12 py-4 md:py-5 bg-white/10 text-white rounded-2xl font-black uppercase italic tracking-tighter glass border border-white/10 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                  <Info className="w-5 h-5 md:w-6 md:h-6" /> View Details
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-surface gap-6">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] animate-pulse">Loading Spotlight...</p>
          </div>
        )}
      </section>

      {/* Content Container */}
      <div className="relative z-20 -mt-24 md:-mt-48 space-y-16 md:space-y-32 pb-32">
        {/* Continue Watching Section */}
        {user && watchHistory.length > 0 && (
          <section className="space-y-6 md:space-y-10 px-4 md:px-12 group/row">
            <div className="flex items-center justify-between">
              <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                <span className="w-2 h-8 md:h-12 bg-accent-cyan rounded-full shadow-[0_0_20px_#00E5FF]" />
                Resume Your Journey
              </h3>
              <button className="text-[10px] md:text-xs font-black uppercase tracking-widest text-accent-cyan hover:underline underline-offset-8">History <ChevronRight className="inline w-3 h-3" /></button>
            </div>
            <div className="flex gap-4 md:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth p-2">
              {watchHistory.map((video, vIdx) => (
                <Link
                  key={`history-${video.id}-${vIdx}`}
                  href={`/watch/${video.id}`}
                  className="flex-none w-56 md:w-80 aspect-video rounded-2xl md:rounded-[2rem] overflow-hidden relative group/card cursor-pointer border border-white/5 hover:border-accent-cyan/50 transition-all duration-500 shadow-xl hover:shadow-accent-cyan/20"
                >
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-full bg-accent-cyan flex items-center justify-center shadow-[0_0_30px_#00E5FF]">
                      <Play className="fill-black ml-1 w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/10">
                    <div className="h-full bg-accent-cyan w-1/3 shadow-[0_0_15px_#00E5FF]" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Category Rows */}
        <section className="space-y-20 md:space-y-32">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-6">
              <Loader2 className="w-16 h-16 text-primary animate-spin opacity-20" />
            </div>
          ) : (
            CATEGORIES.map((cat, idx) => {
              const rowVideos = videoSections[cat.type || 'all'] || [];
              if (rowVideos.length === 0) return null;

              return (
                <div key={idx} className="space-y-6 md:space-y-10 px-4 md:px-12 group/row">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl md:text-3xl font-black text-white italic uppercase tracking-tighter flex items-center gap-4">
                      <span className="w-2 h-8 md:h-12 bg-primary rounded-full shadow-[0_0_20px_#E50914]" />
                      {cat.title}
                    </h3>
                    <a href="#" className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary hover:underline underline-offset-8">Explore All <ChevronRight className="inline w-3 h-3" /></a>
                  </div>

                  <div className="flex gap-4 md:gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth p-2">
                    {rowVideos.map((video, vIdx) => (
                      <Link
                        key={video.id + vIdx}
                        href={`/watch/${video.id}`}
                        className="video-card flex-none w-60 md:w-96 aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden relative group/card cursor-pointer border border-white/5 hover:border-primary/50 shadow-2xl transition-all duration-500"
                      >
                        <Image
                          src={video.thumbnailUrl}
                          alt={video.title}
                          fill
                          sizes="(max-width: 768px) 240px, 384px"
                          className="object-cover transition-transform duration-700 group-hover/card:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 backdrop-blur-none hover:backdrop-blur-[2px]">
                          <div className="transform translate-y-8 group-hover/card:translate-y-0 transition-transform duration-500 space-y-2">
                            <h4 className="font-black text-xl md:text-2xl italic uppercase tracking-tighter">{video.title}</h4>
                            <div className="flex items-center gap-4">
                              <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest">{video.duration}</span>
                              <span className="text-[10px] px-2 py-0.5 border border-white/20 rounded-full text-gray-300 font-bold uppercase tracking-wider">{video.category}</span>
                            </div>
                          </div>
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover/card:opacity-100 scale-50 group-hover/card:scale-100 transition-all duration-500 shadow-[0_0_40px_rgba(229,9,20,0.8)]">
                            <Play className="fill-white ml-1 w-8 h-8 md:w-10 md:h-10" />
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </section>
      </div>

      {/* Footer Branding */}
      <footer className="py-32 border-t border-white/5 flex flex-col items-center gap-6 overflow-hidden relative">
        <div className="absolute inset-0 bg-primary/5 blur-[100px] -z-10" />
        <h1 className="text-white/5 font-black text-9xl md:text-[15rem] tracking-tighter uppercase italic select-none animate-pulse">Cinephile</h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-gray-400 text-[10px] md:text-xs font-black uppercase tracking-[0.5em] italic">Spotlight on Pure Cinema</p>
          <p className="text-gray-700 text-[8px] md:text-[10px] font-bold uppercase tracking-widest">&copy; 2026 Cinephile Engine. All Rights Reserved.</p>
        </div>
      </footer>
    </main>
  );
}

