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
    photoUrl?: string;
    watchHistory: string[]; // Array of video IDs
    preferences: {
        favoriteCategories: string[];
        autoplay: boolean;
    };
}

export type Category = 'Action' | 'Drama' | 'Sci-Fi' | 'Comedy' | 'Horror' | 'Documentary';
