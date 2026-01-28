# Deployment Guide - Cinephile

Complete guide for deploying Cinephile to production with zero-investment platforms.

## 🎯 Deployment Stack

- **Frontend**: Vercel (Free tier)
- **Backend**: Railway or Vercel Serverless (Free tier)
- **Database**: Firebase Firestore or Supabase (Free tier)
- **Cache**: Upstash Redis (Free tier)
- **CDN**: Cloudflare (Free tier)

---

## 📦 Prerequisites

1. GitHub account (for code hosting)
2. Vercel account (sign up at vercel.com)
3. Railway account (sign up at railway.app) OR use Vercel for backend too
4. Firebase/Supabase account
5. Upstash account (for Redis)

---

## 🚀 Step-by-Step Deployment

### 1. Prepare Your Code

```bash
# Initialize git repository
cd cinephile
git init
git add .
git commit -m "Initial commit - Cinephile full-stack app"

# Create GitHub repository and push
# (Create repo on github.com first)
git remote add origin https://github.com/YOUR_USERNAME/cinephile.git
git branch -M main
git push -u origin main
```

### 2. Setup Database (Choose One)

#### Option A: Firebase Firestore

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project "Cinephile"
3. Enable Firestore Database
4. Create collection `videos` with sample document:
   ```json
   {
     "id": "1",
     "title": "Inception",
     "description": "A mind-bending thriller",
     "thumbnailUrl": "https://image.tmdb.org/t/p/w500/...",
     "videoUrl": "https://...",
     "category": "Sci-Fi",
     "duration": "2h 28m",
     "trending": true,
     "views": 1024,
     "releasedAt": "2024-01-15T00:00:00"
   }
   ```
5. Go to Project Settings → Service Accounts
6. Generate new private key (downloads JSON file)
7. **Keep this file secure** - you'll upload it to Railway/Vercel

#### Option B: Supabase

1. Go to [Supabase](https://supabase.com/)
2. Create new project "Cinephile"
3. Create table `videos`:
   ```sql
   CREATE TABLE videos (
     id TEXT PRIMARY KEY,
     title TEXT NOT NULL,
     description TEXT,
     thumbnail_url TEXT,
     video_url TEXT,
     category TEXT,
     duration TEXT,
     trending BOOLEAN DEFAULT false,
     views INTEGER DEFAULT 0,
     released_at TIMESTAMP DEFAULT NOW()
   );
   ```
4. Insert sample data
5. Copy your project URL and anon key from Settings → API

### 3. Setup Redis Cache (Upstash)

1. Go to [Upstash](https://upstash.com/)
2. Create new Redis database
3. Copy the `UPSTASH_REDIS_REST_URL`
4. This will be your `REDIS_URL` environment variable

### 4. Deploy Backend

#### Option A: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initialize project
cd backend
railway init

# Add environment variables in Railway dashboard:
# - SECRET_KEY=your-random-secret-key-here
# - REDIS_URL=your-upstash-redis-url
# - FIREBASE_CREDENTIALS_PATH=./firebase-creds.json (if using Firebase)
# - SUPABASE_URL=your-supabase-url (if using Supabase)
# - SUPABASE_KEY=your-supabase-key (if using Supabase)
# - ALLOWED_ORIGINS=https://your-frontend.vercel.app
# - ENVIRONMENT=production

# Upload Firebase credentials (if using Firebase)
# In Railway dashboard: Variables → Add File → Upload firebase-creds.json

# Deploy
railway up

# Get your backend URL (e.g., https://cinephile-backend.up.railway.app)
```

#### Option B: Vercel Serverless

Create `backend/vercel.json`:
```json
{
  "builds": [
    {
      "src": "main.py",
      "use": "@vercel/python"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "main.py"
    }
  ]
}
```

```bash
cd backend
vercel --prod

# Add environment variables in Vercel dashboard
```

### 5. Deploy Frontend (Vercel)

```bash
cd frontend

# Install Vercel CLI (if not already)
npm i -g vercel

# Login
vercel login

# Deploy
vercel --prod

# During deployment, set environment variables:
# NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
# NEXT_PUBLIC_CDN_URL=https://your-cdn.com (optional)
```

**Or use Vercel Dashboard:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Import Project"
3. Select your GitHub repo
4. Set root directory to `frontend`
5. Add environment variables
6. Deploy!

### 6. Configure CORS

Update backend environment variable:
```
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://www.your-domain.com
```

Redeploy backend after updating.

### 7. Custom Domain (Optional)

#### Frontend Domain
1. In Vercel dashboard → Settings → Domains
2. Add your custom domain (e.g., `cinephile.com`)
3. Update DNS records as instructed

#### Backend Domain
1. In Railway dashboard → Settings → Domains
2. Add custom domain (e.g., `api.cinephile.com`)
3. Update DNS records

---

## 🔐 Environment Variables Checklist

### Frontend (.env.local → Vercel)
```bash
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_GRAPHQL_URL=https://your-backend.railway.app/graphql
NEXT_PUBLIC_CDN_URL=https://your-cdn.com
```

### Backend (.env → Railway/Vercel)
```bash
# Security
SECRET_KEY=your-super-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database (Firebase)
FIREBASE_CREDENTIALS_PATH=./firebase-creds.json

# OR Database (Supabase)
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_KEY=your-anon-key

# Cache
REDIS_URL=redis://default:xxxxx@xxxxx.upstash.io:6379

# CORS
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://cinephile.com

# Environment
ENVIRONMENT=production
```

---

## 🧪 Testing Deployment

1. **Backend Health Check**:
   ```bash
   curl https://your-backend.railway.app/health
   ```

2. **Frontend Access**:
   Visit `https://your-frontend.vercel.app`

3. **API Integration**:
   Open browser console on frontend and check for API calls

4. **PWA Installation**:
   On mobile Chrome, click "Add to Home Screen"

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Frontend)
```bash
npm install @vercel/analytics
```

Add to `layout.tsx`:
```tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### Backend Logging
Railway and Vercel provide built-in logging dashboards.

---

## 🔄 CI/CD (Automatic Deployments)

Both Vercel and Railway automatically deploy when you push to GitHub:

```bash
# Make changes
git add .
git commit -m "Add new feature"
git push origin main

# Vercel and Railway will auto-deploy!
```

---

## 💰 Cost Breakdown (Free Tier Limits)

| Service | Free Tier | Upgrade Needed When |
|---------|-----------|---------------------|
| Vercel | 100GB bandwidth/month | > 10k users/month |
| Railway | $5 credit/month | Heavy backend usage |
| Supabase | 500MB database | > 50k rows |
| Upstash | 10k commands/day | > 10k requests/day |
| Cloudflare | Unlimited bandwidth | Never (for basic CDN) |

**Total Cost**: $0/month for MVP, scales as you grow

---

## 🚨 Troubleshooting

### Backend 500 Error
- Check Railway/Vercel logs
- Verify environment variables are set
- Test Redis connection
- Check database credentials

### Frontend Can't Connect to Backend
- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS settings in backend
- Ensure backend is deployed and running

### PWA Not Installing
- Verify `manifest.json` is accessible
- Check HTTPS is enabled (required for PWA)
- Ensure icons exist in `/public`

---

## 📈 Next Steps After Deployment

1. **Add Analytics**: Google Analytics, Mixpanel
2. **Setup Monitoring**: Sentry for error tracking
3. **CDN for Videos**: Cloudflare Stream or Mux
4. **Email Service**: SendGrid for auth emails
5. **Payment**: Stripe for subscriptions (if needed)

---

## 🎬 Production Checklist

- [ ] Environment variables configured
- [ ] Database seeded with content
- [ ] Redis cache connected
- [ ] CORS properly configured
- [ ] HTTPS enabled (automatic on Vercel/Railway)
- [ ] PWA manifest and icons in place
- [ ] Error monitoring setup
- [ ] Analytics integrated
- [ ] Custom domain configured (optional)
- [ ] Backup strategy for database

---

**🎉 Congratulations! Your Cinephile app is now live with antigravity speed!**

Share your deployment URL and start streaming! 🍿
