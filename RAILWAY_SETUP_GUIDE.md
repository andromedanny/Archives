# Railway Backend Setup Guide

Complete step-by-step guide to deploy your Express.js backend to Railway.

**✅ This guide is configured for Supabase PostgreSQL database and Supabase Storage.**

## 🚂 Why Railway?

- ✅ **No cold starts** (unlike Render free tier)
- ✅ **Auto-deploy from GitHub**
- ✅ **Persistent storage** (no data loss)
- ✅ **Simple setup** (5 minutes)
- ✅ **$5 free credit/month** (usually enough for small apps)
- ✅ **Better performance** than Render free tier

---

## 📋 Prerequisites

1. **GitHub account** (your code should be on GitHub)
2. **Railway account** (sign up at https://railway.app)
3. **Supabase account** (already set up for database and storage)
4. **All environment variables** from your Render deployment

---

## 🚀 Step 1: Create Railway Account

1. Go to https://railway.app
2. Click **"Start a New Project"**
3. Sign up with **GitHub** (recommended)
4. Authorize Railway to access your GitHub repositories

---

## 🚀 Step 2: Create New Project

1. In Railway dashboard, click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Choose your repository: `Archives` (or your repo name)
4. Railway will detect it's a Node.js project automatically

---

## 🚀 Step 3: Configure Service

### 3.1. Set Root Directory

1. Click on your service
2. Go to **Settings** tab
3. Under **"Source"**, set:
   - **Root Directory**: `backend`
   - This tells Railway where your `package.json` and `server.js` are located

### 3.2. Configure Build & Start Commands

Railway usually auto-detects these, but verify in **Settings**:

- **Build Command**: (leave empty - Railway runs `npm install` automatically)
- **Start Command**: `npm start` (should be auto-detected from `package.json`)

Your `package.json` should have:
```json
{
  "scripts": {
    "start": "node server.js"
  }
}
```

---

## 🚀 Step 4: Set Environment Variables

### 4.1. Go to Variables Tab

1. Click on your service
2. Click **"Variables"** tab
3. Click **"New Variable"** for each variable

### 4.2. Required Environment Variables

Copy these from your Render deployment or Supabase dashboard:

```env
# Database Configuration (Supabase PostgreSQL)
# Option 1: Use connection string (RECOMMENDED - simpler and auto-detects PostgreSQL)
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
# Note: If using Pooler connection (recommended), port is 6543:
# DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true

# Option 2: Use individual parameters (alternative - only if not using DATABASE_URL)
# DB_TYPE=postgres
# DB_HOST=db.project-ref.supabase.co
# DB_PORT=5432
# DB_NAME=postgres
# DB_USER=postgres
# DB_PASSWORD=your_supabase_password
# DB_SSL=true  # Optional - defaults to true for PostgreSQL in code

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
PORT=5000
NODE_ENV=production

# Frontend URL (for CORS)
FRONTEND_URL=https://onefaithonearchive.vercel.app

# Backend URL (will be set automatically by Railway, but you can set it manually)
# Railway will provide this after deployment: https://your-project.railway.app

# Database Sync (optional - set to 'true' only when needed)
ENABLE_SYNC=false

# HTTP Logging (optional - set to 'true' to enable)
ENABLE_HTTP_LOGGING=false

# File Storage Configuration
STORAGE_TYPE=supabase

# Supabase Storage Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
# OR use:
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

### 4.3. How to Get Supabase Credentials

1. **DATABASE_URL** (Recommended - use this):
   - Go to Supabase Dashboard → Project Settings → Database
   - Scroll down to **Connection string**
   - **Recommended**: Use the **Pooler** connection (port 6543) for better compatibility with Railway
     - Select **"Connection pooling"** tab
     - Select **"Session mode"** or **"Transaction mode"**
     - Copy the connection string
     - Format: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
   - **Alternative**: Direct connection (port 5432)
     - Select **"Direct connection"** tab
     - Copy the connection string
     - Format: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`
   - **Note**: The code automatically detects PostgreSQL from the connection string and enables SSL
   - **Note**: If using `DATABASE_URL`, you don't need to set `DB_TYPE` or `DB_SSL` (auto-detected)

2. **SUPABASE_URL**:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the **Project URL**: `https://your-project-ref.supabase.co`

3. **SUPABASE_KEY** or **SUPABASE_ANON_KEY**:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the **anon public** key

4. **DB_PASSWORD** (only needed if using individual parameters, not DATABASE_URL):
   - Go to Supabase Dashboard → Project Settings → Database
   - Click **"Reset database password"** if you don't know it
   - Save the password securely
   - **Note**: If using `DATABASE_URL`, the password is included in the connection string

---

## 🚀 Step 5: Deploy

1. Railway will automatically detect changes and deploy
2. Wait for the build to complete (usually 1-2 minutes)
3. Check the **"Deployments"** tab to see the build logs
4. Once deployed, Railway will provide a URL like: `https://your-project.railway.app`

---

## 🚀 Step 6: Get Railway URL

1. After deployment, go to **Settings** tab
2. Under **"Domains"**, you'll see:
   - **Railway Domain**: `https://your-project.railway.app`
   - You can also add a custom domain (optional)

3. Copy the Railway domain URL

---

## 🚀 Step 7: Update Frontend (Vercel)

### 7.1. Update Vercel Environment Variables

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add or update:
   - **Variable**: `VITE_API_URL`
   - **Value**: `https://your-project.railway.app/api`
   - **Environment**: Production, Preview, Development (select all)

3. **Redeploy** your Vercel frontend:
   - Go to **Deployments** tab
   - Click **"..."** → **"Redeploy"**
   - Or push a new commit to trigger a new deployment

### 7.2. Verify Frontend Configuration

Your frontend `api.js` already uses `VITE_API_URL`:
```javascript
const api = axios.create({
  baseURL: (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_URL) || '/api',
  timeout: 10000,
});
```

---

## 🚀 Step 8: Update CORS (Backend)

Your `server.js` already allows the Vercel frontend:

```javascript
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://onefaithonearchive.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);
```

Make sure `FRONTEND_URL` is set in Railway:
- **Variable**: `FRONTEND_URL`
- **Value**: `https://onefaithonearchive.vercel.app`

---

## 🚀 Step 9: Test Deployment

### 9.1. Test Health Endpoint

Visit: `https://your-project.railway.app/api/health`

You should see:
```json
{
  "status": "OK",
  "message": "One Faith One Archive API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 9.2. Test Frontend Connection

1. Open your Vercel frontend: `https://onefaithonearchive.vercel.app`
2. Try to login
3. Check browser console for any CORS errors
4. Check Railway logs for any errors

### 9.3. Check Railway Logs

1. Go to Railway Dashboard → Your Service → **"Deployments"** tab
2. Click on the latest deployment
3. Check **"Logs"** for any errors

---

## 🚀 Step 10: Monitor and Troubleshoot

### 10.1. View Logs

- **Railway Dashboard** → Your Service → **"Logs"** tab
- Real-time logs are available
- Check for database connection errors, CORS errors, etc.

### 10.2. Common Issues

#### Issue 1: Database Connection Error
**Error**: `Database connection error: ...`

**Solution**:
- Verify `DATABASE_URL` is correct (check for typos)
- Check Supabase database is running (go to Supabase Dashboard)
- Use Supabase **Pooler** connection string (port 6543) for better compatibility with Railway
- If using Pooler, add `?pgbouncer=true` to the connection string
- Verify the password in the connection string is correct
- Check Railway logs for detailed error messages
- **Note**: `DB_SSL` is automatically enabled for PostgreSQL connections, no need to set it manually

#### Issue 2: CORS Error
**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
- Verify `FRONTEND_URL` is set in Railway
- Check `server.js` allows your frontend URL
- Make sure Vercel `VITE_API_URL` points to Railway URL

#### Issue 3: File Upload Error
**Error**: `Supabase upload error: ...`

**Solution**:
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are set
- Check Supabase Storage bucket `thesis-documents` exists
- Verify Supabase Storage policies are set up (see `SUPABASE_ALL_4_POLICIES_COMPLETE.md`)

#### Issue 4: Build Failed
**Error**: `Build failed: ...`

**Solution**:
- Check **Root Directory** is set to `backend`
- Verify `package.json` exists in `backend/` folder
- Check build logs for missing dependencies

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is a strong, random string (at least 32 characters)
- [ ] `NODE_ENV=production` is set
- [ ] `DATABASE_URL` uses SSL (automatically enabled for PostgreSQL connections)
- [ ] `FRONTEND_URL` is set to your Vercel URL
- [ ] Supabase Storage policies are configured (see `SUPABASE_ALL_4_POLICIES_COMPLETE.md`)
- [ ] Rate limiting is enabled (already in `server.js`)
- [ ] CORS is configured correctly (already in `server.js`)
- [ ] Database password is kept secret (never commit to GitHub)

---

## 📊 Railway Pricing

### Free Tier
- **$5 credit/month** (usually enough for small apps)
- **Pay-as-you-go** after free credit
- **No cold starts**
- **Persistent storage**

### Usage Estimates
- **Small app**: ~$2-3/month
- **Medium app**: ~$5-10/month
- **Large app**: ~$10-20/month

### Upgrade Options
- **Hobby Plan**: $5/month (fixed price)
- **Pro Plan**: $20/month (more resources)

---

## 🎯 Quick Reference

### Railway URLs
- **Dashboard**: https://railway.app
- **Your Service**: https://railway.app/project/your-project-id
- **API URL**: `https://your-project.railway.app`

### Environment Variables Summary
```env
# Database (Supabase PostgreSQL) - REQUIRED
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true

# Supabase Storage - REQUIRED
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
STORAGE_TYPE=supabase

# JWT - REQUIRED
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Server - REQUIRED
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://onefaithonearchive.vercel.app

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
MAX_FILE_SIZE=10485760
```

### Frontend (Vercel) Environment Variables
```env
VITE_API_URL=https://your-project.railway.app/api
```

---

## ✅ Deployment Checklist

- [ ] Railway account created
- [ ] GitHub repo connected
- [ ] Root directory set to `backend`
- [ ] All environment variables set
- [ ] Database connection tested
- [ ] Supabase Storage configured
- [ ] Railway URL obtained
- [ ] Vercel `VITE_API_URL` updated
- [ ] Frontend redeployed
- [ ] Health endpoint tested
- [ ] Frontend connection tested
- [ ] Login tested
- [ ] File upload tested

---

## 🆘 Support

### Railway Support
- **Documentation**: https://docs.railway.app
- **Discord**: https://discord.gg/railway
- **Email**: support@railway.app

### Troubleshooting
1. Check Railway logs
2. Check Supabase logs
3. Check Vercel logs
4. Check browser console
5. Verify environment variables
6. Test health endpoint
7. Test database connection

---

## 🎉 Success!

Once everything is set up:
- ✅ Backend runs on Railway (no cold starts)
- ✅ Database on Supabase
- ✅ Storage on Supabase
- ✅ Frontend on Vercel
- ✅ Everything connected and working

Your app should now be faster and more reliable than Render free tier!

---

## 📝 Next Steps

1. **Monitor usage** in Railway dashboard
2. **Set up custom domain** (optional)
3. **Configure auto-scaling** (if needed)
4. **Set up alerts** for errors (optional)
5. **Backup database** regularly (Supabase handles this)

---

## 🔄 Migrating from Render

If you're currently on Render:
1. Set up Railway (follow this guide)
2. Test Railway deployment
3. Update Vercel `VITE_API_URL` to Railway
4. Test everything works
5. **Then** delete Render service (optional)

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

