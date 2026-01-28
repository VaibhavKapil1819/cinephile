export const API_ENDPOINTS = {
    VIDEOS_FEED: '/videos/feed',
    VIDEO_BY_ID: '/videos',
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    USER_PROFILE: '/user/profile',
    WATCH_HISTORY: '/user/history',
} as const;

export const CATEGORIES = [
    'Action',
    'Drama',
    'Sci-Fi',
    'Comedy',
    'Horror',
    'Documentary',
    'Thriller',
    'Romance',
    'Animation',
] as const;

export const CACHE_KEYS = {
    HOME_FEED: 'home_feed',
    TRENDING: 'trending_videos',
    CATEGORY_PREFIX: 'category_',
} as const;

export const CACHE_TTL = {
    SHORT: 60,        // 1 minute
    MEDIUM: 300,      // 5 minutes
    LONG: 3600,       // 1 hour
    DAY: 86400,       // 24 hours
} as const;
