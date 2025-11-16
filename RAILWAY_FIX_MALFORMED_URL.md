# Railway Fix: Malformed URL Error

## 🚨 Error Message

```
POST https://onefaithonearchive.vercel.app/auth/archives-production-4f1d.up.railway.app/api/auth/login 405 (Method Not Allowed)
```

**Problem**: The URL is completely malformed. It's trying to access:
- Wrong: `https://onefaithonearchive.vercel.app/auth/archives-production-4f1d.up.railway.app/api/auth/login`
- Should be: `https://archives-production-4f1d.up.railway.app/api/auth/login`

**Root Cause**: `VITE_API_URL` in Vercel is set incorrectly, causing the frontend to construct a malformed URL.

---

## ✅ Solution: Fix VITE_API_URL in Vercel

### Step 1: Check Current VITE_API_URL

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `onefaithonearchive`
3. **Go to Settings** → **Environment Variables** (left sidebar)
4. **Find `VITE_API_URL`**:
   - Check what value it's currently set to
   - It's probably set incorrectly (maybe a relative path or malformed URL)

---

### Step 2: Delete Incorrect VITE_API_URL

1. **In Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Find `VITE_API_URL`**:
   - If it exists, **click "Delete"** or **click "Edit"** to update it
   - Delete the incorrect value first

---

### Step 3: Set Correct VITE_API_URL

1. **In Vercel Dashboard** → **Settings** → **Environment Variables**
2. **Click "Add New"** (or "Edit" if it exists)
3. **Set the value correctly**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://archives-production-4f1d.up.railway.app/api`
     - **Important**: Must start with `https://`
     - **Important**: Must include `/api` at the end
     - **Important**: Must be the Railway service URL (not Vercel URL)
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
4. **Click "Save"**

**Correct Value**:
```
https://archives-production-4f1d.up.railway.app/api
```

**Common Wrong Values**:
- ❌ `/auth/archives-production-4f1d.up.railway.app/api` (relative path)
- ❌ `archives-production-4f1d.up.railway.app/api` (missing `https://`)
- ❌ `https://archives-production-4f1d.up.railway.app` (missing `/api`)
- ❌ `https://onefaithonearchive.vercel.app/api` (wrong URL - this is frontend, not backend)
- ❌ `/api` (relative path)

---

### Step 4: Verify Railway Service URL

1. **Go to Railway Dashboard**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service)
3. **Go to "Settings" tab** → **"Domains" section**
4. **Copy the Railway domain**:
   - Format: `https://archives-production-4f1d.up.railway.app`
   - This is your Railway service URL
5. **Make sure `VITE_API_URL` in Vercel is set to**: `https://archives-production-4f1d.up.railway.app/api`

---

### Step 5: Redeploy Vercel Frontend

1. **Go to "Deployments" tab** (top menu)
2. **Find the latest deployment**
3. **Click "..."** (three dots) on the latest deployment
4. **Click "Redeploy"**
5. **Wait for redeployment to complete** (usually 1-2 minutes)

---

### Step 6: Clear Browser Cache

1. **Clear browser cache and cookies**:
   - Press `Ctrl+Shift+Delete` (Windows) or `Cmd+Shift+Delete` (Mac)
   - Select "Cached images and files" and "Cookies"
   - Click "Clear data"
2. **Hard refresh the page**:
   - Press `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
   - Or open in incognito/private window

---

### Step 7: Test the Connection

1. **Open your frontend**: `https://onefaithonearchive.vercel.app`
2. **Open browser console** (F12 → Console tab)
3. **Open browser DevTools** → **Network tab**
4. **Try to login**
5. **Check the network request**:
   - Should see: `POST https://archives-production-4f1d.up.railway.app/api/auth/login`
   - Should **NOT** see: `POST https://onefaithonearchive.vercel.app/auth/...` (malformed URL)
6. **Check for errors**:
   - Should **NOT** see 405 error
   - Should see successful login or proper error message

---

## 🔍 Why This Happens

### Problem: VITE_API_URL Set Incorrectly

**Issue**: `VITE_API_URL` is set to a relative path or malformed URL:
- Wrong: `/auth/archives-production-4f1d.up.railway.app/api` (relative path)
- Wrong: `archives-production-4f1d.up.railway.app/api` (missing `https://`)
- Wrong: `https://onefaithonearchive.vercel.app/api` (wrong URL)

**Why**: When `VITE_API_URL` is set incorrectly, the frontend constructs a malformed URL by concatenating it with the current domain (Vercel frontend URL).

**Result**: 
- Frontend URL: `https://onefaithonearchive.vercel.app`
- Incorrect `VITE_API_URL`: `/auth/archives-production-4f1d.up.railway.app/api`
- Malformed URL: `https://onefaithonearchive.vercel.app/auth/archives-production-4f1d.up.railway.app/api`

---

## 📋 Checklist

- [ ] `VITE_API_URL` is set in Vercel
- [ ] `VITE_API_URL` starts with `https://`
- [ ] `VITE_API_URL` is set to Railway service URL (not Vercel URL)
- [ ] `VITE_API_URL` includes `/api` at the end
- [ ] `VITE_API_URL` is: `https://archives-production-4f1d.up.railway.app/api`
- [ ] Vercel frontend is redeployed
- [ ] Browser cache is cleared
- [ ] Network requests go to Railway URL (not malformed URL)
- [ ] Login works without 405 error

---

## 🚨 Troubleshooting

### Issue 1: Still Getting Malformed URL

**Problem**: Still getting malformed URL after updating `VITE_API_URL`

**Solution**:
1. **Verify `VITE_API_URL` is set correctly**:
   - Go to Vercel Dashboard → Settings → Environment Variables
   - Check if `VITE_API_URL` is set to: `https://archives-production-4f1d.up.railway.app/api`
   - Make sure it starts with `https://` and ends with `/api`
   - Make sure it's the Railway URL (not Vercel URL)

2. **Delete and recreate the variable**:
   - Delete `VITE_API_URL` from Vercel
   - Add it again with the correct value
   - Make sure to select all environments (Production, Preview, Development)

3. **Verify Vercel is redeployed**:
   - Go to Vercel Dashboard → Deployments tab
   - Check if latest deployment is after updating `VITE_API_URL`
   - If not, redeploy manually

4. **Clear browser cache**:
   - Clear browser cache and cookies
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try again in incognito/private window

5. **Check browser console**:
   - Open browser console (F12 → Console)
   - Look for "Backend URL: ..."
   - Should show: `https://archives-production-4f1d.up.railway.app/api`
   - Should **NOT** show: `/auth/...` or malformed URL

---

### Issue 2: VITE_API_URL Not Being Read

**Problem**: `VITE_API_URL` is set correctly but not being read by the frontend

**Solution**:
1. **Verify variable name**:
   - Make sure it's exactly `VITE_API_URL` (case-sensitive)
   - Should start with `VITE_` prefix

2. **Verify environment selection**:
   - Make sure all environments are selected (Production, Preview, Development)
   - If not, update and redeploy

3. **Check build logs**:
   - Go to Vercel Dashboard → Deployments → Latest deployment → Build logs
   - Check if `VITE_API_URL` is being read during build
   - Look for any errors

4. **Redeploy frontend**:
   - Go to Vercel Dashboard → Deployments tab
   - Redeploy manually
   - Wait for build to complete

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
   - Should **NOT** see malformed URL

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
2. **Delete incorrect `VITE_API_URL`** (if exists)
3. **Add correct `VITE_API_URL`**:
   - Key: `VITE_API_URL`
   - Value: `https://archives-production-4f1d.up.railway.app/api`
   - Environments: Production, Preview, Development
4. **Save and redeploy** Vercel frontend
5. **Clear browser cache** and try again
6. **Test login** - should work without 405 error

---

## 📚 Related Guides

- **RAILWAY_FIX_405_ERROR.md** - 405 error fix
- **RAILWAY_FIX_CORS_AND_FRONTEND_URL.md** - CORS and frontend URL fix
- **RAILWAY_DEPLOY_STEP_BY_STEP.md** - Complete deployment guide

---

## 🎉 Success!

Once `VITE_API_URL` is set correctly:
- ✅ Frontend uses Railway URL (not malformed URL)
- ✅ Requests go to `/api/auth/login` (correct path)
- ✅ No 405 error
- ✅ Login works
- ✅ All API calls work

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

