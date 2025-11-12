# 🚀 Quick Deployment Checklist

## ✅ Step 1: Push to GitHub
- [ ] Run: `git push origin main`
- [ ] Verify code is on GitHub

## ✅ Step 2: Set Up Supabase (FIRST - 5 minutes)
- [ ] Create account at https://supabase.com (free, no credit card)
- [ ] Create new project
- [ ] Copy database connection string (Settings → Database)
- [ ] Create storage bucket: `thesis-documents` (Storage → Create bucket)
- [ ] Copy Supabase URL and API keys (Settings → API)
- [ ] Save these for Step 3:
  - Database URL: `postgresql://postgres:password@db.project.supabase.co:5432/postgres`
  - Supabase URL: `https://project.supabase.co`
  - Supabase Key: `your_anon_key`

## ✅ Step 3: Deploy Backend to Render (10 minutes)
- [ ] Create account at https://render.com (free, connect GitHub)
- [ ] Click "New" → "Web Service"
- [ ] Connect GitHub repository
- [ ] Configure:
  - Name: `faith-thesis-backend`
  - Root Directory: `backend`
  - Build Command: `npm install`
  - Start Command: `npm start`
  - Plan: Free
- [ ] Add environment variables (see below)
- [ ] Click "Create Web Service"
- [ ] Wait for deployment
- [ ] Copy backend URL (e.g., `https://your-app.onrender.com`)

### Backend Environment Variables (Render):
```
NODE_ENV=production
PORT=10000
DATABASE_URL=[Your Supabase connection string from Step 2]
DB_TYPE=postgres
JWT_SECRET=[Generate random string - use: openssl rand -base64 32]
JWT_EXPIRE=7d
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.onrender.com
STORAGE_TYPE=supabase
SUPABASE_URL=[Your Supabase URL from Step 2]
SUPABASE_KEY=[Your Supabase key from Step 2]
SUPABASE_STORAGE_BUCKET=thesis-documents
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

## ✅ Step 4: Set Up Database Tables (5 minutes)
- [ ] Go to Render dashboard → Your service → Shell
- [ ] Run: `cd backend && npm run reset-db`
- [ ] Or set DATABASE_URL locally and run: `npm run reset-db`
- [ ] Verify tables created in Supabase dashboard

## ✅ Step 5: Deploy Frontend to Vercel (5 minutes)
- [ ] Create account at https://vercel.com (free, connect GitHub)
- [ ] Click "New Project"
- [ ] Import GitHub repository
- [ ] Configure:
  - Framework: Vite
  - Root Directory: `frontend`
  - Build Command: `npm run build`
  - Output Directory: `dist`
- [ ] Add environment variable:
  - `VITE_API_URL=https://your-backend-url.onrender.com/api`
- [ ] Click "Deploy"
- [ ] Wait for deployment
- [ ] Copy frontend URL (e.g., `https://your-app.vercel.app`)

## ✅ Step 6: Update Backend CORS (2 minutes)
- [ ] Go to Render dashboard
- [ ] Update `FRONTEND_URL` to your Vercel URL
- [ ] Service will auto-redeploy

## ✅ Step 7: Test Deployment (5 minutes)
- [ ] Test backend: `https://your-backend.onrender.com/api/health`
- [ ] Test frontend: Visit your Vercel URL
- [ ] Login with default admin:
  - Email: `admin@faith.edu.ph`
  - Password: `admin123`
- [ ] Test creating a thesis
- [ ] Test file upload
- [ ] Test search functionality

## ✅ Step 8: Prevent Cold Starts (Optional - 2 minutes)
- [ ] Go to https://uptimerobot.com (free)
- [ ] Create account
- [ ] Add monitor for your Render URL
- [ ] Set to ping every 5 minutes
- [ ] This keeps your service awake!

## 🎉 Done!

Your application is now live and accessible from anywhere!

## 🔑 Default Admin Credentials
- Email: `admin@faith.edu.ph`
- Password: `admin123`
- **⚠️ Change this password after first login!**

## 📞 Need Help?
- Check Render logs if backend fails
- Check Vercel logs if frontend fails
- Verify environment variables are set correctly
- Check Supabase dashboard for database issues

