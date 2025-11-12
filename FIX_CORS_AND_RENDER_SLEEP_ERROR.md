# Fix: CORS Error and Render Backend Not Responding

## Problem
Getting CORS error and "Backend server is not responding" after several login attempts:
```
Access to XMLHttpRequest at 'https://archives-z3xr.onrender.com/api/auth/login' 
from origin 'https://onefaithonearchive.vercel.app' has been blocked by CORS policy
```

## Two Issues to Fix

### Issue 1: Render Backend is Sleeping
Render free tier services sleep after 15 minutes of inactivity.

### Issue 2: CORS Configuration
Backend needs to allow requests from your Vercel frontend.

---

## Solution 1: Fix CORS Configuration in Render

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service**
3. **Go to Environment tab**
4. **Add/Update this environment variable:**

```
FRONTEND_URL=https://onefaithonearchive.vercel.app
```

5. **Click Save Changes**
6. **Wait for Render to redeploy** (2-5 minutes)

---

## Solution 2: Wake Up Render Backend

The backend might be sleeping. To wake it up:

1. **Go to Render Dashboard**: https://dashboard.render.com
2. **Select your backend service**
3. **Click "Manual Deploy" → "Deploy latest commit"**
   - This will wake up the service
   - Or just wait - it will wake up when you make a request (but first request might be slow)

**Alternative:** Visit the health endpoint directly:
- Open: `https://archives-z3xr.onrender.com/api/health`
- This will wake up the service
- Wait 30-60 seconds for it to fully start

---

## Solution 3: Verify Backend is Running

1. **Check Render Dashboard** → Your Service → **Logs**
2. **Look for:**
   ```
   Server running on port 5000
   ```
3. **If you see errors**, check what they are

---

## Solution 4: Test Backend Health

1. **Open in browser:**
   ```
   https://archives-z3xr.onrender.com/api/health
   ```
2. **Should return:**
   ```json
   {
     "status": "OK",
     "message": "One Faith One Archive API is running",
     "timestamp": "..."
   }
   ```
3. **If it doesn't work:**
   - Backend is sleeping or crashed
   - Go to Render Dashboard and check logs
   - Try manual deploy to wake it up

---

## Solution 5: Update CORS Code (Already Fixed)

I've updated the backend code to:
- Allow requests from `https://onefaithonearchive.vercel.app`
- Allow requests from `FRONTEND_URL` environment variable
- Handle CORS preflight requests properly

**After the code is deployed:**
- CORS should work automatically
- Make sure `FRONTEND_URL` is set in Render

---

## Quick Fix Steps

1. **Set environment variable in Render:**
   ```
   FRONTEND_URL=https://onefaithonearchive.vercel.app
   ```

2. **Wake up Render backend:**
   - Visit: `https://archives-z3xr.onrender.com/api/health`
   - Or: Manual deploy in Render Dashboard

3. **Wait 30-60 seconds** for backend to fully start

4. **Try logging in again**

5. **If still not working:**
   - Check Render logs for errors
   - Verify backend is running (check health endpoint)
   - Make sure environment variables are saved

---

## Verify CORS is Working

After fixing, check browser console:
- ✅ Should NOT see CORS errors
- ✅ Login should work
- ✅ API requests should succeed

---

## Common Issues

### Backend Sleeping
**Symptom:** First request after inactivity is slow or fails
**Fix:** Visit health endpoint or wait 30-60 seconds

### CORS Still Blocking
**Symptom:** Still seeing CORS errors
**Fix:** 
1. Verify `FRONTEND_URL` is set in Render
2. Wait for code deployment (CORS fix)
3. Clear browser cache and try again

### Backend Not Starting
**Symptom:** Health endpoint returns error
**Fix:**
1. Check Render logs for startup errors
2. Verify environment variables are correct
3. Try manual deploy

---

## Summary

**Immediate fixes:**
1. Set `FRONTEND_URL=https://onefaithonearchive.vercel.app` in Render
2. Wake up backend: Visit `https://archives-z3xr.onrender.com/api/health`
3. Wait 30-60 seconds
4. Try logging in again

**Long-term:**
- CORS code has been updated (will be deployed)
- Backend will wake up automatically on first request (but may be slow)

