# Cinephile - Full-Stack Netflix-like PWA

A high-performance, scalable, mobile-first streaming platform built with Next.js and FastAPI.

## 🎬 Project Structure

```
cinephile/
├── frontend/              # Next.js + TailwindCSS + PWA
│   ├── src/
│   │   ├── app/          # App router pages
│   │   ├── components/   # Reusable components
│   │   └── lib/          # Utilities & API clients
│   ├── public/           # Static assets & PWA manifest
│   └── package.json
├── backend/              # FastAPI + Python
│   ├── main.py          # Main application
│   ├── models.py        # Pydantic models
│   ├── auth.py          # JWT authentication
│   ├── cache.py         # Redis caching
│   └── requirements.txt
└── shared/              # Shared types & constants
    ├── types/
    └── constants/
```

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **Styling**: TailwindCSS with custom cinematic theme
- **PWA**: Service Workers + Manifest
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **State**: React Hooks + Context API
- **API Client**: Fetch with Next.js caching

### Backend
- **Framework**: FastAPI (Python)
- **Auth**: JWT with python-jose
- **Database**: Firebase Firestore / Supabase
- **Caching**: Redis (async)
- **GraphQL**: Strawberry GraphQL (optional)
- **Video**: Cloudflare Stream / HLS

### Deployment
- **Frontend**: Vercel (zero-config)
- **Backend**: Railway / Vercel Serverless
- **Database**: Firebase / Supabase (free tier)
- **Cache**: Upstash Redis (free tier)
- **CDN**: Cloudflare

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Redis (local or cloud)

### Frontend Setup

```bash
cd frontend

# Install dependencies (if disk space available)
npm install

# Or manually install key packages
npm install next@latest react@latest react-dom@latest
npm install lucide-react clsx tailwind-merge framer-motion
npm install -D typescript @types/node @types/react tailwindcss

# Copy environment variables
cp .env.local.example .env.local

# Edit .env.local with your API URL
# NEXT_PUBLIC_API_URL=http://localhost:8000

# Run development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env

# Edit .env with your configuration
# SECRET_KEY, REDIS_URL, DATABASE credentials, etc.

# Run development server
python main.py
# Or with uvicorn
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend API will be available at `http://localhost:8000`

## 🎯 Features

### Implemented
- ✅ Mobile-first responsive design
- ✅ Netflix-style UI with glassmorphism
- ✅ Dynamic hero section
- ✅ Category-based video rows
- ✅ Hover animations and transitions
- ✅ PWA manifest for installable app
- ✅ FastAPI backend with async endpoints
- ✅ JWT authentication structure
- ✅ Redis caching utilities
- ✅ Pydantic models for type safety
- ✅ CORS configuration
- ✅ Health check endpoint

### To Implement
- 🔲 Firebase/Supabase database integration
- 🔲 User registration & login pages
- 🔲 Video player with HLS/DASH support
- 🔲 Watch history tracking
- 🔲 Recommendations engine
- 🔲 Search functionality
- 🔲 Admin dashboard for video management
- 🔲 GraphQL API (optional)
- 🔲 Service Worker for offline support
- 🔲 Push notifications
- 🔲 Social features (likes, comments)

## 🎨 Design Philosophy

**Cinephile** follows these principles:
- **Antigravity Speed**: Optimized for minimal latency with edge caching
- **Mobile-First**: Designed for touch and small screens
- **Cinematic**: Dark theme with red/cyan accents
- **Premium**: Glassmorphism, smooth animations, micro-interactions
- **Accessible**: Semantic HTML, ARIA labels, keyboard navigation

## 📱 PWA Features

- Installable on mobile and desktop
- Offline support with service workers
- App-like experience in standalone mode
- Custom splash screen and icons
- Background sync for watch history

## 🔐 Authentication Flow

1. User signs up/logs in via `/auth/login`
2. Backend validates credentials and returns JWT
3. Frontend stores token in httpOnly cookie or localStorage
4. Protected routes check token validity
5. Token refresh on expiration

## 🎥 Video Streaming

- **CDN**: Cloudflare Stream or custom HLS/DASH
- **Adaptive Bitrate**: Automatic quality switching
- **Preloading**: Thumbnail sprites for scrubbing
- **Analytics**: View tracking and engagement metrics

## 🚢 Deployment

### Frontend (Vercel)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel --prod
```

### Backend (Railway)
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

### Environment Variables
Set these in your deployment platform:
- Frontend: `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_CDN_URL`
- Backend: `SECRET_KEY`, `REDIS_URL`, `DATABASE_URL`, `ALLOWED_ORIGINS`

## 📊 Performance Targets

- **Lighthouse Score**: 90+ on all metrics
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **API Response Time**: < 100ms (cached)
- **Video Start Time**: < 2s

## 🛠️ Development

### Frontend Commands
```bash
npm run dev      # Development server
npm run build    # Production build
npm run start    # Production server
npm run lint     # ESLint
```

### Backend Commands
```bash
python main.py              # Run with auto-reload
pytest                      # Run tests (when added)
black .                     # Format code
mypy .                      # Type checking
```

## 📝 API Documentation

Once backend is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects

## 🎬 Branding

- **Name**: Cinephile
- **Tagline**: "Spotlight on Pure Cinema"
- **Theme**: Cinematic red (#E50914) + Cyan accent (#00E5FF)
- **Features**: "Now Showing", "Spotlight", "Binge Worthy"

---

**Built with ⚡ Antigravity Speed**
