# Quick Fix: Intermittent CORS Errors

## 🚨 Problem

CORS errors occur intermittently - works for a few minutes, then stops working after logging out and reloading.

**Error**: 
```
Access to XMLHttpRequest at 'https://archives-production-4f1d.up.railway.app/api/auth/register-data' 
from origin 'https://onefaithonearchive.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.
```

---

## ✅ Quick Fix (3 Steps)

### Step 1: Verify FRONTEND_URL is Set in Railway

1. **Go to Railway Dashboard**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** → **Variables tab**
3. **Check if `FRONTEND_URL` exists**:
   - If not, add it: `https://onefaithonearchive.vercel.app`
   - If exists, verify it's correct
4. **Railway will auto-redeploy** after adding/updating variables

---

### Step 2: Check Railway Logs

1. **Go to Railway Dashboard** → **Your Service** → **Deployments** → **Latest deployment** → **Logs**
2. **Look for**:
   - ✅ `PostgreSQL database connected successfully`
   - ✅ `Server running on port 5000`
   - ❌ Database connection errors
   - ❌ Server crashes
   - ❌ Any error messages

**If you see database connection errors**, see `RAILWAY_FIX_DATABASE_CONNECTION.md`

---

### Step 3: Test Health Endpoint

1. **Visit**: `https://archives-production-4f1d.up.railway.app/api/health`
2. **Should return**: `{ "status": "OK", ... }`
3. **If not working**, backend is not running - check Railway logs

---

## 🔍 Root Cause

The intermittent CORS errors suggest:

1. **Backend stops responding** after a few requests
2. **Database connection issues** causing endpoints to hang
3. **Railway service restarting** or having issues
4. **CORS headers not being sent** when backend hangs

**Most likely**: Database connection is timing out or hanging, causing the backend to not respond, which results in no CORS headers being sent.

---

## ✅ Solution: Update Backend Code

I've updated the backend code to:

1. **Improve CORS configuration** - More explicit headers and better OPTIONS handling
2. **Add timeout to `/api/auth/register-data`** - Prevents hanging requests
3. **Better error handling** - Ensures responses are always sent

### What Was Changed:

1. **`backend/server.js`**:
   - Improved CORS configuration
   - Added explicit CORS headers
   - Better OPTIONS preflight handling

2. **`backend/routes/auth.js`**:
   - Added timeout to `/api/auth/register-data` endpoint
   - Prevents hanging database queries
   - Better error handling

---

## 🚀 Next Steps

### Step 1: Commit and Push Changes

1. **Commit the changes**:
   ```bash
   git add backend/server.js backend/routes/auth.js
   git commit -m "Fix: Improve CORS configuration and add timeout to register-data endpoint"
   git push origin main
   ```

2. **Railway will auto-deploy** from GitHub

3. **Wait for deployment to complete** (check Railway dashboard)

---

### Step 2: Verify Fix

1. **Wait for Railway deployment** to complete
2. **Test health endpoint**: `https://archives-production-4f1d.up.railway.app/api/health`
3. **Test register endpoint**: `https://archives-production-4f1d.up.railway.app/api/auth/register-data`
4. **Try to register** in the app - should work without CORS errors

---

### Step 3: Monitor Railway Logs

1. **Go to Railway Dashboard** → **Your Service** → **Logs**
2. **Monitor for**:
   - Database connection errors
   - Timeout errors
   - CORS-related logs
   - Any errors

---

## 🚨 If Still Having Issues

### Issue 1: Database Connection Timeout

**Problem**: Database connection is timing out

**Solution**:
1. Check `DATABASE_URL` is correct in Railway
2. Use Supabase Pooler connection (port 6543)
3. Check Supabase database is running
4. See `RAILWAY_FIX_DATABASE_CONNECTION.md` for detailed fix

---

### Issue 2: Railway Service Restarting

**Problem**: Railway service is restarting frequently

**Solution**:
1. Check Railway logs for restart reasons
2. Check resource usage (CPU, memory)
3. Check for errors in Railway logs
4. Consider upgrading Railway plan if needed

---

### Issue 3: CORS Still Not Working

**Problem**: CORS errors persist after fix

**Solution**:
1. Clear browser cache and cookies
2. Hard refresh (Ctrl+Shift+R)
3. Check Railway logs for errors
4. Verify `FRONTEND_URL` is set correctly
5. Test in incognito/private window

---

## ✅ Verification Checklist

- [ ] `FRONTEND_URL` is set in Railway to `https://onefaithonearchive.vercel.app`
- [ ] Backend code is updated (CORS and timeout fixes)
- [ ] Changes are committed and pushed to GitHub
- [ ] Railway deployment is complete
- [ ] Health endpoint works: `https://archives-production-4f1d.up.railway.app/api/health`
- [ ] Register endpoint works: `https://archives-production-4f1d.up.railway.app/api/auth/register-data`
- [ ] No CORS errors in browser console
- [ ] Registration works in the app
- [ ] No errors in Railway logs

---

## 🎯 Summary

**The fix includes**:
1. ✅ Improved CORS configuration (explicit headers, better OPTIONS handling)
2. ✅ Added timeout to `/api/auth/register-data` (prevents hanging)
3. ✅ Better error handling (ensures responses are always sent)

**Next steps**:
1. Commit and push changes to GitHub
2. Railway will auto-deploy
3. Test the app - should work without CORS errors

---

## 📚 Related Guides

- **RAILWAY_FIX_INTERMITTENT_CORS.md** - Detailed troubleshooting guide
- **RAILWAY_FIX_DATABASE_CONNECTION.md** - Database connection fix
- **RAILWAY_FIX_CORS_AND_FRONTEND_URL.md** - CORS and frontend URL fix

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

