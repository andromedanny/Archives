# Railway Quick Start

Get your backend deployed to Railway in 5 minutes!

---

## 🚀 Step 1: Create Railway Account (1 minute)

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended)
4. Authorize Railway to access your repositories

--- 

## 🚀 Step 2: Deploy from GitHub (1 minute)

1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `Archives` (or your repo name)
4. Railway will auto-detect Node.js

---

## 🚀 Step 3: Configure Service (1 minute)

1. Click on your service
2. Go to **Settings** → **Source**
3. Set **Root Directory**: `backend`
4. Verify **Start Command**: `npm start` (auto-detected)

---

## 🚀 Step 4: Set Environment Variables (2 minutes)

Go to **Variables** tab and add these:

### Required Variables

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
DB_TYPE=postgres
DB_SSL=true

# Supabase Storage
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
STORAGE_TYPE=supabase

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://onefaithonearchive.vercel.app

# File Upload
MAX_FILE_SIZE=10485760
```

**How to get Supabase credentials**:
- **DATABASE_URL**: Supabase Dashboard → Project Settings → Database → Connection string (use Pooler)
- **SUPABASE_URL**: Supabase Dashboard → Project Settings → API → Project URL
- **SUPABASE_KEY**: Supabase Dashboard → Project Settings → API → anon public key

**How to generate JWT_SECRET**:
```bash
openssl rand -base64 32
```

---

## 🚀 Step 5: Deploy (1 minute)

1. Railway will auto-deploy after you set variables
2. Wait for deployment to complete (~1-2 minutes)
3. Check **Deployments** tab for logs
4. Copy Railway URL: `https://your-project.railway.app`

---

## 🚀 Step 6: Update Frontend (Vercel) (1 minute)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add/Update:
   - **Variable**: `VITE_API_URL`
   - **Value**: `https://your-project.railway.app/api`
   - **Environment**: Production, Preview, Development
3. Click **Save**
4. Go to **Deployments** → Click **"..."** → **"Redeploy"**

---

## 🚀 Step 7: Test (1 minute)

### Test Health Endpoint
Visit: `https://your-project.railway.app/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "One Faith One Archive API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Test Frontend
1. Open: `https://onefaithonearchive.vercel.app`
2. Try to login
3. Check browser console for errors
4. Check Railway logs for errors

---

## ✅ Done!

Your backend is now running on Railway with:
- ✅ No cold starts
- ✅ Auto-deploy from GitHub
- ✅ Persistent storage
- ✅ Better performance

---

## 🆘 Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` is correct
- Use Supabase Pooler connection
- Verify `DB_SSL=true`

### CORS Error
- Check `FRONTEND_URL` is set
- Verify Vercel `VITE_API_URL` points to Railway
- Check browser console for exact error

### File Upload Error
- Check `SUPABASE_URL` and `SUPABASE_KEY`
- Verify Supabase Storage bucket exists
- Check Supabase Storage policies

### Build Failed
- Check Root Directory is `backend`
- Verify `package.json` exists
- Check build logs for missing dependencies

---

## 📚 Detailed Guides

- **RAILWAY_SETUP_GUIDE.md** - Complete step-by-step guide
- **RAILWAY_QUICK_CHECKLIST.md** - Quick checklist
- **RAILWAY_ENVIRONMENT_VARIABLES.md** - All environment variables

---

## 🎉 Success!

Once everything is working:
- ✅ Backend: Railway
- ✅ Database: Supabase
- ✅ Storage: Supabase
- ✅ Frontend: Vercel
- ✅ Everything connected!

---

**Last Updated**: 2024-01-01

