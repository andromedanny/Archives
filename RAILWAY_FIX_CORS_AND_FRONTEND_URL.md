# Railway Fix: CORS Error and Frontend URL

## 🚨 Error Message

```
Access to XMLHttpRequest at 'https://archives-z3xr.onrender.com/api/auth/login' 
from origin 'https://onefaithonearchive.vercel.app' has been blocked by CORS policy: 
Response to preflight request doesn't pass access control check: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.

Backend URL: https://archives-z3xr.onrender.com/api
```

**Problem**: Your frontend is still trying to connect to the **old Render backend** instead of your **new Railway backend**.

---

## ✅ Solution: Update Frontend to Use Railway URL

### Step 1: Get Your Railway Service URL

1. **Go to Railway Dashboard**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service)
3. **Go to "Settings" tab** (top menu)
4. **Scroll down to "Domains" section**
5. **Copy the Railway domain**:
   - Format: `https://your-project-name.railway.app`
   - Example: `https://archives-backend.railway.app`
6. **This is your Railway service URL** ✅

---

### Step 2: Update Vercel Environment Variable

1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `onefaithonearchive`
3. **Go to Settings** → **Environment Variables** (left sidebar)
4. **Find `VITE_API_URL`**:
   - If it exists, **update it** (click edit)
   - If it doesn't exist, **add it** (click "Add New")
5. **Set the value**:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-railway-service.railway.app/api` (use your Railway URL from Step 1)
   - **Example**: `https://archives-backend.railway.app/api`
   - **Environment**: Select **Production**, **Preview**, and **Development** (all three)
6. **Click "Save"**

---

### Step 3: Redeploy Vercel Frontend

1. **Go to "Deployments" tab** (top menu)
2. **Find the latest deployment**
3. **Click "..."** (three dots) on the latest deployment
4. **Click "Redeploy"**
5. **Wait for redeployment to complete** (usually 1-2 minutes)

---

### Step 4: Verify Railway CORS Configuration

Make sure your Railway backend allows your Vercel frontend:

1. **Go to Railway Dashboard** → Your Service → **Variables tab**
2. **Check if `FRONTEND_URL` is set**:
   - **Key**: `FRONTEND_URL`
   - **Value**: `https://onefaithonearchive.vercel.app`
   - If not set, **add it**:
     - Click "New Variable"
     - Key: `FRONTEND_URL`
     - Value: `https://onefaithonearchive.vercel.app`
     - Click "Add"
3. **Railway will automatically redeploy** after adding the variable

---

### Step 5: Test the Connection

1. **Open your frontend**: `https://onefaithonearchive.vercel.app`
2. **Try to login**
3. **Check browser console** (F12 → Console tab):
   - Should see requests to Railway URL: `https://your-railway-service.railway.app/api`
   - Should **NOT** see requests to Render URL: `https://archives-z3xr.onrender.com/api`
4. **Check for CORS errors**:
   - If still getting CORS errors, see troubleshooting below
   - If login works, you're done! ✅

---

## 🔍 Why This Happens

### Problem 1: Frontend Still Using Render URL

**Issue**: Frontend `VITE_API_URL` is set to Render URL:
- Old: `https://archives-z3xr.onrender.com/api`
- Should be: `https://your-railway-service.railway.app/api`

**Solution**: Update `VITE_API_URL` in Vercel to Railway URL.

---

### Problem 2: Railway CORS Not Configured

**Issue**: Railway backend doesn't allow requests from Vercel frontend.

**Solution**: Set `FRONTEND_URL` in Railway to `https://onefaithonearchive.vercel.app`.

---

## 📋 Checklist

- [ ] Railway service URL obtained (from Settings → Domains)
- [ ] `VITE_API_URL` updated in Vercel to Railway URL
- [ ] `FRONTEND_URL` set in Railway to Vercel URL
- [ ] Vercel frontend redeployed
- [ ] Railway backend redeployed (after adding `FRONTEND_URL`)
- [ ] Frontend now uses Railway URL (check browser console)
- [ ] Login works without CORS errors

---

## 🚨 Troubleshooting

### Issue 1: Still Getting CORS Error

**Problem**: Still getting CORS error after updating URLs

**Solution**:
1. **Verify `FRONTEND_URL` is set in Railway**:
   - Go to Railway Dashboard → Your Service → Variables tab
   - Check if `FRONTEND_URL` exists
   - Value should be: `https://onefaithonearchive.vercel.app`
   - If not set, add it and wait for redeployment

2. **Verify `VITE_API_URL` is updated in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Check if `VITE_API_URL` is set to Railway URL
   - Value should be: `https://your-railway-service.railway.app/api`
   - If not, update it and redeploy

3. **Check Railway logs**:
   - Go to Railway Dashboard → Your Service → Deployments → Logs
   - Look for CORS-related errors
   - Verify `FRONTEND_URL` is being read correctly

4. **Clear browser cache**:
   - Clear browser cache and cookies
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try again

---

### Issue 2: Frontend Still Using Render URL

**Problem**: Frontend is still trying to connect to Render URL

**Solution**:
1. **Verify `VITE_API_URL` is set correctly in Vercel**:
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - Check if `VITE_API_URL` is set to Railway URL
   - If it's still set to Render URL, update it

2. **Verify Vercel is redeployed**:
   - Go to Vercel Dashboard → Deployments tab
   - Check if latest deployment is after updating `VITE_API_URL`
   - If not, redeploy manually

3. **Check browser console**:
   - Open browser console (F12 → Console)
   - Look for "Backend URL: ..."
   - Should show Railway URL, not Render URL

4. **Clear browser cache**:
   - Clear browser cache and cookies
   - Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
   - Try again

---

### Issue 3: Railway Service URL Not Found

**Problem**: Cannot find Railway service URL

**Solution**:
1. **Check Railway service is deployed**:
   - Go to Railway Dashboard → Your Service → Deployments tab
   - Verify deployment is successful
   - Check logs for any errors

2. **Check Settings → Domains**:
   - Go to Railway Dashboard → Your Service → Settings tab
   - Scroll down to "Domains" section
   - Railway domain should be shown there
   - If not shown, wait a few minutes for Railway to generate it

3. **Check service is running**:
   - Go to Railway Dashboard → Your Service → Deployments → Logs
   - Verify service is running (should see "Server running on port 5000")

---

### Issue 4: Health Endpoint Not Working

**Problem**: Cannot access Railway health endpoint

**Solution**:
1. **Test health endpoint**:
   - Visit: `https://your-railway-service.railway.app/api/health`
   - Should return: `{ "status": "OK", ... }`

2. **If health endpoint doesn't work**:
   - Check Railway service is deployed successfully
   - Check Railway logs for errors
   - Verify Root Directory is set to `backend`
   - Verify Start Command is `npm start`

---

## ✅ Verification

After updating URLs, verify:

1. **Frontend uses Railway URL**:
   - Open browser console (F12 → Console)
   - Look for "Backend URL: https://your-railway-service.railway.app/api"
   - Should **NOT** see Render URL

2. **No CORS errors**:
   - Try to login
   - Should not see CORS errors in console
   - Login should work

3. **Railway logs show requests**:
   - Go to Railway Dashboard → Your Service → Deployments → Logs
   - Should see incoming requests from Vercel frontend
   - Should see successful responses

---

## 🎯 Quick Fix Summary

1. **Get Railway service URL** (Settings → Domains)
2. **Update `VITE_API_URL` in Vercel** to Railway URL
3. **Set `FRONTEND_URL` in Railway** to Vercel URL
4. **Redeploy Vercel frontend**
5. **Redeploy Railway backend** (if needed)
6. **Test login** - should work without CORS errors

---

## 📚 Related Guides

- **RAILWAY_DEPLOY_STEP_BY_STEP.md** - Complete deployment guide
- **RAILWAY_GET_SERVICE_URL.md** - How to get Railway service URL
- **RAILWAY_SETUP_GUIDE.md** - Detailed setup guide

---

## 🎉 Success!

Once everything is configured:
- ✅ Frontend uses Railway URL (not Render)
- ✅ Railway allows requests from Vercel frontend
- ✅ No CORS errors
- ✅ Login works
- ✅ All API calls work

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

