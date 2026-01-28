# Cinephile - Quick Start Guide

Get your Netflix-like streaming app running locally in 5 minutes!

## 🎯 What You're Building

A full-stack, mobile-first PWA with:
- **Frontend**: Next.js + TailwindCSS (Netflix-style UI)
- **Backend**: FastAPI + Python (High-performance API)
- **Features**: Video streaming, authentication, caching, PWA support

---

## ⚡ Quick Start (Local Development)

### Step 1: Install Prerequisites

**Required:**
- Node.js 18+ ([download](https://nodejs.org/))
- Python 3.11+ ([download](https://python.org/))

**Optional (for full features):**
- Redis ([install guide](https://redis.io/docs/getting-started/))

### Step 2: Clone & Setup

```bash
# Navigate to project
cd /Users/naveen/.gemini/antigravity/scratch/cinephile

# Or if starting fresh on Desktop:
# mkdir -p ~/Desktop/cinephile
# cd ~/Desktop/cinephile
# (copy all files there)
```

### Step 3: Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # Mac/Linux
# OR
venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env

# Edit .env (optional for now - has defaults)
# nano .env

# Start backend server
python main.py
```

**Backend running at:** `http://localhost:8000`
**API Docs:** `http://localhost:8000/docs`

### Step 4: Frontend Setup (New Terminal)

```bash
cd frontend

# Option A: Full install (if you have disk space)
npm install
npm run dev

# Option B: Minimal install (if low on space)
npm install next@latest react@latest react-dom@latest
npm install lucide-react
npm install -D typescript @types/node @types/react tailwindcss
npm run dev
```

**Frontend running at:** `http://localhost:3000`

### Step 5: Open in Browser

Visit: `http://localhost:3000`

You should see the Cinephile home page with:
- ✅ Hero section with Inception movie
- ✅ Category rows (Now Showing, Spotlight, etc.)
- ✅ Smooth animations and hover effects
- ✅ Responsive mobile-first design

---

## 🎬 What Works Right Now

### Frontend
- ✅ Home page with Netflix-style UI
- ✅ Responsive navigation bar
- ✅ Video cards with hover animations
- ✅ Glassmorphism effects
- ✅ PWA manifest (installable)
- ✅ Mobile-first responsive design

### Backend
- ✅ FastAPI server with auto-docs
- ✅ `/videos/feed` - Get video feed
- ✅ `/videos/{id}` - Get single video
- ✅ `/videos/trending/now` - Trending videos
- ✅ Health check endpoint
- ✅ CORS configured for frontend
- ✅ Redis caching (if Redis installed)
- ✅ JWT auth structure (ready to use)

---

## 🧪 Test the API

```bash
# Health check
curl http://localhost:8000/health

# Get video feed
curl http://localhost:8000/videos/feed

# Get trending videos
curl http://localhost:8000/videos/trending/now

# View API docs in browser
open http://localhost:8000/docs
```

---

## 🚀 Next Steps

### 1. Add Real Data

**Option A: Use Firebase**
```bash
# Install Firebase Admin SDK
pip install firebase-admin

# Get credentials from Firebase Console
# Update backend/database.py to use Firestore
```

**Option B: Use Supabase**
```bash
# Install Supabase client
pip install supabase

# Get URL and key from Supabase dashboard
# Update backend/database.py to use Supabase
```

### 2. Setup Redis (Optional but Recommended)

```bash
# Mac (using Homebrew)
brew install redis
brew services start redis

# Ubuntu/Debian
sudo apt install redis-server
sudo systemctl start redis

# Or use Upstash (cloud Redis - free tier)
# https://upstash.com/
```

### 3. Add Authentication Pages

Create these files:
- `frontend/src/app/login/page.tsx`
- `frontend/src/app/signup/page.tsx`
- `backend/routers/auth.py`

### 4. Add Video Player

```bash
cd frontend
npm install video.js hls.js

# Create VideoPlayer component
# Add watch/[id] page
```

---

## 📁 Project Structure

```
cinephile/
├── frontend/          # Next.js app
│   ├── src/
│   │   ├── app/      # Pages
│   │   ├── components/ # Reusable components
│   │   └── lib/      # Utilities
│   └── public/       # Static files
│
├── backend/          # FastAPI app
│   ├── main.py      # Main server
│   ├── models.py    # Data models
│   ├── auth.py      # Authentication
│   ├── database.py  # DB utilities
│   └── cache.py     # Redis cache
│
└── shared/          # Shared types
    ├── types/
    └── constants/
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check Python version
python3 --version  # Should be 3.11+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend won't start
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run dev
```

### Port already in use
```bash
# Backend (change port in main.py)
# Frontend (use different port)
npm run dev -- -p 3001
```

### Redis connection error
```bash
# Backend will work without Redis (just slower)
# Or install Redis locally
# Or use mock cache (already handled in cache.py)
```

---

## 💡 Development Tips

1. **Hot Reload**: Both frontend and backend auto-reload on file changes
2. **API Docs**: Use `/docs` for interactive API testing
3. **Debugging**: Check browser console and terminal logs
4. **Styling**: Edit `tailwind.config.js` for theme changes
5. **Mock Data**: Backend uses mock data until you connect a real database

---

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [TailwindCSS](https://tailwindcss.com/docs)
- [PWA Guide](https://web.dev/progressive-web-apps/)

---

## 🎯 Development Workflow

```bash
# 1. Start backend (Terminal 1)
cd backend
source venv/bin/activate
python main.py

# 2. Start frontend (Terminal 2)
cd frontend
npm run dev

# 3. Make changes and see them live!
# 4. Test API at http://localhost:8000/docs
# 5. View app at http://localhost:3000
```

---

## ✅ Checklist

- [ ] Backend running on port 8000
- [ ] Frontend running on port 3000
- [ ] Can see home page in browser
- [ ] API docs accessible at /docs
- [ ] No console errors
- [ ] Hover effects working on video cards
- [ ] Navigation bar scrolls and changes style

---

**🎬 You're all set! Start building your streaming empire!**

Need help? Check:
- `README.md` - Full documentation
- `PROJECT_STRUCTURE.md` - File organization
- `DEPLOYMENT.md` - Production deployment guide
