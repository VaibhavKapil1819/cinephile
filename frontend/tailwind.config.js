/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#050505",
                foreground: "#ffffff",
                primary: {
                    DEFAULT: "#E50914", // Netflix Red
                    hover: "#f40612",
                },
                accent: {
                    cyan: "#00E5FF",
                    glow: "rgba(229, 9, 20, 0.4)",
                },
                surface: {
                    DEFAULT: "#141414",
                    elevated: "#1f1f1f",
                }
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "hero-gradient": "linear-gradient(to top, #050505 0%, transparent 50%, rgba(5,5,5,0.8) 100%)",
            },
            animation: {
                'glow-pulse': 'glow-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                'glow-pulse': {
                    '0%, 100%': { boxShadow: '0 0 5px rgba(229, 9, 20, 0.2)' },
                    '50%': { boxShadow: '0 0 20px rgba(229, 9, 20, 0.6)' },
                }
            }
        },
    },
    plugins: [],
};
