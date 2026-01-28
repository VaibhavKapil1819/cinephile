"use client";

import React from 'react';
import { Play, Plus, ThumbsUp } from 'lucide-react';
import { Video } from '@/lib/api';

interface VideoCardProps {
    video: Video;
    onClick?: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
    return (
        <div
            className="video-card flex-none w-40 md:w-64 aspect-video rounded-lg overflow-hidden relative group cursor-pointer border border-white/5"
            onClick={onClick}
        >
            <img
                src={video.thumbnailUrl}
                alt={video.title}
                className="w-full h-full object-cover"
                loading="lazy"
            />

            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h4 className="font-bold text-sm md:text-base mb-1 line-clamp-1">{video.title}</h4>
                    <p className="text-xs text-gray-300 mb-2">{video.duration} • {video.category}</p>

                    <div className="flex items-center gap-2">
                        <button className="w-8 h-8 rounded-full bg-white flex items-center justify-center hover:bg-gray-200 transition">
                            <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                        </button>
                        <button className="w-8 h-8 rounded-full border-2 border-white/40 glass flex items-center justify-center hover:border-white transition">
                            <Plus className="w-4 h-4" />
                        </button>
                        <button className="w-8 h-8 rounded-full border-2 border-white/40 glass flex items-center justify-center hover:border-white transition">
                            <ThumbsUp className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Trending Badge */}
            {video.trending && (
                <div className="absolute top-2 left-2 px-2 py-1 bg-primary rounded text-xs font-bold shadow-lg animate-glow-pulse">
                    TRENDING
                </div>
            )}
        </div>
    );
}
