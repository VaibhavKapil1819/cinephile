"use client";

import React from 'react';
import { Play, Plus, ThumbsUp, Sparkles } from 'lucide-react';
import { Video } from '@/lib/api';
import Link from 'next/link';

interface VideoCardProps {
    video: Video;
    onClick?: () => void;
}

export default function VideoCard({ video }: VideoCardProps) {
    return (
        <Link
            href={`/watch/${video.id}`}
            className="video-card flex-none w-60 md:w-96 aspect-video rounded-3xl md:rounded-[2.5rem] overflow-hidden relative group/card cursor-pointer border border-white/5 hover:border-primary/50 shadow-2xl transition-all duration-500"
        >
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110"
                loading="lazy"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-all duration-500 flex flex-col justify-end p-6 md:p-8 backdrop-blur-none hover:backdrop-blur-[2px]">
                <div className="transform translate-y-8 group-hover/card:translate-y-0 transition-transform duration-500 space-y-2">
                    <h4 className="font-black text-xl md:text-2xl italic uppercase tracking-tighter">{video.title}</h4>
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] md:text-xs text-primary font-black uppercase tracking-widest">{video.duration}</span>
                        <span className="text-[10px] px-2 py-0.5 border border-white/20 rounded-full text-gray-300 font-bold uppercase tracking-wider">{video.category}</span>
                    </div>

                    <div className="flex items-center gap-3 mt-4 opacity-0 group-hover/card:opacity-100 transition-opacity delay-100">
                        <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-all text-black">
                            <Plus className="w-5 h-5" />
                        </button>
                        <button className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all">
                            <ThumbsUp className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover/card:opacity-100 scale-50 group-hover/card:scale-100 transition-all duration-500 shadow-[0_0_40px_rgba(229,9,20,0.8)]">
                    <Play className="fill-white ml-1 w-8 h-8 md:w-10 md:h-10" />
                </div>

                {video.trending && (
                    <div className="absolute top-6 right-6 flex items-center gap-1.5 px-3 py-1 bg-primary text-[10px] font-black uppercase tracking-[0.2em] rounded-full animate-glow-pulse shadow-[0_0_15px_rgba(229,9,20,0.5)]">
                        <Sparkles className="w-3 h-3" /> Trending
                    </div>
                )}
            </div>
        </Link>
    );
}
