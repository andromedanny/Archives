# Railway Fix: Root Directory Error

## 🚨 Error Message

```
✖ Railpack could not determine how to build the app.
```

This error occurs because Railway is looking at the **root directory** of your repository, which contains both `backend/` and `frontend/` folders, but no `package.json` in the root.

---

## ✅ Solution: Set Root Directory to `backend`

Railway needs to know that your Node.js app is in the `backend/` folder, not the root directory.

---

## 🚀 Step-by-Step Fix

### Step 1: Open Your Railway Service

1. **Go to your Railway project**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service)
3. You should see the service dashboard

---

### Step 2: Go to Settings

1. **Click on "Settings" tab** (top menu)
2. **Scroll down to "Source" section**
3. You should see:
   - **Root Directory**: (currently empty or set to `.` or `/`)
   - **Start Command**: (should be `npm start`)

---

### Step 3: Set Root Directory

1. **Find "Root Directory" field**
2. **Change it to**: `backend`
   - This tells Railway to look in the `backend/` folder for `package.json` and `server.js`
3. **Verify "Start Command"** is: `npm start`
   - This should be auto-detected from `backend/package.json`
4. **Click "Save"** (or the update will be automatic)

---

### Step 4: Wait for Redeployment

1. **Railway will automatically redeploy** when you change the root directory
2. **Go to "Deployments" tab** to see the deployment progress
3. **Wait for deployment to complete** (usually 1-2 minutes)
4. **Check the logs** for any errors

---

### Step 5: Verify Build Success

1. **Go to "Deployments" tab**
2. **Click on the latest deployment**
3. **Check the logs** for:
   - ✅ `Installing dependencies`
   - ✅ `Building application`
   - ✅ `Starting application`
   - ✅ `Server running on port 5000`
   - ✅ `PostgreSQL database connected successfully`

---

## 📋 What Should Be Set

### Settings → Source:

- **Root Directory**: `backend` ✅
- **Start Command**: `npm start` ✅

### Settings → Variables:

Make sure all environment variables are set (see `RAILWAY_ENVIRONMENT_VARIABLES.md`).

---

## 🚨 Common Issues

### Issue 1: Still Getting the Same Error

**Problem**: Error persists after setting root directory

**Solution**:
1. Verify **Root Directory** is exactly `backend` (no leading slash, no trailing slash)
2. Check `backend/package.json` exists in your repository
3. Check `backend/server.js` exists in your repository
4. Wait for deployment to complete
5. Check deployment logs for specific errors

### Issue 2: Build Command Error

**Problem**: Build command not found

**Solution**:
1. Verify **Start Command** is `npm start`
2. Check `backend/package.json` has a `start` script:
   ```json
   {
     "scripts": {
       "start": "node server.js"
     }
   }
   ```
3. Check `backend/server.js` exists

### Issue 3: Dependencies Not Found

**Problem**: Cannot find module errors

**Solution**:
1. Make sure `backend/package.json` exists
2. Make sure `backend/node_modules` is in `.gitignore` (it should be)
3. Railway will install dependencies automatically from `package.json`
4. Check deployment logs for missing dependencies

---

## ✅ Verification Checklist

- [ ] Root Directory is set to `backend`
- [ ] Start Command is `npm start`
- [ ] `backend/package.json` exists in repository
- [ ] `backend/server.js` exists in repository
- [ ] Deployment completed successfully
- [ ] Logs show "Server running on port 5000"
- [ ] Logs show "PostgreSQL database connected successfully"
- [ ] Health endpoint works: `https://your-service.railway.app/api/health`

---

## 🎯 Quick Fix Summary

1. **Go to Railway Dashboard** → Your Service → **Settings**
2. **Set Root Directory**: `backend`
3. **Verify Start Command**: `npm start`
4. **Save and wait for redeployment**
5. **Check logs for success**

---

## 📚 Related Guides

- **RAILWAY_DEPLOY_STEP_BY_STEP.md** - Complete deployment guide
- **RAILWAY_SETUP_GUIDE.md** - Detailed setup guide
- **RAILWAY_ENVIRONMENT_VARIABLES.md** - All environment variables

---

## 🆘 Still Having Issues?

1. **Check Railway logs** (Deployments → Logs)
2. **Verify repository structure** (make sure `backend/` folder exists)
3. **Check `backend/package.json`** exists and has `start` script
4. **Verify environment variables** are set correctly
5. **Contact Railway Support**: https://railway.app/help

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

