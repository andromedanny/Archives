# Update Checklist: Vercel, Render, and Supabase

## 🎯 What Was Fixed

### 1. **Backend Route Ordering** (Fixed ✅)
- Problem: Routes like `/api/thesis/:id/view` were getting 404 errors
- Solution: Moved specific routes before generic `/:id` route
- Status: ✅ Fixed and deployed

### 2. **Frontend SPA Routing** (Fixed ✅)
- Problem: 404 error when reloading `/auth/login` page
- Solution: Added rewrite rule in `vercel.json` to redirect all routes to `index.html`
- Status: ✅ Fixed and deployed

---

## ✅ What to Update/Verify

### 1. **Vercel (Frontend)** - Auto-Deploy

#### Step 1: Verify Auto-Deployment
1. **Go to Vercel Dashboard**
   - Open your project: `onefaithonearchive`
   - Go to "Deployments" tab
   - Check if latest deployment is in progress or completed
   - Should show commit: "Fix: Add SPA routing rewrite rule to vercel.json"

2. **If Not Auto-Deploying:**
   - Verify GitHub repository is connected
   - Check "Auto-Deploy" is enabled
   - Manually trigger deployment if needed

#### Step 2: Verify Environment Variables
Check these environment variables are set in Vercel:

**Required:**
```
VITE_API_URL=https://your-backend.onrender.com/api
```

**How to Check:**
1. Go to Vercel Dashboard
2. Open your project
3. Go to "Settings" → "Environment Variables"
4. Verify `VITE_API_URL` is set
5. Value should be: `https://your-backend.onrender.com/api`
6. Make sure it's enabled for:
   - ☑️ Production
   - ☑️ Preview
   - ☑️ Development

#### Step 3: Verify `vercel.json` is Deployed
1. **Check Build Logs:**
   - Go to "Deployments" tab
   - Open latest deployment
   - Check build logs for any errors
   - Verify `vercel.json` is included in build

2. **Test After Deployment:**
   - Go to: `https://onefaithonearchive.vercel.app/auth/login`
   - Reload the page (F5 or Ctrl+R)
   - **Expected:** Should NOT show 404 error
   - **Expected:** Should load login page correctly

---

### 2. **Render (Backend)** - Auto-Deploy

#### Step 1: Verify Auto-Deployment
1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Events" or "Logs" tab
   - Check if deployment is in progress or completed
   - Should show commit: "Fix: Reorder thesis routes to prevent 404 errors"

2. **If Not Auto-Deploying:**
   - Go to "Settings" → "Git"
   - Verify GitHub repository is connected
   - Check "Auto-Deploy" is enabled
   - Manually trigger deployment if needed

#### Step 2: Verify Environment Variables
Check these environment variables are set in Render:

**Required:**
```
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
JWT_SECRET=your_secret_key_here
NODE_ENV=production
FRONTEND_URL=https://onefaithonearchive.vercel.app
PORT=10000
```

**Optional but Recommended:**
```
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
STORAGE_TYPE=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
BACKEND_URL=https://your-backend.onrender.com
```

#### Step 3: Test Backend Endpoints
1. **Test Health Endpoint:**
   - Open browser
   - Go to: `https://your-backend.onrender.com/api/health`
   - **Expected:** Should see: `{"status":"OK","message":"One Faith One Archive API is running",...}`

2. **Test New Routes (after deployment):**
   - Test PDF view: `https://your-backend.onrender.com/api/thesis/1/view` (requires auth token)
   - Test download: `https://your-backend.onrender.com/api/thesis/1/download` (requires auth token)
   - Test my-theses: `https://your-backend.onrender.com/api/thesis/user/my-theses` (requires auth)

#### Step 4: Check Backend Logs
1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Logs" tab
   - Check for any errors
   - Look for "Server running on port" message
   - Verify routes are loading correctly

---

### 3. **Supabase (Database)** - Verify Connection

#### Step 1: Verify Database Connection
1. **Go to Supabase Dashboard**
   - Open your project
   - Go to "Settings" → "Database"
   - Check connection status
   - Verify database is accessible

#### Step 2: Verify Database URL in Render
1. **Get Connection String from Supabase:**
   - Go to "Settings" → "Database"
   - Find "Connection string" section
   - Copy "URI" connection string
   - Format: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`

2. **Verify in Render:**
   - Go to Render Dashboard
   - Open your backend service
   - Go to "Environment" tab
   - Verify `DATABASE_URL` is set correctly
   - Should match Supabase connection string

#### Step 3: Verify Tables Exist
1. **Go to Supabase Dashboard**
   - Go to "Table Editor"
   - Verify these tables exist:
     - ✅ `users`
     - ✅ `theses`
     - ✅ `thesis_authors`
     - ✅ `departments`
     - ✅ `courses`
     - ✅ `calendar_events`
     - ✅ `audit_logs`

2. **If Tables Are Missing:**
   - Check Render backend logs for database sync errors
   - May need to enable `ENABLE_SYNC=true` temporarily
   - Or run database setup script

#### Step 4: Verify Supabase Storage (if using)
1. **Go to Supabase Dashboard**
   - Go to "Storage"
   - Verify bucket `thesis-documents` exists
   - Check if files are being uploaded
   - Verify storage is accessible

2. **Verify Storage Configuration in Render:**
   - Go to Render Dashboard
   - Open your backend service
   - Go to "Environment" tab
   - Verify these variables are set:
     - `STORAGE_TYPE=supabase`
     - `SUPABASE_URL=https://your-project-ref.supabase.co`
     - `SUPABASE_KEY=your_supabase_anon_key`
     - `SUPABASE_STORAGE_BUCKET=thesis-documents`

---

## 🔍 Quick Verification Checklist

### Vercel (Frontend)
- [ ] Frontend is deployed and running
- [ ] `VITE_API_URL` is set correctly
- [ ] `vercel.json` is deployed
- [ ] Can reload `/auth/login` without 404 error
- [ ] All routes work correctly
- [ ] No console errors

### Render (Backend)
- [ ] Backend is deployed and running
- [ ] Health endpoint works: `https://your-backend.onrender.com/api/health`
- [ ] Database connection is working
- [ ] Environment variables are set correctly
- [ ] Route ordering fix is deployed
- [ ] No errors in backend logs

### Supabase (Database)
- [ ] Database is accessible
- [ ] `DATABASE_URL` is correct in Render
- [ ] All tables exist
- [ ] Database connection is working
- [ ] Storage bucket exists (if using)

---

## 🧪 Test After Updates

### 1. Test Frontend Routing
1. **Test Login Page Reload:**
   - Go to: `https://onefaithonearchive.vercel.app/auth/login`
   - Reload the page (F5)
   - **Expected:** Should NOT show 404 error
   - **Expected:** Should load login page correctly

2. **Test Other Routes:**
   - Go to: `https://onefaithonearchive.vercel.app/thesis`
   - Reload the page
   - **Expected:** Should NOT show 404 error
   - **Expected:** Should load thesis list

3. **Test Protected Routes:**
   - Login to your account
   - Go to: `https://onefaithonearchive.vercel.app/my-theses`
   - Reload the page
   - **Expected:** Should NOT show 404 error
   - **Expected:** Should load my theses page

### 2. Test PDF Viewing
1. **Go to My Theses:**
   - Login to your account
   - Go to "My Theses"
   - Click "View" on a thesis
   - Click "View PDF" button
   - **Expected:** PDF should display in browser
   - **Expected:** No 404 errors

### 3. Test PDF Download
1. **Go to My Theses:**
   - Click "PDF" or "Download" button
   - **Expected:** PDF should download
   - **Expected:** No 404 errors

### 4. Test Backend Endpoints
1. **Test Health:**
   - Go to: `https://your-backend.onrender.com/api/health`
   - **Expected:** Should return: `{"status":"OK",...}`

2. **Test Thesis List:**
   - Go to: `https://your-backend.onrender.com/api/thesis`
   - **Expected:** Should return list of theses
   - **Expected:** No 404 errors

---

## 🐛 Common Issues & Solutions

### Issue 1: Frontend Still Shows 404 on Reload
**Solution:**
1. Verify `vercel.json` is deployed
2. Check Vercel build logs for errors
3. Clear browser cache and hard refresh (Ctrl+Shift+R)
4. Verify rewrite rule is correct in `vercel.json`
5. Check Vercel deployment logs

### Issue 2: Backend Routes Still Returning 404
**Solution:**
1. Verify backend is deployed with latest code
2. Check backend logs for route errors
3. Test backend endpoints directly in browser
4. Verify route order in `backend/routes/thesis.js`
5. Check if backend service is running on Render

### Issue 3: Frontend Can't Connect to Backend
**Solution:**
1. Verify `VITE_API_URL` is set in Vercel
2. Check backend URL is correct
3. Verify backend is running on Render
4. Test backend health endpoint
5. Check CORS settings in backend

### Issue 4: Database Connection Errors
**Solution:**
1. Verify `DATABASE_URL` is correct in Render
2. Check Supabase database is accessible
3. Verify database credentials are correct
4. Check Supabase connection pooling settings
5. Test database connection from Render logs

### Issue 5: PDF Not Loading
**Solution:**
1. Verify file exists in database
2. Check file path is correct
3. Verify file storage configuration
4. Check backend logs for file access errors
5. Test file download endpoint directly

---

## 📋 Summary

### What Was Fixed:

1. **Backend Route Ordering:**
   - ✅ Moved `/user/my-theses` before `/:id`
   - ✅ Moved `/:id/view` before `/:id`
   - ✅ Moved `/:id/download` before `/:id`
   - ✅ Moved `/:id/document` before `/:id`

2. **Frontend SPA Routing:**
   - ✅ Added rewrite rule to `vercel.json`
   - ✅ All routes now redirect to `index.html`
   - ✅ React Router handles client-side routing

### What You Need to Do:

1. **Vercel (Frontend):**
   - ✅ Verify auto-deployment is working
   - ✅ Check `VITE_API_URL` is set correctly
   - ✅ Wait for deployment to complete
   - ✅ Test reload on `/auth/login` page

2. **Render (Backend):**
   - ✅ Verify auto-deployment is working
   - ✅ Check environment variables are set
   - ✅ Test backend health endpoint
   - ✅ Check backend logs for errors

3. **Supabase (Database):**
   - ✅ Verify database connection is working
   - ✅ Check `DATABASE_URL` is correct in Render
   - ✅ Verify all tables exist

4. **Test Everything:**
   - ✅ Test frontend routing (reload pages)
   - ✅ Test PDF viewing
   - ✅ Test PDF download
   - ✅ Test My Theses page

---

## 🚀 Next Steps

After verifying everything:

1. **Wait for Deployments:**
   - Vercel should auto-deploy (2-3 minutes)
   - Render should auto-deploy (5-10 minutes)

2. **Test the Fix:**
   - Go to: `https://onefaithonearchive.vercel.app/auth/login`
   - Reload the page
   - Should NOT show 404 error
   - Should load login page correctly

3. **Test All Routes:**
   - Test login page reload
   - Test thesis list reload
   - Test my-theses page reload
   - Test PDF viewing
   - Test PDF download

4. **Monitor:**
   - Check Vercel logs for any errors
   - Check Render logs for any errors
   - Monitor database connection

That's it! The 404 errors should be resolved after deployments complete. 🎉

---

## 📝 Notes

- **Vercel Rewrite Rule:** The rewrite rule `"source": "/(.*)", "destination": "/index.html"` tells Vercel to serve `index.html` for all routes, allowing React Router to handle client-side routing.

- **Backend Route Order:** Express matches routes in order, so specific routes must come before generic routes like `/:id`.

- **Static Assets:** Vercel automatically serves static assets (like `/assets/...`) before applying rewrites, so the rewrite rule won't affect static files.

- **API Routes:** API routes go directly to the backend via `VITE_API_URL`, not through Vercel rewrites.

---

## ✅ After Setup

Once deployments complete:
1. ✅ Frontend routing will work on reload
2. ✅ Backend routes will work correctly
3. ✅ PDF viewing will work
4. ✅ PDF download will work
5. ✅ No more 404 errors!

That's it! Your website should now work correctly! 🎉

