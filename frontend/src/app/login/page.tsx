"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { login as loginApi } from '@/lib/api';
import { Loader2, Clapperboard, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await loginApi(email, password);
            if (response) {
                await login(response.access_token);
                router.push('/');
            } else {
                setError('Invalid email or password');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden px-4">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse delay-700" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
            </div>

            <div className="w-full max-w-md z-10">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 animate-in fade-in zoom-in duration-700">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_0_30px_rgba(229,9,20,0.2)] group hover:scale-110 transition-transform duration-500">
                                <Clapperboard className="w-12 h-12 text-primary group-hover:rotate-12 transition-transform" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                                Welcome <span className="text-primary italic">Back</span>
                            </h1>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">Enter the spotlight of your cinema</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-shake flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
                                        placeholder="name@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Secret Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(229,9,20,0.3)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        Enter Cinema
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px w-full bg-white/5" />
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest whitespace-nowrap">The Elite Hub</span>
                            <div className="h-px w-full bg-white/5" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                            New to the circle?{' '}
                            <Link href="/register" className="text-white hover:text-primary font-bold transition-all underline-offset-4 hover:underline">
                                Request Access
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Mobile optimization: subtext outside card */}
                <p className="text-center mt-8 text-gray-600 text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">
                    Proprietary Streaming Engine &bull; Cinephile v1.0
                </p>
            </div>
        </main>
    );
}
