# Quick Fix: Vercel Frontend Can't Connect to Backend

## 🐛 The Problem

Your frontend on Vercel is trying to connect to `localhost:5000` instead of your Render backend.

**Error:**
```
Network Error: Backend server is not responding. Please ensure the backend is running on port 5000.
```

## ✅ Quick Fix (3 Steps)

### Step 1: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - https://vercel.com/dashboard
   - Open your project: `onefaithonearchive`

2. **Go to Settings → Environment Variables**

3. **Add New Variable:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url.onrender.com` with your actual Render backend URL
     - **Must include `/api` at the end!**
   - **Environment**: Select all (Production, Preview, Development)

4. **Click "Save"**

### Step 2: Find Your Render Backend URL

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Open your backend service

2. **Copy your service URL**
   - Example: `https://faith-thesis-backend.onrender.com`

3. **Add `/api` to the end**
   - Example: `https://faith-thesis-backend.onrender.com/api`
   - This is what you put in `VITE_API_URL`

### Step 3: Redeploy Frontend ⚠️ CRITICAL!

**You MUST redeploy after adding the environment variable!**

1. **Go to Vercel → Deployments tab**
2. **Click the three dots (⋯) on the latest deployment**
3. **Click "Redeploy"**
4. **Wait for redeploy** (2-3 minutes)
5. **Test your site again**

---

## 🧪 Test Your Backend First

Before setting the environment variable, test your backend:

1. **Open your browser**
2. **Go to**: `https://your-backend-url.onrender.com/api/health`
3. **Should see**: `{"status":"OK","message":"One Faith One Archive API is running",...}`

**If this doesn't work:**
- Your backend might not be running
- Check Render logs for errors

---

## 📋 Complete Checklist

- [ ] Found your Render backend URL
- [ ] Added `/api` to the end
- [ ] Added `VITE_API_URL` in Vercel
- [ ] Set value to: `https://your-backend.onrender.com/api`
- [ ] Selected all environments
- [ ] Saved the variable
- [ ] **Redeployed frontend** ⚠️ **MUST DO THIS!**
- [ ] Tested backend URL in browser
- [ ] Tested login on Vercel site

---

## 🔍 Why Redeploy is Critical

**Environment variables are baked into the build at build time!**

- If you add a variable after deployment, it won't be in the existing build
- You MUST redeploy for the variable to be included in the new build
- The new build will have the correct backend URL

---

## 🐛 If Still Not Working

### Check Environment Variable

1. Go to Vercel → Settings → Environment Variables
2. Verify `VITE_API_URL` exists
3. Verify value is correct (includes `/api`)
4. Verify it's selected for Production environment

### Check Backend CORS

1. Go to Render Dashboard → Your backend service → Environment
2. Make sure `FRONTEND_URL` is set to: `https://onefaithonearchive.vercel.app`
3. Save and wait for Render to redeploy

### Check Backend is Running

1. Test backend URL: `https://your-backend.onrender.com/api/health`
2. Check Render logs for errors
3. Make sure backend is deployed and running

---

## ✅ After Fixing

Once you've:
1. ✅ Added `VITE_API_URL` in Vercel
2. ✅ Set it to your Render backend URL + `/api`
3. ✅ Redeployed frontend
4. ✅ Verified backend is running

Your login should work! 🎉

---

## 🎯 Summary

**The Issue:**
- Frontend is using fallback `/api` which doesn't work on Vercel
- `VITE_API_URL` environment variable is not set or not in the build

**The Fix:**
1. Add `VITE_API_URL` in Vercel
2. Set it to your Render backend URL + `/api`
3. **Redeploy frontend** ⚠️ **CRITICAL!**
4. Test again

---

## 💡 Pro Tip

**Always test your backend URL first:**
- Go to: `https://your-backend.onrender.com/api/health`
- Should see: `{"status":"OK",...}`
- If this works, your backend is fine
- Then set `VITE_API_URL` to this URL (with `/api`)

---

## 🚀 Next Steps

After fixing:
1. ✅ Test login
2. ✅ Test creating a thesis
3. ✅ Test all features
4. ✅ Verify everything works end-to-end

That's it! Your frontend will now connect to your backend! 🎉


