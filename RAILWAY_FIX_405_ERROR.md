# Railway Fix: 405 Method Not Allowed Error

## 🚨 Error Message

```
archives-production-4f1d.up.railway.app/auth/login:1 
Failed to load resource: the server responded with a status of 405 ()

Login failed: Request failed with status code 405
```

**Problem**: The frontend is trying to access `/auth/login` but getting a 405 (Method Not Allowed) error.

---

## 🔍 Root Cause

The 405 error means:
1. **The route exists but the HTTP method is wrong**, OR
2. **The frontend is accessing the wrong URL** (missing `/api` prefix)

Looking at the error:
- Frontend is trying: `archives-production-4f1d.up.railway.app/auth/login`
- Should be: `archives-production-4f1d.up.railway.app/api/auth/login`

**The issue**: `VITE_API_URL` in Vercel is missing the `/api` suffix, OR the frontend is not using the correct base URL.

---

## ✅ Solution: Fix Vercel Environment Variable

### Step 1: Check Current VITE_API_URL

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `onefaithonearchive`
3. **Go to Settings** → **Environment Variables**
4. **Find `VITE_API_URL`**:
   - Check what value it's set to
   - If it's `https://archives-production-4f1d.up.railway.app` (missing `/api`), that's the problem

---

### Step 2: Update VITE_API_URL

1. **In Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Find `VITE_API_URL`**:
   - If it exists, **click edit**
   - If it doesn't exist, **click "Add New"**
3. **Set the value**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://archives-production-4f1d.up.railway.app/api` (must include `/api` at the end)
   - **Example**: `https://archives-production-4f1d.up.railway.app/api`
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
4. **Click "Save"**

**Important**: The value must end with `/api`:
- ✅ Correct: `https://archives-production-4f1d.up.railway.app/api`
- ❌ Wrong: `https://archives-production-4f1d.up.railway.app` (missing `/api`)

---

### Step 3: Redeploy Vercel Frontend

1. **Go to "Deployments" tab** (top menu)
2. **Find the latest deployment**
3. **Click "..."** (three dots) on the latest deployment
4. **Click "Redeploy"**
5. **Wait for redeployment to complete** (usually 1-2 minutes)

---

### Step 4: Verify Railway Service URL

1. **Go to Railway Dashboard**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service)
3. **Go to "Settings" tab** → **"Domains" section**
4. **Verify the Railway domain** matches what you set in Vercel:
   - Railway domain: `https://archives-production-4f1d.up.railway.app`
   - Vercel `VITE_API_URL`: `https://archives-production-4f1d.up.railway.app/api`

---

### Step 5: Test the Connection

1. **Open your frontend**: `https://onefaithonearchive.vercel.app`
2. **Open browser console** (F12 → Console tab)
3. **Try to login**
4. **Check the network requests**:
   - Should see: `POST https://archives-production-4f1d.up.railway.app/api/auth/login`
   - Should **NOT** see: `POST https://archives-production-4f1d.up.railway.app/auth/login`
5. **Check for errors**:
   - Should **NOT** see 405 error
   - Should see successful login or proper error message

---

## 🔍 Why This Happens

### Problem 1: Missing `/api` in VITE_API_URL

**Issue**: `VITE_API_URL` is set to Railway URL without `/api`:
- Wrong: `https://archives-production-4f1d.up.railway.app`
- Should be: `https://archives-production-4f1d.up.railway.app/api`

**Why**: The frontend API code uses `VITE_API_URL` as the base URL, so routes are appended to it:
- Frontend calls: `api.post('/auth/login', credentials)`
- If `VITE_API_URL` = `https://archives-production-4f1d.up.railway.app`
- Result: `https://archives-production-4f1d.up.railway.app/auth/login` ❌ (wrong)
- If `VITE_API_URL` = `https://archives-production-4f1d.up.railway.app/api`
- Result: `https://archives-production-4f1d.up.railway.app/api/auth/login` ✅ (correct)

---

### Problem 2: Backend Route Configuration

**Issue**: Backend routes are mounted at `/api`:
- Backend: `app.use('/api/auth', authRoutes)`
- Login route: `POST /api/auth/login`

**Why**: The backend expects requests to `/api/auth/login`, not `/auth/login`.

---

## 📋 Checklist

- [ ] `VITE_API_URL` is set in Vercel
- [ ] `VITE_API_URL` includes `/api` at the end
- [ ] `VITE_API_URL` matches Railway service URL + `/api`
- [ ] Vercel frontend is redeployed
- [ ] Browser console shows correct API URL
- [ ] Network requests go to `/api/auth/login` (not `/auth/login`)
- [ ] Login works without 405 error

---

## 🚨 Troubleshooting

### Issue 1: Still Getting 405 Error

**Problem**: Still getting 405 error after updating `VITE_API_URL`

**Solution**:
1. **Verify `VITE_API_URL` is set correctly**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Check if `VITE_API_URL` is set to: `https://archives-production-4f1d.up.railway.app/api`
   - Make sure it ends with `/api`

2. **Verify Vercel is redeployed**:
   - Go to Vercel Dashboard → Deployments tab
   - Check if latest deployment is after updating `VITE_API_URL`
   - If not, redeploy manually

3. **Clear browser cache**:
   - Clear browser cache and cookies
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try again

4. **Check browser console**:
   - Open browser console (F12 → Console)
   - Look for "Backend URL: ..."
   - Should show: `https://archives-production-4f1d.up.railway.app/api`
   - Should **NOT** show: `https://archives-production-4f1d.up.railway.app` (missing `/api`)

5. **Check network requests**:
   - Open browser DevTools → Network tab
   - Try to login
   - Check the request URL:
     - Should be: `POST https://archives-production-4f1d.up.railway.app/api/auth/login`
     - Should **NOT** be: `POST https://archives-production-4f1d.up.railway.app/auth/login`

---

### Issue 2: Frontend Still Using Old URL

**Problem**: Frontend is still trying to connect to Render URL

**Solution**:
1. **Verify `VITE_API_URL` is set to Railway URL**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Check if `VITE_API_URL` is set to Railway URL (not Render URL)
   - Should be: `https://archives-production-4f1d.up.railway.app/api`
   - Should **NOT** be: `https://archives-z3xr.onrender.com/api`

2. **Verify Vercel is redeployed**:
   - Go to Vercel Dashboard → Deployments tab
   - Redeploy manually if needed

3. **Clear browser cache**:
   - Clear browser cache and cookies
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try again

---

### Issue 3: Railway Service Not Responding

**Problem**: Railway service is not responding

**Solution**:
1. **Check Railway service is running**:
   - Go to Railway Dashboard → Your Service → Deployments tab
   - Check if deployment is successful
   - Check logs for errors

2. **Test health endpoint**:
   - Visit: `https://archives-production-4f1d.up.railway.app/api/health`
   - Should return: `{ "status": "OK", ... }`
   - If not, check Railway logs for errors

3. **Check Railway service URL**:
   - Go to Railway Dashboard → Your Service → Settings → Domains
   - Verify the Railway domain matches what you set in Vercel

---

## ✅ Verification

After fixing `VITE_API_URL`, verify:

1. **Browser console shows correct URL**:
   - Open browser console (F12 → Console)
   - Look for "Backend URL: https://archives-production-4f1d.up.railway.app/api"

2. **Network requests go to correct URL**:
   - Open browser DevTools → Network tab
   - Try to login
   - Check request URL: `POST https://archives-production-4f1d.up.railway.app/api/auth/login`

3. **No 405 error**:
   - Try to login
   - Should **NOT** see 405 error
   - Should see successful login or proper error message

4. **Login works**:
   - Try to login with valid credentials
   - Should work without errors

---

## 🎯 Quick Fix Summary

1. **Go to Vercel Dashboard** → Settings → Environment Variables
2. **Update `VITE_API_URL`** to: `https://archives-production-4f1d.up.railway.app/api`
   - **Important**: Must include `/api` at the end
3. **Redeploy Vercel frontend**
4. **Clear browser cache** and try again
5. **Test login** - should work without 405 error

---

## 📚 Related Guides

- **RAILWAY_FIX_CORS_AND_FRONTEND_URL.md** - CORS and frontend URL fix
- **RAILWAY_DEPLOY_STEP_BY_STEP.md** - Complete deployment guide
- **RAILWAY_SETUP_GUIDE.md** - Detailed setup guide

---

## 🎉 Success!

Once `VITE_API_URL` is set correctly:
- ✅ Frontend uses Railway URL + `/api`
- ✅ Requests go to `/api/auth/login` (not `/auth/login`)
- ✅ No 405 error
- ✅ Login works
- ✅ All API calls work

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

