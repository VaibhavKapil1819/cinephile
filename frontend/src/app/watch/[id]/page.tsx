"use client";

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Maximize, Play, Pause, Volume2, Settings, Forward, Rewind, Info, Sparkles } from 'lucide-react';
import Hls from 'hls.js';
import { fetchVideoById, Video } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function WatchPage() {
    const { token } = useAuth();
    const { id } = useParams();
    const router = useRouter();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoData, setVideoData] = useState<Video | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isControlsVisible, setIsControlsVisible] = useState(true);
    const [hasRecordedHistory, setHasRecordedHistory] = useState(false);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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
                // video.play().catch(() => {});
            });
            return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = hlsUrl;
        }
    }, [videoData]);

    const recordHistory = async () => {
        if (!token || !id || hasRecordedHistory) return;
        try {
            const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';
            await fetch(`${API_BASE_URL}/user/watch-history?video_id=${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            setHasRecordedHistory(true);
        } catch (error) {
            console.error("Failed to record history:", error);
        }
    };

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
                recordHistory();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleMouseMove = () => {
        setIsControlsVisible(true);
        if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
        controlsTimeoutRef.current = setTimeout(() => {
            if (isPlaying) setIsControlsVisible(false);
        }, 3000);
    };

    if (isLoading) {
        return (
            <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center gap-6 overflow-hidden relative">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] animate-pulse" />
                <Loader2 className="w-16 h-16 text-primary animate-spin" />
                <div className="space-y-2 text-center">
                    <p className="text-white font-black italic tracking-tighter text-2xl uppercase">Cinephile <span className="text-gray-600">Engine</span></p>
                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.3em] animate-pulse">Establishing Secure Stream...</p>
                </div>
            </div>
        );
    }

    if (!videoData) {
        return (
            <div className="h-screen w-full bg-[#050505] flex flex-col items-center justify-center gap-8">
                <div className="text-center space-y-4">
                    <h1 className="text-6xl font-black text-white italic tracking-tighter uppercase leading-none">Void <span className="text-primary italic">Detected</span></h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-sm">The requested film has been redacted or moved</p>
                </div>
                <button
                    onClick={() => router.push('/')}
                    className="flex items-center gap-3 px-10 py-5 bg-primary text-white rounded-2xl font-black italic uppercase tracking-tighter hover:bg-primary-hover transition-all shadow-2xl hover:scale-105"
                >
                    <ArrowLeft className="w-6 h-6" /> Back to Spotlight
                </button>
            </div>
        );
    }

    return (
        <main
            className="h-screen w-full bg-black overflow-hidden relative group select-none"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => isPlaying && setIsControlsVisible(false)}
        >
            <video
                ref={videoRef}
                className="w-full h-full object-contain cursor-none"
                onClick={togglePlay}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />

            {/* Premium Top Navigation */}
            <div className={`absolute top-0 inset-x-0 p-8 flex items-center justify-between transition-all duration-700 ${isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
                <button
                    onClick={() => router.back()}
                    className="p-4 rounded-full glass hover:bg-white/10 transition-all active:scale-90 text-white shadow-2xl"
                >
                    <ArrowLeft className="w-8 h-8" />
                </button>
                <div className="flex items-center gap-4">
                    <span className="px-4 py-2 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent border border-accent/20">
                        <Sparkles className="inline-block w-3 h-3 mr-1.5 -translate-y-0.5" /> High Performance Stream
                    </span>
                </div>
            </div>

            {/* Immersion Gradient Layers */}
            <div className={`absolute inset-0 pointer-events-none bg-gradient-to-t from-black/90 via-transparent to-black/40 transition-opacity duration-700 ${isControlsVisible ? 'opacity-100' : 'opacity-0'}`} />

            {/* Central Large Control (Only on Pause) */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none scale-in-center">
                    <div className="p-8 rounded-full bg-primary/20 glass border border-primary/40 shadow-[0_0_80px_rgba(229,9,20,0.5)] animate-in zoom-in duration-300">
                        <Play className="fill-white text-white w-20 h-20 ml-3" />
                    </div>
                </div>
            )}

            {/* Cinematic Control Bar */}
            <div className={`absolute bottom-0 inset-x-0 p-8 md:p-12 transition-all duration-700 space-y-6 ${isControlsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                {/* Progress Bar Container */}
                <div className="space-y-2 group/progress cursor-pointer">
                    <div className="h-1.5 w-full bg-white/10 rounded-full relative overflow-hidden transition-all group-hover/progress:h-2">
                        <div className="absolute inset-y-0 left-0 w-1/3 bg-primary shadow-[0_0_15px_#E50914]" />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest font-mono">
                        <span>1:04:22</span>
                        <span>{videoData.duration}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-8 md:gap-12">
                        <div className="flex items-center gap-8">
                            <Rewind className="w-8 h-8 text-white hover:text-primary transition-colors cursor-pointer active:scale-90" />
                            <button onClick={togglePlay} className="text-white hover:scale-110 transition-all active:scale-90">
                                {isPlaying ? <Pause className="fill-white w-12 h-12" /> : <Play className="fill-white w-12 h-12 ml-1" />}
                            </button>
                            <Forward className="w-8 h-8 text-white hover:text-primary transition-colors cursor-pointer active:scale-90" />
                        </div>

                        <div className="hidden lg:block space-y-1 border-l border-white/10 pl-12">
                            <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-none">{videoData.title}</h2>
                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{videoData.category} &bull; High Definition</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-6 md:gap-8">
                        <div className="flex items-center gap-4 group/vol">
                            <Volume2 className="w-7 h-7 text-white" />
                            <div className="w-24 h-1 bg-white/10 rounded-full hidden md:block overflow-hidden relative">
                                <div className="absolute inset-y-0 left-0 w-3/4 bg-white" />
                            </div>
                        </div>
                        <Info className="w-7 h-7 text-white hover:text-primary transition-colors cursor-pointer" />
                        <Settings className="w-7 h-7 text-white hover:text-primary transition-colors cursor-pointer hover:rotate-90 duration-500" />
                        <Maximize className="w-7 h-7 text-white hover:text-primary transition-colors cursor-pointer active:scale-90" />
                    </div>
                </div>
            </div>
        </main>
    );
}
