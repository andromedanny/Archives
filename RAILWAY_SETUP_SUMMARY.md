# Railway Setup Summary

Quick summary of what to do to deploy your backend to Railway.

---

## 🎯 What You Need

1. **Railway account** (free: $5 credit/month)
2. **GitHub repository** (your code)
3. **Supabase credentials** (database + storage)
4. **10 minutes** to set up

---

## 🚀 Quick Steps

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub
- Authorize Railway to access repositories

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your repository

### 3. Configure Service
- Go to Settings → Source
- Set **Root Directory**: `backend`
- Verify Start Command: `npm start`

### 4. Set Environment Variables
Copy all variables from your Render deployment or see `RAILWAY_ENVIRONMENT_VARIABLES.md`

**Required**:
- `DATABASE_URL` (Supabase connection string)
- `SUPABASE_URL` (Supabase project URL)
- `SUPABASE_KEY` (Supabase anon key)
- `JWT_SECRET` (strong random string)
- `FRONTEND_URL=https://onefaithonearchive.vercel.app`
- `NODE_ENV=production`
- `STORAGE_TYPE=supabase`

### 5. Deploy
- Railway will auto-deploy
- Wait for deployment to complete
- Copy Railway URL: `https://your-project.railway.app`

### 6. Update Frontend (Vercel)
- Go to Vercel Dashboard → Settings → Environment Variables
- Add/Update: `VITE_API_URL=https://your-project.railway.app/api`
- Redeploy Vercel frontend

### 7. Test
- Test health endpoint: `https://your-project.railway.app/api/health`
- Test frontend login
- Check browser console for errors

---

## 📋 Detailed Guides

1. **RAILWAY_SETUP_GUIDE.md** - Complete step-by-step guide
2. **RAILWAY_QUICK_CHECKLIST.md** - Quick checklist
3. **RAILWAY_ENVIRONMENT_VARIABLES.md** - All environment variables

---

## ✅ Benefits

- ✅ **No cold starts** (unlike Render free tier)
- ✅ **Auto-deploy from GitHub**
- ✅ **Persistent storage**
- ✅ **Better performance**
- ✅ **Simple setup**

---

## 🆘 Need Help?

1. Check Railway logs
2. Check Supabase logs
3. Check browser console
4. Verify environment variables
5. Test health endpoint
6. See detailed guides above

---

## 🎉 Success!

Once everything is set up:
- ✅ Backend runs on Railway
- ✅ Database on Supabase
- ✅ Storage on Supabase
- ✅ Frontend on Vercel
- ✅ Everything connected and working

---

**Last Updated**: 2024-01-01

