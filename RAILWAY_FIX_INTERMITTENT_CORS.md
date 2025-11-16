# Railway Fix: Intermittent CORS Errors

## 🚨 Error Message

```
Access to XMLHttpRequest at 'https://archives-production-4f1d.up.railway.app/api/auth/register-data' 
from origin 'https://onefaithonearchive.vercel.app' has been blocked by CORS policy: 
No 'Access-Control-Allow-Origin' header is present on the requested resource.

Failed to load resource: net::ERR_FAILED
```

**Problem**: CORS errors occur intermittently - works for a few minutes, then stops working after logging out and reloading.

---

## 🔍 Root Cause

The backend is not responding properly or CORS headers are not being sent. This can happen when:

1. **Backend crashes or stops responding**
2. **CORS middleware is not handling OPTIONS requests correctly**
3. **Backend is overloaded or timing out**
4. **Database connection issues causing the backend to hang**
5. **Railway service is restarting or having issues**

---

## ✅ Solution: Improve CORS Configuration

### Step 1: Update CORS Configuration in Backend

The current CORS configuration should work, but we need to ensure it handles all cases properly, especially OPTIONS preflight requests.

1. **Check Railway logs** for errors:
   - Go to Railway Dashboard → Your Service → Deployments → Logs
   - Look for errors, crashes, or database connection issues

2. **Verify `FRONTEND_URL` is set in Railway**:
   - Go to Railway Dashboard → Your Service → Variables tab
   - Check if `FRONTEND_URL` is set to: `https://onefaithonearchive.vercel.app`
   - If not set, add it:
     - Key: `FRONTEND_URL`
     - Value: `https://onefaithonearchive.vercel.app`
     - Click "Add"

3. **Verify backend is running**:
   - Test health endpoint: `https://archives-production-4f1d.up.railway.app/api/health`
   - Should return: `{ "status": "OK", ... }`
   - If not, backend is not running - check Railway logs

---

### Step 2: Improve CORS Middleware

Update the CORS configuration to be more explicit and handle edge cases:

1. **Go to `backend/server.js`**
2. **Update CORS configuration** (see below)
3. **Redeploy Railway backend**

---

### Step 3: Add Health Check Endpoint

Ensure the health endpoint is accessible and responding:

1. **Test health endpoint**: `https://archives-production-4f1d.up.railway.app/api/health`
2. **Should return**: `{ "status": "OK", ... }`
3. **If not working**, check Railway logs for errors

---

### Step 4: Check Database Connection

Database connection issues can cause the backend to hang or crash:

1. **Check Railway logs** for database connection errors
2. **Verify `DATABASE_URL` is set correctly** in Railway
3. **Test database connection** (check Railway logs)
4. **See `RAILWAY_FIX_DATABASE_CONNECTION.md`** for detailed fix

---

## 🔧 Code Fix: Update CORS Configuration

Update `backend/server.js` to improve CORS handling:

```javascript
// CORS configuration - Improved version
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://onefaithonearchive.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173'
].filter(Boolean);

// CORS middleware - Handle all requests including OPTIONS
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Allow requests from allowed origins or if no origin (like mobile apps)
  if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
    res.header('Access-Control-Allow-Credentials', 'true');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
  }
  
  next();
});

// Also use cors middleware as fallback
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      // Still allow but log warning
      console.warn('CORS: Allowing origin:', origin);
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  preflightContinue: false,
  optionsSuccessStatus: 200
}));
```

**Note**: This adds explicit CORS headers and handles OPTIONS requests properly.

---

## 🚨 Common Issues

### Issue 1: Backend Not Responding

**Problem**: Backend stops responding after a few requests

**Solution**:
1. **Check Railway logs** for errors or crashes
2. **Check database connection** (database issues can cause backend to hang)
3. **Restart Railway service**:
   - Go to Railway Dashboard → Your Service → Settings
   - Click "Restart" or redeploy
4. **Check Railway service status**:
   - Go to Railway Dashboard → Your Service → Deployments
   - Check if service is running
   - Check logs for errors

---

### Issue 2: CORS Headers Not Sent

**Problem**: CORS headers are not being sent in response

**Solution**:
1. **Update CORS configuration** (see code fix above)
2. **Ensure CORS middleware is before routes**:
   - CORS middleware should be before `app.use('/api/auth', authRoutes)`
   - Check `server.js` order
3. **Verify `FRONTEND_URL` is set** in Railway
4. **Redeploy Railway backend** after updating CORS

---

### Issue 3: Database Connection Issues

**Problem**: Database connection issues cause backend to hang or crash

**Solution**:
1. **Check Railway logs** for database connection errors
2. **Verify `DATABASE_URL` is set correctly** in Railway
3. **Check Supabase database** is running
4. **See `RAILWAY_FIX_DATABASE_CONNECTION.md`** for detailed fix

---

### Issue 4: Railway Service Restarting

**Problem**: Railway service is restarting frequently

**Solution**:
1. **Check Railway logs** for restart reasons
2. **Check Railway service status**:
   - Go to Railway Dashboard → Your Service → Deployments
   - Check deployment history
   - Look for failed deployments
3. **Check resource usage**:
   - Go to Railway Dashboard → Your Service → Metrics
   - Check CPU and memory usage
   - If high, consider upgrading Railway plan

---

## 📋 Checklist

- [ ] `FRONTEND_URL` is set in Railway to `https://onefaithonearchive.vercel.app`
- [ ] CORS configuration is correct in `server.js`
- [ ] Health endpoint works: `https://archives-production-4f1d.up.railway.app/api/health`
- [ ] Database connection is working (check Railway logs)
- [ ] Railway service is running (check Railway dashboard)
- [ ] No errors in Railway logs
- [ ] CORS headers are being sent (check browser Network tab)
- [ ] OPTIONS requests are handled correctly

---

## 🎯 Quick Fix

### 1. Verify `FRONTEND_URL` is Set

1. **Go to Railway Dashboard** → Your Service → Variables tab
2. **Check if `FRONTEND_URL` exists**:
   - If not, add it: `https://onefaithonearchive.vercel.app`
   - If exists, verify it's correct
3. **Redeploy Railway backend** (Railway will auto-redeploy when you add variables)

### 2. Test Health Endpoint

1. **Visit**: `https://archives-production-4f1d.up.railway.app/api/health`
2. **Should return**: `{ "status": "OK", ... }`
3. **If not**, check Railway logs for errors

### 3. Check Railway Logs

1. **Go to Railway Dashboard** → Your Service → Deployments → Latest deployment → Logs
2. **Look for**:
   - Database connection errors
   - CORS errors
   - Server crashes
   - Any error messages

### 4. Restart Railway Service

1. **Go to Railway Dashboard** → Your Service → Settings
2. **Redeploy service**:
   - Go to Deployments tab
   - Click "Redeploy" on latest deployment
   - Or push a new commit to trigger redeploy

---

## 🔍 Debugging

### Check Browser Network Tab

1. **Open browser DevTools** (F12 → Network tab)
2. **Try to register or make a request**
3. **Check the request**:
   - Status code: Should be 200 (not failed)
   - Response headers: Should include `Access-Control-Allow-Origin`
   - Request URL: Should be correct
4. **If request fails**:
   - Check error message
   - Check if backend is responding
   - Check CORS headers in response

### Check Railway Logs

1. **Go to Railway Dashboard** → Your Service → Deployments → Latest deployment → Logs
2. **Look for**:
   - Incoming requests (should see requests from Vercel)
   - CORS-related logs
   - Database connection logs
   - Any error messages

---

## ✅ Verification

After fixing, verify:

1. **Health endpoint works**:
   - Visit: `https://archives-production-4f1d.up.railway.app/api/health`
   - Should return: `{ "status": "OK", ... }`

2. **CORS headers are sent**:
   - Open browser DevTools → Network tab
   - Make a request from frontend
   - Check response headers: Should include `Access-Control-Allow-Origin`

3. **No CORS errors**:
   - Try to register or login
   - Should not see CORS errors in browser console
   - Should work without errors

---

## 🆘 Still Having Issues?

1. **Check Railway logs** for specific errors
2. **Test health endpoint** to verify backend is running
3. **Check database connection** (see `RAILWAY_FIX_DATABASE_CONNECTION.md`)
4. **Restart Railway service** (redeploy)
5. **Verify `FRONTEND_URL` is set** in Railway
6. **Update CORS configuration** (see code fix above)
7. **Check browser console** for specific error messages

---

## 📚 Related Guides

- **RAILWAY_FIX_CORS_AND_FRONTEND_URL.md** - CORS and frontend URL fix
- **RAILWAY_FIX_DATABASE_CONNECTION.md** - Database connection fix
- **RAILWAY_DEPLOY_STEP_BY_STEP.md** - Complete deployment guide

---

## 🎉 Success!

Once the issue is fixed:
- ✅ No CORS errors
- ✅ Backend responds consistently
- ✅ All API requests work
- ✅ Registration and login work
- ✅ App works reliably

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

