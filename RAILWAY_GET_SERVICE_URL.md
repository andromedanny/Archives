# How to Get Your Railway Service URL

Your Railway project has **two different URLs**:

1. **Project Dashboard URL** (for managing your project)
2. **Service/API URL** (for your frontend to connect to)

---

## 🎯 What You Need

You need the **Service/API URL** (not the project dashboard URL) for your frontend.

**Format**: `https://your-project-name.railway.app` or `https://your-service-name.up.railway.app`

---

## 🚀 Step 1: Open Your Railway Project

1. **Go to your Railway project**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service you created)
3. You should see your service dashboard

---

## 🚀 Step 2: Get Service URL from Settings

### Method 1: From Settings Tab (Recommended)

1. **Click on "Settings" tab** (top menu)
2. **Scroll down to "Domains" section**
3. **Look for "Railway Domain"** or **"Public Domain"**
4. **Copy the domain**:
   - Format: `https://your-project-name.railway.app`
   - Example: `https://archives-backend.railway.app`
5. **This is your service URL! ✅**

### Method 2: From Service Overview

1. **Click on your service** (in the project dashboard)
2. **Look at the service overview page**
3. **Find "Domains" or "URL" section**
4. **Copy the domain shown there**

### Method 3: From Deployments

1. **Go to "Deployments" tab**
2. **Click on the latest deployment**
3. **Look for "Service URL" or "Public URL"**
4. **Copy the URL shown there**

---

## 🚀 Step 3: Test Your Service URL

1. **Open your browser**
2. **Visit**: `https://your-project-name.railway.app/api/health`
3. **You should see**:
   ```json
   {
     "status": "OK",
     "message": "One Faith One Archive API is running",
     "timestamp": "2024-01-01T00:00:00.000Z"
   }
   ```
4. **If you see this, your service URL is correct! ✅**

---

## 🚀 Step 4: Update Frontend (Vercel)

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `onefaithonearchive`
3. **Go to Settings** → **Environment Variables**
4. **Add or update**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-project-name.railway.app/api` (use your Railway service URL)
   - **Environment**: Production, Preview, Development (select all)
5. **Click "Save"**
6. **Redeploy frontend**:
   - Go to **Deployments** tab
   - Click **"..."** → **"Redeploy"**

---

## 🔍 How to Identify the Correct URL

### ✅ Correct Service URL (What You Need):
- Format: `https://something.railway.app`
- Ends with `.railway.app`
- Can be accessed in browser
- Returns JSON when you visit `/api/health`

### ❌ Project Dashboard URL (Not What You Need):
- Format: `https://railway.com/project/...`
- Contains `/project/` in the path
- Used for managing your project
- Not an API endpoint

---

## 🚨 Common Issues

### Issue 1: No Domain Shown

**Problem**: No domain is shown in Settings → Domains

**Solution**:
1. Make sure your service is deployed successfully
2. Check **Deployments** tab for deployment status
3. Wait a few minutes for Railway to generate the domain
4. Try refreshing the page

### Issue 2: Domain Not Working

**Problem**: Domain returns 404 or connection error

**Solution**:
1. Check service is running (check **Deployments** → **Logs**)
2. Verify **Root Directory** is set to `backend` (Settings → Source)
3. Verify **Start Command** is `npm start` (Settings → Source)
4. Check environment variables are set correctly
5. Wait a few minutes for DNS to propagate

### Issue 3: Health Endpoint Not Working

**Problem**: `/api/health` returns 404

**Solution**:
1. Verify your service is running (check logs)
2. Check **Root Directory** is `backend`
3. Verify `server.js` exists in `backend/` folder
4. Check **Deployments** → **Logs** for errors
5. Make sure all environment variables are set

---

## 📋 Quick Checklist

- [ ] Railway project is created
- [ ] Service is deployed successfully
- [ ] Service URL is found in Settings → Domains
- [ ] Service URL format: `https://something.railway.app`
- [ ] Health endpoint works: `https://your-service.railway.app/api/health`
- [ ] Frontend `VITE_API_URL` is updated
- [ ] Frontend is redeployed

---

## 🎯 Summary

**Your Railway Project Dashboard URL** (for managing):
- `https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4` ✅

**Your Railway Service URL** (for frontend - need to find this):
- `https://your-project-name.railway.app` ← **Get this from Settings → Domains**

**Your Frontend API URL** (for Vercel):
- `https://your-project-name.railway.app/api` ← **Use this in VITE_API_URL**

---

## 🆘 Still Can't Find It?

1. **Check Railway Dashboard** → Your Service → **Settings** → **Domains**
2. **Check Railway Dashboard** → Your Service → **Deployments** → Latest deployment → **Logs**
3. **Check Railway Dashboard** → Your Service → **Overview** page
4. **Contact Railway Support**: https://railway.app/help

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

