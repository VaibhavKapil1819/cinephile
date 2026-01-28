# Cinephile Project Structure

## Complete File Tree

```
cinephile/
├── README.md                          # Project documentation
├── .gitignore                         # Git ignore rules
│
├── frontend/                          # Next.js Frontend
│   ├── package.json                   # Dependencies & scripts
│   ├── next.config.js                 # Next.js configuration
│   ├── tailwind.config.js             # Tailwind CSS config
│   ├── tsconfig.json                  # TypeScript config
│   ├── .env.local.example             # Environment template
│   ├── .env.local                     # Local environment (gitignored)
│   │
│   ├── public/                        # Static assets
│   │   ├── manifest.json              # PWA manifest
│   │   ├── icon-192.png               # PWA icon (small)
│   │   ├── icon-512.png               # PWA icon (large)
│   │   ├── favicon.ico                # Browser favicon
│   │   └── sw.js                      # Service worker (optional)
│   │
│   └── src/                           # Source code
│       ├── app/                       # Next.js App Router
│       │   ├── layout.tsx             # Root layout
│       │   ├── page.tsx               # Home page
│       │   ├── globals.css            # Global styles
│       │   │
│       │   ├── login/                 # Login page
│       │   │   └── page.tsx
│       │   ├── signup/                # Signup page
│       │   │   └── page.tsx
│       │   ├── profile/               # User profile
│       │   │   └── page.tsx
│       │   ├── watch/[id]/            # Video player
│       │   │   └── page.tsx
│       │   └── categories/            # Categories page
│       │       └── page.tsx
│       │
│       ├── components/                # Reusable components
│       │   ├── Navbar.tsx             # Navigation bar
│       │   ├── VideoCard.tsx          # Video thumbnail card
│       │   ├── VideoPlayer.tsx        # HLS/DASH player
│       │   ├── CategoryRow.tsx        # Horizontal video row
│       │   ├── HeroSection.tsx        # Hero banner
│       │   ├── SkeletonLoader.tsx     # Loading states
│       │   └── Footer.tsx             # Footer component
│       │
│       └── lib/                       # Utilities
│           ├── api.ts                 # API client functions
│           ├── apollo-client.ts       # Apollo GraphQL (optional)
│           └── utils.ts               # Helper functions
│
├── backend/                           # FastAPI Backend
│   ├── main.py                        # Main application
│   ├── models.py                      # Pydantic models
│   ├── auth.py                        # JWT authentication
│   ├── database.py                    # Database utilities
│   ├── cache.py                       # Redis caching
│   ├── graphql_schema.py              # GraphQL schema (optional)
│   ├── requirements.txt               # Python dependencies
│   ├── .env.example                   # Environment template
│   ├── .env                           # Local environment (gitignored)
│   │
│   ├── routers/                       # API route modules
│   │   ├── __init__.py
│   │   ├── videos.py                  # Video endpoints
│   │   ├── auth.py                    # Auth endpoints
│   │   ├── users.py                   # User endpoints
│   │   └── admin.py                   # Admin endpoints
│   │
│   └── tests/                         # Unit tests
│       ├── __init__.py
│       ├── test_videos.py
│       └── test_auth.py
│
└── shared/                            # Shared code
    ├── types/                         # TypeScript types
    │   ├── video.ts                   # Video interface
    │   └── user.ts                    # User interface
    ├── constants/                     # Constants
    │   └── index.ts                   # API endpoints, cache keys
    └── tsconfig.json                  # TypeScript config
```

## File Descriptions

### Frontend Files

| File | Purpose | Status |
|------|---------|--------|
| `src/app/page.tsx` | Home page with hero & video rows | ✅ Created |
| `src/app/layout.tsx` | Root layout with metadata | ✅ Created |
| `src/app/globals.css` | Global styles & animations | ✅ Created |
| `src/components/Navbar.tsx` | Responsive navigation | ✅ Created |
| `src/components/VideoCard.tsx` | Video thumbnail component | ✅ Created |
| `src/lib/api.ts` | API client utilities | ✅ Created |
| `tailwind.config.js` | Tailwind theme config | ✅ Created |
| `next.config.js` | Next.js configuration | ✅ Created |
| `public/manifest.json` | PWA manifest | ✅ Created |
| `.env.local.example` | Environment template | ✅ Created |

### Backend Files

| File | Purpose | Status |
|------|---------|--------|
| `main.py` | FastAPI app with routes | ✅ Created |
| `models.py` | Pydantic data models | ✅ Created |
| `auth.py` | JWT authentication | ✅ Created |
| `database.py` | DB abstraction layer | ✅ Created |
| `cache.py` | Redis caching utilities | ✅ Created |
| `graphql_schema.py` | GraphQL schema (optional) | ✅ Created |
| `requirements.txt` | Python dependencies | ✅ Created |
| `.env.example` | Environment template | ✅ Created |

### Shared Files

| File | Purpose | Status |
|------|---------|--------|
| `shared/types/video.ts` | Video TypeScript types | ✅ Created |
| `shared/constants/index.ts` | Shared constants | ✅ Created |
| `shared/tsconfig.json` | TypeScript config | ✅ Created |

## Next Steps

### To Complete Setup:

1. **Frontend Dependencies** (if disk space available):
   ```bash
   cd frontend
   npm install
   ```

2. **Backend Dependencies**:
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Environment Variables**:
   - Copy `.env.example` files to `.env` / `.env.local`
   - Fill in your API keys and database credentials

4. **Database Setup**:
   - Choose Firebase or Supabase
   - Create collections/tables for videos and users
   - Update `database.py` with your credentials

5. **Redis Setup**:
   - Install Redis locally or use Upstash (free tier)
   - Update `REDIS_URL` in backend `.env`

6. **Run Development Servers**:
   ```bash
   # Terminal 1 - Backend
   cd backend
   python main.py

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Files to Create Next:

- [ ] `frontend/src/app/login/page.tsx` - Login page
- [ ] `frontend/src/app/signup/page.tsx` - Signup page
- [ ] `frontend/src/app/watch/[id]/page.tsx` - Video player
- [ ] `frontend/src/components/VideoPlayer.tsx` - HLS player component
- [ ] `backend/routers/auth.py` - Auth endpoints (login/register)
- [ ] `backend/routers/videos.py` - Video CRUD operations
- [ ] Service worker for offline support
- [ ] PWA icons (192x192 and 512x512)

## Architecture Overview

```
┌─────────────────┐
│   User Device   │
│  (Mobile/Web)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Next.js PWA   │  ← Vercel Edge Network
│   (Frontend)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  FastAPI Server │  ← Railway/Vercel Serverless
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌──────┐  ┌──────┐
│Redis │  │ DB   │
│Cache │  │Fire/ │
│      │  │Supa  │
└──────┘  └──────┘
```

## Performance Strategy

1. **Edge Caching**: Next.js on Vercel CDN
2. **Redis Layer**: Aggressive caching for trending/popular
3. **Database**: Firestore/Supabase for persistence
4. **Video CDN**: Cloudflare Stream for video delivery
5. **PWA**: Offline support with service workers

---

**Status**: Core structure complete, ready for feature implementation
