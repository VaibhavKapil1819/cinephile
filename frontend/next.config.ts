import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
            },
            {
                protocol: 'https',
                hostname: 'picsum.photos',
            },
            {
                protocol: 'https',
                hostname: 'test-streams.mux.dev',
            },
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
    },
    // performance optimizations
    reactStrictMode: true,
    // swcMinify is removed in newer versions as it's the default
    compiler: {
        removeConsole: process.env.NODE_ENV === 'production',
    },
    // API proxy for backend
    async rewrites() {
        return [
            {
                source: '/api/:path*',
                destination: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/:path*',
            },
        ];
    },
};

export default nextConfig;
