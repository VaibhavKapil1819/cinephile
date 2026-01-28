"use client";

import React, { useState, useEffect } from 'react';
import { Search, Bell, User, Menu, X } from 'lucide-react';

export default function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 px-4 py-4 md:px-12 ${isScrolled ? 'glass ease-in' : 'bg-transparent'}`}>
            <div className="flex items-center justify-between">
                {/* Logo & Navigation */}
                <div className="flex items-center gap-8">
                    <h1 className="text-primary font-black text-2xl tracking-tighter uppercase italic cursor-pointer">
                        Cinephile
                    </h1>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex gap-6 text-sm font-medium text-gray-300">
                        <a href="/" className="hover:text-white transition">Home</a>
                        <a href="/movies" className="hover:text-white transition">Movies</a>
                        <a href="/categories" className="hover:text-white transition">Categories</a>
                        <a href="/trending" className="hover:text-white transition">New & Popular</a>
                    </div>
                </div>

                {/* Right Side Icons */}
                <div className="flex items-center gap-5 text-gray-300">
                    <Search className="w-5 h-5 cursor-pointer hover:text-white transition" />
                    <Bell className="w-5 h-5 cursor-pointer hover:text-white transition hidden md:block" />
                    <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center cursor-pointer hover:border-primary transition">
                        <User className="w-5 h-5 text-primary" />
                    </div>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden mt-4 glass rounded-lg p-4 space-y-3">
                    <a href="/" className="block text-gray-300 hover:text-white transition">Home</a>
                    <a href="/movies" className="block text-gray-300 hover:text-white transition">Movies</a>
                    <a href="/categories" className="block text-gray-300 hover:text-white transition">Categories</a>
                    <a href="/trending" className="block text-gray-300 hover:text-white transition">New & Popular</a>
                </div>
            )}
        </nav>
    );
}
