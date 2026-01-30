"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { register as registerApi, login as loginApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Loader2, Clapperboard, Mail, Lock, User as UserIcon, Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const user = await registerApi(email, password, displayName);
            if (user) {
                // Auto login after registration
                const response = await loginApi(email, password);
                if (response) {
                    await login(response.access_token);
                    router.push('/');
                }
            } else {
                setError('Registration failed. Email might already be in use.');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden px-4 py-12">
            {/* Cinematic Background Elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-primary/5 rounded-full blur-[150px]" />
                <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/dark-matter.png')] opacity-20" />
            </div>

            <div className="w-full max-w-lg z-10">
                <div className="glass p-8 md:p-12 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="text-center space-y-4">
                        <div className="flex justify-center">
                            <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 shadow-[0_0_30px_rgba(229,9,20,0.2)]">
                                <Sparkles className="w-10 h-10 text-primary" />
                            </div>
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none">
                                Join <span className="text-primary italic">Cinephile</span>
                            </h1>
                            <p className="text-gray-400 text-sm font-medium tracking-wide">Become part of the cinematic elite</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium animate-shake flex items-center gap-3">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Screen Name</label>
                                <div className="relative group">
                                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
                                        placeholder="Major Tom"
                                    />
                                </div>
                            </div>

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
                                        placeholder="tom@space.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Security Code</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                                    <input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white outline-none focus:border-primary/50 focus:bg-white/10 transition-all placeholder:text-gray-700"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary hover:bg-primary-hover text-white font-black py-4 rounded-2xl shadow-[0_10px_30px_rgba(229,9,20,0.3)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group"
                        >
                            {isLoading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    Establish Identity
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center space-y-4">
                        <div className="flex items-center gap-4 py-2">
                            <div className="h-px w-full bg-white/5" />
                            <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest whitespace-nowrap">Access Protocols</span>
                            <div className="h-px w-full bg-white/5" />
                        </div>
                        <p className="text-gray-500 text-sm font-medium">
                            Already authenticated?{' '}
                            <Link href="/login" className="text-white hover:text-primary font-bold transition-all underline-offset-4 hover:underline">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
