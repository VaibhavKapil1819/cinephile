"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Maximize, Play, Pause, Volume2, Settings } from 'lucide-react';
import Hls from 'hls.js';
import { fetchVideoById, Video } from '@/lib/api';

export default function WatchPage() {
    const { id } = useParams();
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoData, setVideoData] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const loadVideo = async () => {
            if (!id) return;
            try {
                const data = await fetchVideoById(id as string);
                setVideoData(data);
            } catch (error) {
                console.error("Error fetching video:", error);
            } finally {
                setIsLoading(false);
            }
        };

        loadVideo();
    }, [id]);

    useEffect(() => {
        if (!videoData || !videoRef.current) return;

        const video = videoRef.current;
        const hlsUrl = videoData.videoUrl;

        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(hlsUrl);
            hls.attachMedia(video);
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                // video.play().catch(() => {}); // Autoplay might be blocked
            });
            return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            // Safari support
            video.src = hlsUrl;
        }
    }, [videoData]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-gray-400 font-medium italic">Preparing your cinematic experience...</p>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className="h-screen w-full bg-background flex flex-col items-center justify-center gap-6">
                <h1 className="text-4xl font-black text-white italic">VIDEO NOT FOUND</h1>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded font-bold hover:bg-primary-hover transition"
                >
                    <ArrowLeft /> Return to Home
                </button>
            </div>
        );
    }

    return (
        <main className="h-screen w-full bg-black overflow-hidden relative group">
            {/* Custom Video Player */}
            <div className="absolute inset-0 flex items-center justify-center">
                <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    onClick={togglePlay}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                />
            </div>

            {/* Back Button */}
            <button
                onClick={() => router.back()}
                className="absolute top-8 left-8 z-50 p-2 rounded-full bg-black/40 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60 glass"
            >
                <ArrowLeft className="w-8 h-8" />
            </button>

            {/* Simple Dynamic UI Overlay */}
            <div className="absolute inset-x-0 bottom-0 z-50 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-3xl font-black text-white italic truncate">{videoData.title}</h1>
                        <p className="text-gray-300 text-sm">{videoData.category} • {videoData.duration}</p>
                    </div>

                    {/* Fake Controls (Visual for now) */}
                    <div className="flex items-center gap-6 pt-4">
                        <button onClick={togglePlay} className="text-white hover:text-primary transition">
                            {isPlaying ? <Pause className="fill-white w-8 h-8" /> : <Play className="fill-white w-8 h-8" />}
                        </button>
                        <Volume2 className="text-white w-6 h-6 cursor-pointer" />
                        <div className="flex-1 h-1 bg-white/20 rounded-full relative overflow-hidden">
                            <div className="absolute inset-y-0 left-0 w-1/3 bg-primary" />
                        </div>
                        <Settings className="text-white w-6 h-6 cursor-pointer" />
                        <Maximize className="text-white w-6 h-6 cursor-pointer" />
                    </div>
                </div>
            </div>

            {/* Large Center Play Overlay if paused */}
            {!isPlaying && (
                <div
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                    onClick={togglePlay}
                >
                    <div className="w-24 h-24 rounded-full bg-primary/20 glass border border-primary/40 flex items-center justify-center shadow-[0_0_50px_rgba(229,9,20,0.3)]">
                        <Play className="fill-primary text-primary w-12 h-12 ml-2" />
                    </div>
                </div>
            )}
        </main>
    );
}
