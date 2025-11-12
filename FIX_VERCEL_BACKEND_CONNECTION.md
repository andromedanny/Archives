# Fix: Frontend Can't Connect to Backend on Vercel

## 🐛 The Problem

Your frontend is trying to connect to `localhost:5000` instead of your Render backend.

**Error:**
```
Network Error: Backend server is not responding. Please ensure the backend is running on port 5000.
```

**This means:**
- `VITE_API_URL` environment variable is not set in Vercel, OR
- Frontend was deployed before adding the environment variable (needs redeploy)

---

## ✅ Solution

### Step 1: Verify Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Open your project: `onefaithonearchive`
   - Click "Settings" tab
   - Click "Environment Variables" in left sidebar

2. **Check if `VITE_API_URL` exists**
   - Look for `VITE_API_URL` in the list
   - If it doesn't exist, you need to add it (see Step 2)
   - If it exists, check the value (see Step 3)

### Step 2: Add Environment Variable (if missing)

1. **Click "Add New"**
2. **Enter:**
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url.onrender.com` with your actual Render backend URL
     - **Important**: Must include `/api` at the end!
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
3. **Click "Save"**

### Step 3: Verify Environment Variable Value

**Check the value is correct:**
- Should be: `https://your-backend-url.onrender.com/api`
- Should **NOT** be: `http://localhost:5000/api`
- Should **NOT** be empty

**If value is wrong:**
1. Click "Edit" on the variable
2. Update the value to your Render backend URL + `/api`
3. Click "Save"

### Step 4: Redeploy Frontend

**⚠️ IMPORTANT: You MUST redeploy after adding/updating environment variables!**

1. **Go to "Deployments" tab**
2. **Click the three dots (⋯) on the latest deployment**
3. **Click "Redeploy"**
4. **Wait for redeploy** (2-3 minutes)
5. **Test again**

---

## 🔍 How to Find Your Render Backend URL

1. **Go to Render Dashboard**
   - https://dashboard.render.com
   - Open your backend service

2. **Look at the top of the page**
   - You'll see your service URL
   - Example: `https://faith-thesis-backend.onrender.com`

3. **Add `/api` to the end**
   - Example: `https://faith-thesis-backend.onrender.com/api`
   - This is your `VITE_API_URL` value

---

## 🧪 Test Your Backend

Before setting the environment variable, test your backend:

1. **Open your browser**
2. **Go to**: `https://your-backend-url.onrender.com/api/health`
3. **Should see**: `{"status":"OK","message":"One Faith One Archive API is running",...}`

**If this doesn't work:**
- Your backend might not be running
- Check Render logs for errors
- Make sure backend is deployed and running

---

## 📋 Complete Checklist

- [ ] Found your Render backend URL
- [ ] Added `/api` to the end
- [ ] Added `VITE_API_URL` in Vercel
- [ ] Set value to: `https://your-backend.onrender.com/api`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved the variable
- [ ] **Redeployed frontend** ⚠️ **IMPORTANT!**
- [ ] Tested backend URL in browser (should work)
- [ ] Tested login on Vercel site (should work now)

---

## 🐛 Troubleshooting

### Still Getting "Backend server is not responding"

**Check:**
1. Is `VITE_API_URL` set in Vercel? ✅
2. Did you redeploy after adding it? ⚠️ **This is often the issue!**
3. Is the value correct? (includes `/api` at the end)
4. Is your backend running on Render? (test `/api/health`)

### CORS Errors

**If you see CORS errors:**
1. Go to Render Dashboard → Your backend service → Environment
2. Make sure `FRONTEND_URL` is set to: `https://onefaithonearchive.vercel.app`
3. Save and wait for Render to redeploy

### Timeout Errors

**If you see timeout errors:**
1. Check if backend is running on Render
2. Test backend URL: `https://your-backend.onrender.com/api/health`
3. Check Render logs for errors

---

## 🎯 Quick Fix Steps

1. **Go to Vercel → Settings → Environment Variables**
2. **Add/Update `VITE_API_URL`:**
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-url.onrender.com/api`
   - Environment: All
3. **Save**
4. **Go to Deployments → Redeploy** ⚠️ **MUST DO THIS!**
5. **Wait for redeploy**
6. **Test login again**

---

## ✅ After Fixing

Once you've:
1. ✅ Added `VITE_API_URL` in Vercel
2. ✅ Set it to your Render backend URL + `/api`
3. ✅ Redeployed frontend
4. ✅ Verified backend is running

Your login should work! 🎉

---

## 🔗 Quick Links

- **Your Vercel Site**: https://onefaithonearchive.vercel.app
- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com

---

## 💡 Pro Tip

**Always redeploy after adding/updating environment variables!**

Environment variables are baked into the build at build time. If you add a variable after deployment, you need to rebuild (redeploy) for it to take effect.

---

## 📝 Summary

**The Issue:**
- Frontend is trying to connect to `localhost:5000` instead of Render backend
- `VITE_API_URL` is either missing or frontend needs to be redeployed

**The Fix:**
1. Add `VITE_API_URL` in Vercel
2. Set it to your Render backend URL + `/api`
3. **Redeploy frontend** ⚠️ **CRITICAL!**
4. Test again

That's it! 🚀


