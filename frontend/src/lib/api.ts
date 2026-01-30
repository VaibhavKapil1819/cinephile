const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000') + '/api/v1';

export interface Video {
    id: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    videoUrl: string;
    category: string;
    duration: string;
    trending: boolean;
    views: number;
    releasedAt: string;
}

export interface User {
    id: string;
    email: string;
    displayName: string;
    disabled: boolean;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
}

export async function fetchHomeFeed(category?: string): Promise<Video[]> {
    try {
        const url = category
            ? `${API_BASE_URL}/videos/feed?category=${category}`
            : `${API_BASE_URL}/videos/feed`;

        const response = await fetch(url, {
            next: { revalidate: 60 }, // Cache for 60 seconds
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch home feed:', error);
        return [];
    }
}

export async function fetchVideoById(id: string): Promise<Video | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/${id}`, {
            next: { revalidate: 300 },
        });

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Failed to fetch video:', error);
        return null;
    }
}

export async function searchVideos(query: string): Promise<Video[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/search/query?q=${encodeURIComponent(query)}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Search failed:', error);
        return [];
    }
}

export async function fetchTrending(limit: number = 10): Promise<Video[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/videos/trending/now?limit=${limit}`);
        if (!response.ok) return [];
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch trending:', error);
        return [];
    }
}

// Health check for backend connectivity
export async function checkBackendHealth(): Promise<boolean> {
    try {
        const response = await fetch(`${API_BASE_URL}/health`, {
            cache: 'no-store',
        });
        return response.ok;
    } catch {
        return false;
    }
}

export async function login(email: string, password: string): Promise<AuthResponse | null> {
    try {
        const formData = new URLSearchParams();
        formData.append('username', email); // OAuth2 expects 'username'
        formData.append('password', password);

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData,
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Login failed:', error);
        return null;
    }
}

export async function register(email: string, password: string, displayName: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password, displayName }),
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Registration failed:', error);
        return null;
    }
}

export async function fetchUserProfile(token: string): Promise<User | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/user/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) return null;
        return await response.json();
    } catch (error) {
        console.error('Failed to fetch profile:', error);
        return null;
    }
}
