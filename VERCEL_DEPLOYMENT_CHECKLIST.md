# Vercel Deployment Checklist

## ✅ Step 1: Fix Backend (DONE!)

- [x] Backend trust proxy setting added
- [x] Rate limiter configured for proxy
- [ ] **Commit and push backend changes to GitHub**
- [ ] **Wait for Render to redeploy** (auto-deploys on push)

## 🚀 Step 2: Deploy Frontend to Vercel

### A. Go to Vercel

1. Visit: https://vercel.com
2. Sign up/Login (free, connect GitHub)
3. Click "Add New..." → "Project"

### B. Import Repository

1. Select your GitHub repository: `Archives` (or your repo name)
2. Click "Import"

### C. Configure Project

**⚠️ IMPORTANT SETTINGS:**

1. **Framework Preset**: `Vite` (should auto-detect)
2. **Root Directory**: `frontend` ⚠️ **CRITICAL!**
   - Click "Edit" next to Root Directory
   - Type: `frontend`
   - Click "Continue"
3. **Build Command**: `npm run build` (should be auto-filled)
4. **Output Directory**: `dist` (should be auto-filled)
5. **Install Command**: `npm install` (should be auto-filled)

### D. Add Environment Variable

1. Click "Environment Variables"
2. Click "Add New"
3. **Key**: `VITE_API_URL`
4. **Value**: `https://your-backend-url.onrender.com/api`
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL
   - **Example**: If your Render URL is `https://faith-thesis-backend.onrender.com`, then use:
     ```
     https://faith-thesis-backend.onrender.com/api
     ```
5. **Environment**: Select all (Production, Preview, Development)
6. Click "Save"

### E. Deploy

1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

## 🔧 Step 3: Update Backend CORS

1. **Get Your Vercel URL**
   - Copy from Vercel dashboard
   - Example: `https://your-app.vercel.app`

2. **Go to Render Dashboard**
   - Open your backend service
   - Click "Environment" tab

3. **Update FRONTEND_URL**
   - Find `FRONTEND_URL` environment variable
   - Update value to your Vercel URL:
     ```
     https://your-app.vercel.app
     ```
   - **Don't include `/api`** - just the base URL
   - Click "Save Changes"

4. **Wait for Redeploy**
   - Render will automatically redeploy (2-3 minutes)
   - Check logs to confirm

## ✅ Step 4: Test Application

1. **Visit Your Frontend URL**
   - Go to your Vercel URL
   - Should see homepage

2. **Test Login**
   - Email: `admin@faith.edu.ph`
   - Password: `admin123`
   - Should successfully login

3. **Test Features**
   - Create a thesis
   - Upload a file
   - Search theses

## 📋 Quick Reference

### Vercel Configuration
```
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
Environment Variable: VITE_API_URL=https://your-backend.onrender.com/api
```

### Render Configuration
```
Environment Variable: FRONTEND_URL=https://your-app.vercel.app
```

## 🐛 Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in Render matches Vercel URL exactly
- Check `VITE_API_URL` in Vercel includes `/api`
- Wait for Render to redeploy

### API Not Found
- Check `VITE_API_URL` is set in Vercel
- Make sure it ends with `/api`
- Verify backend is running on Render

### Build Failed
- Check Root Directory is `frontend`
- Check Build Command is `npm run build`
- Try building locally first

## 🎉 Success!

After completing these steps:
- ✅ Frontend live on Vercel
- ✅ Backend live on Render
- ✅ Database set up in Supabase
- ✅ CORS configured
- ✅ Application fully functional!

