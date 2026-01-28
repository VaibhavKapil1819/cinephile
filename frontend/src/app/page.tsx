"use client";

import React, { useState, useEffect } from 'react';
import { Play, Info, Search, Bell, User, Loader2 } from 'lucide-react';
import { fetchHomeFeed, searchVideos, Video } from '@/lib/api';
import Link from 'next/link';
import Image from 'next/image';

const CATEGORIES = [
  { title: "Sci-Fi Hits", type: "Sci-Fi" },
  { title: "High Octane Action", type: "Action" },
  { title: "Grimy Crime Dramas", type: "Crime" },
  { title: "All Masterpieces", type: "" }
];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [videoSections, setVideoSections] = useState<Record<string, Video[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Video[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);

    const loadAllContent = async () => {
      try {
        const sections: Record<string, Video[]> = {};

        // Fetch videos for each category in parallel for performance
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

    loadAllContent();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <main className="relative bg-background min-h-screen">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 py-4 md:px-12 flex items-center justify-between ${isScrolled ? 'glass py-3' : 'bg-gradient-to-b from-black/80 to-transparent'}`}>
        <div className="flex items-center gap-8">
          <h1 className="text-primary font-black text-2xl tracking-tighter uppercase italic drop-shadow-[0_0_15px_rgba(229,9,20,0.5)]">Cinephile</h1>
          <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
            <a href="#" className="hover:text-white transition-colors">Home</a>
            <a href="#" className="hover:text-white transition-colors">Movies</a>
            <a href="#" className="hover:text-white transition-colors">New & Popular</a>
          </div>
        </div>
        <div className="flex items-center gap-5 text-gray-300">
          <div className="relative group/search">
            <Search className="w-5 h-5 cursor-pointer hover:text-white transition-colors absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none z-10" />
            <input
              type="text"
              placeholder="Search cinematic gems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm w-0 group-hover/search:w-64 focus:w-64 transition-all duration-500 glass outline-none focus:border-primary/50"
            />

            {/* Search Results Dropdown */}
            {searchQuery.length >= 2 && (
              <div className="absolute top-full right-0 mt-4 w-[400px] glass rounded-xl border border-white/10 p-2 space-y-2 max-h-[70vh] overflow-y-auto no-scrollbar shadow-2xl animate-in fade-in slide-in-from-top-4 duration-300">
                {isSearching ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 text-primary animate-spin" />
                  </div>
                ) : searchResults.length > 0 ? (
                  searchResults.map(video => (
                    <Link
                      key={video.id}
                      href={`/watch/${video.id}`}
                      className="flex gap-4 p-2 rounded-lg hover:bg-white/5 transition-colors group/item"
                    >
                      <div className="w-24 aspect-video rounded-md overflow-hidden relative flex-none">
                        <Image src={video.thumbnailUrl} alt={video.title} fill className="object-cover" />
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <h4 className="font-bold text-sm text-white truncate group-hover/item:text-primary transition-colors">{video.title}</h4>
                        <p className="text-xs text-gray-400 capitalize">{video.category} • {video.duration}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 py-4 text-center font-medium italic">No matches found for "{searchQuery}"</p>
                )}
              </div>
            )}
          </div>
          <Bell className="w-5 h-5 cursor-pointer hover:text-white transition-colors" />
          <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
            <User className="w-5 h-5 text-primary" />
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[85vh] w-full overflow-hidden">
        {heroVideo ? (
          <>
            <div className="absolute inset-0">
              <Image
                src={heroVideo.thumbnailUrl}
                alt={heroVideo.title}
                fill
                priority
                className="object-cover brightness-[0.6] scale-105 animate-pulse-slow"
              />
              <div className="absolute inset-0 bg-hero-gradient" />
            </div>

            <div className="absolute bottom-[15%] left-4 md:left-12 max-w-2xl space-y-6">
              <div className="space-y-2">
                {heroVideo.trending && (
                  <span className="inline-block px-2 py-1 bg-primary text-[10px] font-bold uppercase tracking-widest rounded animate-glow-pulse">Trending Now</span>
                )}
                <h2 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic">{heroVideo.title}</h2>
              </div>
              <p className="text-lg md:text-xl text-gray-200 line-clamp-3 font-medium max-w-xl drop-shadow-md">{heroVideo.description}</p>
              <div className="flex gap-4 pt-4">
                <Link
                  href={`/watch/${heroVideo.id}`}
                  className="flex items-center gap-3 px-10 py-4 bg-white text-black rounded-md font-bold hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="fill-black w-6 h-6" /> Play Now
                </Link>
                <button className="flex items-center gap-3 px-10 py-4 bg-gray-500/30 text-white rounded-md font-bold glass hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                  <Info className="w-6 h-6" /> More Info
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-surface">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
          </div>
        )}
      </section>

      {/* Category Rows */}
      <section className="relative z-10 -mt-32 space-y-16 pb-24 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : (
          CATEGORIES.map((cat, idx) => {
            const rowVideos = videoSections[cat.type || 'all'] || [];
            if (rowVideos.length === 0) return null;

            return (
              <div key={idx} className="space-y-6 px-4 md:px-12 group/row">
                <div className="flex items-end justify-between">
                  <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                    <span className="w-1.5 h-8 bg-primary rounded-full shadow-[0_0_15px_#E50914]" />
                    {cat.title}
                  </h3>
                  <a href="#" className="text-sm font-semibold text-primary opacity-0 group-hover/row:opacity-100 transition-opacity hover:underline">Explore All</a>
                </div>

                <div className="flex gap-4 overflow-x-auto pb-8 no-scrollbar scroll-smooth">
                  {rowVideos.map((video, vIdx) => (
                    <Link
                      key={video.id + vIdx}
                      href={`/watch/${video.id}`}
                      className="video-card flex-none w-44 md:w-72 aspect-video rounded-xl overflow-hidden relative group/card cursor-pointer border border-white/10 hover:border-primary/50"
                    >
                      <Image
                        src={video.thumbnailUrl}
                        alt={video.title}
                        fill
                        sizes="(max-width: 768px) 176px, 288px"
                        className="object-cover transition-transform duration-500 group-hover/card:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-300 flex flex-col justify-end p-4">
                        <h4 className="font-bold text-lg translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300">{video.title}</h4>
                        <div className="flex items-center gap-3 mt-2 translate-y-4 group-hover/card:translate-y-0 transition-transform duration-300 delay-75">
                          <span className="text-xs text-primary font-bold">{video.duration}</span>
                          <span className="text-[10px] px-1.5 py-0.5 border border-gray-500 rounded text-gray-400 capitalize">{video.category}</span>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover/card:opacity-100 scale-75 group-hover/card:scale-100 transition-all duration-300 shadow-[0_0_20px_rgba(229,9,20,0.6)]">
                          <Play className="fill-white ml-1 w-6 h-6" />
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

      {/* Footer Branding */}
      <footer className="py-20 border-t border-white/5 flex flex-col items-center gap-4">
        <h1 className="text-primary/20 font-black text-6xl tracking-tighter uppercase italic select-none">Cinephile</h1>
        <p className="text-gray-500 text-sm font-medium">Spotlight on Pure Cinema &copy; 2026</p>
      </footer>
    </main>
  );
}

