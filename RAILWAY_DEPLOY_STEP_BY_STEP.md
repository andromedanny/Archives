# Railway Deployment - Step by Step

Follow these exact steps to deploy your backend to Railway.

---

## 🚀 Step 1: Create Railway Account

1. **Go to Railway**: https://railway.app
2. **Click "Start a New Project"** (or "Login" if you already have an account)
3. **Sign up with GitHub** (recommended):
   - Click **"Login with GitHub"**
   - Authorize Railway to access your GitHub repositories
   - Railway will redirect you to the dashboard

---

## 🚀 Step 2: Create New Project

1. **Click "New Project"** (button in the top right or on the dashboard)
2. **Select "Deploy from GitHub repo"**:
   - Railway will show your GitHub repositories
   - Find and select your repository: `Archives` (or your repo name)
   - Click on it
3. **Railway will detect Node.js** automatically and start deploying
4. **Wait for initial deployment** (this may fail - that's okay, we'll configure it next)

---

## 🚀 Step 3: Configure Service Settings (IMPORTANT!)

**⚠️ This step is CRITICAL!** If you skip this, you'll get the error: "Railpack could not determine how to build the app"

1. **Click on your service** (the service that was just created)
2. **Go to "Settings" tab** (top menu)
3. **Find "Source" section**:
   - **Root Directory**: **MUST be set to `backend`** (without quotes, no leading/trailing slashes)
     - This tells Railway where your `package.json` and `server.js` are located
     - If this is not set, Railway will look in the root directory and fail
   - **Start Command**: Should be `npm start` (auto-detected, verify it's there)
4. **Click "Save"** (Railway will automatically save and redeploy)
5. **Wait for redeployment to complete** (check Deployments tab)

---

## 🚀 Step 4: Get Supabase Credentials

Before setting environment variables, get your Supabase credentials:

### 4.1. Get DATABASE_URL (Supabase PostgreSQL)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Project Settings** → **Database** (left sidebar)
4. **Scroll down to "Connection string"**
5. **Select "Connection pooling" tab** (recommended for Railway)
6. **Select "Session mode"** or **"Transaction mode"**
7. **Copy the connection string**:
   - Format: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
   - **Note**: If the connection string doesn't have `?pgbouncer=true`, add it at the end
8. **Save this connection string** - you'll need it in the next step

### 4.2. Get SUPABASE_URL

1. **Still in Supabase Dashboard** → **Project Settings** → **API** (left sidebar)
2. **Copy the "Project URL"**:
   - Format: `https://your-project-ref.supabase.co`
3. **Save this URL** - you'll need it in the next step

### 4.3. Get SUPABASE_KEY

1. **Still in Supabase Dashboard** → **Project Settings** → **API**
2. **Copy the "anon public" key** (under "Project API keys")
   - This is your `SUPABASE_KEY` or `SUPABASE_ANON_KEY`
3. **Save this key** - you'll need it in the next step

### 4.4. Generate JWT_SECRET

1. **Open your terminal** (or use an online generator)
2. **Run this command**:
   ```bash
   openssl rand -base64 32
   ```
3. **Copy the generated string** - this is your `JWT_SECRET`
4. **Save this secret** - you'll need it in the next step

**Alternative**: Use an online generator like https://randomkeygen.com/

---

## 🚀 Step 5: Set Environment Variables

1. **In Railway Dashboard** → **Your Service** → **"Variables" tab** (top menu)
2. **Click "New Variable"** for each variable below
3. **Add each variable one by one**:

### Required Variables:

#### 1. DATABASE_URL
- **Key**: `DATABASE_URL`
- **Value**: Paste your Supabase connection string from Step 4.1
- **Example**: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
- **Click "Add"**

#### 2. SUPABASE_URL
- **Key**: `SUPABASE_URL`
- **Value**: Paste your Supabase project URL from Step 4.2
- **Example**: `https://your-project-ref.supabase.co`
- **Click "Add"**

#### 3. SUPABASE_KEY
- **Key**: `SUPABASE_KEY`
- **Value**: Paste your Supabase anon key from Step 4.3
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Click "Add"**

#### 4. SUPABASE_STORAGE_BUCKET
- **Key**: `SUPABASE_STORAGE_BUCKET`
- **Value**: `thesis-documents`
- **Click "Add"**

#### 5. STORAGE_TYPE
- **Key**: `STORAGE_TYPE`
- **Value**: `supabase`
- **Click "Add"**

#### 6. JWT_SECRET
- **Key**: `JWT_SECRET`
- **Value**: Paste your generated JWT secret from Step 4.4
- **Example**: `aBc123XyZ456...` (should be at least 32 characters)
- **Click "Add"**

#### 7. JWT_EXPIRE
- **Key**: `JWT_EXPIRE`
- **Value**: `7d`
- **Click "Add"**

#### 8. NODE_ENV
- **Key**: `NODE_ENV`
- **Value**: `production`
- **Click "Add"**

#### 9. PORT
- **Key**: `PORT`
- **Value**: `5000`
- **Click "Add"**

#### 10. FRONTEND_URL
- **Key**: `FRONTEND_URL`
- **Value**: `https://onefaithonearchive.vercel.app`
- **Click "Add"**

#### 11. MAX_FILE_SIZE (Optional)
- **Key**: `MAX_FILE_SIZE`
- **Value**: `10485760`
- **Click "Add"**

#### 12. ENABLE_SYNC (Optional)
- **Key**: `ENABLE_SYNC`
- **Value**: `false`
- **Click "Add"**

#### 13. ENABLE_HTTP_LOGGING (Optional)
- **Key**: `ENABLE_HTTP_LOGGING`
- **Value**: `false`
- **Click "Add"**

### After Adding All Variables:

- **Railway will automatically redeploy** when you add variables
- **Wait for deployment to complete** (check the "Deployments" tab)
- **Check the logs** for any errors

---

## 🚀 Step 6: Get Railway URL

1. **Go to "Settings" tab** (top menu)
2. **Scroll down to "Domains" section**
3. **Copy the Railway domain**:
   - Format: `https://your-project.railway.app`
   - **This is your backend URL**
4. **Save this URL** - you'll need it for the frontend

---

## 🚀 Step 7: Test Backend

### 7.1. Test Health Endpoint

1. **Open your browser**
2. **Visit**: `https://your-project.railway.app/api/health`
3. **You should see**:
   ```json
   {
     "status": "OK",
     "message": "One Faith One Archive API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```
4. **If you see this, your backend is working! ✅**

### 7.2. Check Railway Logs

1. **Go to "Deployments" tab** (top menu)
2. **Click on the latest deployment**
3. **Check the logs** for:
   - `PostgreSQL database connected successfully` ✅
   - `Supabase Storage client initialized` ✅
   - `Server running on port 5000` ✅
4. **If you see errors**, check the troubleshooting section below

---

## 🚀 Step 8: Update Frontend (Vercel)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `onefaithonearchive` (or your project name)
3. **Go to Settings** → **Environment Variables** (left sidebar)
4. **Add or update the variable**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-project.railway.app/api` (use your Railway URL from Step 6)
   - **Environment**: Select all (Production, Preview, Development)
   - **Click "Save"**
5. **Redeploy frontend**:
   - Go to **"Deployments" tab**
   - Click **"..."** (three dots) on the latest deployment
   - Click **"Redeploy"**
   - Wait for redeployment to complete

---

## 🚀 Step 9: Test Everything

1. **Open your frontend**: `https://onefaithonearchive.vercel.app`
2. **Try to login** with your credentials
3. **Check browser console** (F12 → Console tab) for any errors
4. **Check Railway logs** for any errors
5. **Try uploading a file** to test Supabase Storage
6. **If everything works, you're done! ✅**

---

## 🚨 Troubleshooting

### Issue 1: Build Failed - "Railpack could not determine how to build the app"

**Error**: `✖ Railpack could not determine how to build the app.`

**Solution**:
1. **Go to Settings → Source**
2. **Set Root Directory to `backend`** (this is the most common issue!)
   - Make sure it's exactly `backend` (no quotes, no slashes)
3. **Verify Start Command is `npm start`**
4. **Click Save** (Railway will redeploy automatically)
5. **Wait for redeployment** (check Deployments tab)
6. **Check logs** to verify build succeeded

**Why this happens**: Railway looks in the root directory by default, but your Node.js app is in the `backend/` folder. Setting Root Directory tells Railway where to find `package.json` and `server.js`.

---

### Issue 2: Database Connection Error - "Database connection error"

**Error**: 
```
Database connection error: 
⚠️  Server will continue without database connection. Some features may not work.
```

**Solution**:

1. **Check `DATABASE_URL` is set in Railway**:
   - Go to Railway Dashboard → Your Service → Variables tab
   - Check if `DATABASE_URL` exists
   - If not set, add it (see Step 4 below)

2. **Get Supabase Connection String**:
   - Go to Supabase Dashboard → Project Settings → Database
   - Select "Connection pooling" tab (recommended for Railway)
   - Select "Session mode" or "Transaction mode"
   - Copy the connection string
   - Format: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
   - **Important**: Use Pooler connection (port 6543) for Railway
   - **Important**: Add `?pgbouncer=true` at the end if not present

3. **Set `DATABASE_URL` in Railway**:
   - Go to Railway Dashboard → Your Service → Variables tab
   - Add or update `DATABASE_URL`
   - Value: Paste your Supabase connection string
   - Save (Railway will redeploy)

4. **Verify Connection**:
   - Wait for redeployment to complete
   - Check logs for: `PostgreSQL database connected successfully`
   - If still failing, check Railway logs for specific error message

**Common Issues**:
- Missing `DATABASE_URL` → Add it in Railway Variables
- Wrong connection string → Use Pooler connection (port 6543)
- Wrong password → Reset password in Supabase Dashboard
- Missing `?pgbouncer=true` → Add it to the connection string
- Database not accessible → Check Supabase Dashboard (verify database is running)

---

### Issue 3: CORS Error

**Error**: `Access to XMLHttpRequest has been blocked by CORS policy`

**Solution**:
1. Verify `FRONTEND_URL` is set in Railway: `https://onefaithonearchive.vercel.app`
2. Verify Vercel `VITE_API_URL` points to Railway: `https://your-project.railway.app/api`
3. Check browser console for exact error
4. Redeploy both Railway and Vercel after updating environment variables

---

### Issue 4: File Upload Error

**Error**: `Supabase upload error: ...`

**Solution**:
1. Verify `SUPABASE_URL` and `SUPABASE_KEY` are set correctly
2. Verify `STORAGE_TYPE=supabase` is set
3. Check Supabase Storage bucket `thesis-documents` exists
4. Verify Supabase Storage policies are set up (see `SUPABASE_ALL_4_POLICIES_COMPLETE.md`)

---

### Issue 5: Health Endpoint Not Working

**Error**: Cannot access `https://your-project.railway.app/api/health`

**Solution**:
1. Check Railway deployment is complete (Deployments tab)
2. Verify service is running (check logs)
3. Check Railway URL is correct
4. Wait a few minutes for DNS to propagate
5. Try again

---

## ✅ Deployment Checklist

Use this checklist to verify everything is set up:

- [ ] Railway account created
- [ ] GitHub repository connected
- [ ] Service created in Railway
- [ ] Root directory set to `backend`
- [ ] Start command is `npm start`
- [ ] All environment variables set (13 variables)
- [ ] Railway URL obtained
- [ ] Health endpoint works (`/api/health`)
- [ ] Database connected (check logs)
- [ ] Supabase Storage initialized (check logs)
- [ ] Vercel `VITE_API_URL` updated
- [ ] Vercel frontend redeployed
- [ ] Frontend can connect to backend
- [ ] Login works
- [ ] File upload works

---

## 🎉 Success!

Once everything is working:
- ✅ Backend runs on Railway (no cold starts)
- ✅ Database on Supabase PostgreSQL
- ✅ Storage on Supabase
- ✅ Frontend on Vercel
- ✅ Everything connected and working

---

## 📚 Additional Resources

- **Railway Dashboard**: https://railway.app
- **Supabase Dashboard**: https://supabase.com/dashboard
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Detailed Guide**: See `RAILWAY_SETUP_GUIDE.md`
- **Quick Start**: See `RAILWAY_QUICK_START.md`

---

## 🆘 Need Help?

If you're stuck:
1. Check Railway logs (Deployments → Logs)
2. Check Supabase logs (Supabase Dashboard)
3. Check browser console (F12 → Console)
4. Verify all environment variables are set correctly
5. Test health endpoint first
6. See troubleshooting section above

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

