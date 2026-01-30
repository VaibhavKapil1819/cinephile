"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, fetchUserProfile } from '@/lib/api';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (token: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            loadProfile(storedToken);
        } else {
            setIsLoading(false);
        }
    }, []);

    const loadProfile = async (authToken: string) => {
        try {
            const profile = await fetchUserProfile(authToken);
            if (profile) {
                setUser(profile);
            } else {
                logout();
            }
        } catch (error) {
            console.error("Failed to load profile", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (authToken: string) => {
        localStorage.setItem('token', authToken);
        setToken(authToken);
        await loadProfile(authToken);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        setIsLoading(false);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
