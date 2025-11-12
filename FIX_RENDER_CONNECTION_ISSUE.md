# Fix Render Backend Connection Issue

## 🚨 Problem: `archives-z3xr.onrender.com refused to connect`

This error means your Render backend service is either:
1. **Sleeping** (Render free tier sleeps after 15 min inactivity)
2. **Not running** (service crashed or stopped)
3. **Wrong URL** (service URL changed)
4. **Build failed** (deployment error)

---

## ✅ Quick Fixes

### Fix 1: Wake Up the Service (Most Common)

**Render free tier services sleep after 15 minutes of inactivity.**

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Login to your account
   - Find your backend service: `archives-z3xr` or similar

2. **Check Service Status**
   - Look at the service status indicator
   - If it says "Sleeping" or "Stopped", click "Manual Deploy" or "Restart"

3. **Wait for Service to Start**
   - First request after sleep takes 15-30 seconds
   - Service will wake up automatically on first request
   - Subsequent requests will be fast

4. **Test the Service**
   - Go to: `https://archives-z3xr.onrender.com/api/health`
   - Should see: `{"status":"OK","message":"One Faith One Archive API is running",...}`
   - If it works, the service is awake!

---

### Fix 2: Check Service URL

1. **Get Correct Service URL**
   - Go to Render Dashboard
   - Open your backend service
   - Look at the top of the page
   - Copy the service URL (e.g., `https://archives-z3xr.onrender.com`)

2. **Update Frontend Environment Variable**
   - Go to Vercel Dashboard
   - Open your frontend project
   - Go to "Settings" → "Environment Variables"
   - Update `VITE_API_URL` to: `https://archives-z3xr.onrender.com/api`
   - Make sure to include `/api` at the end!
   - Redeploy frontend

---

### Fix 3: Check Service Logs

1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Logs" tab
   - Check for errors

2. **Common Errors:**
   - **Database connection error**: Check `DATABASE_URL` in environment variables
   - **Port error**: Make sure `PORT=10000` is set
   - **Build error**: Check build logs for npm install errors
   - **Start command error**: Verify start command is `npm start`

3. **Fix Errors:**
   - Update environment variables if needed
   - Fix code errors if any
   - Redeploy service

---

### Fix 4: Restart the Service

1. **Manual Restart**
   - Go to Render Dashboard
   - Open your backend service
   - Click "Manual Deploy" → "Clear build cache & deploy"
   - Wait for deployment (5-10 minutes)

2. **Or Use Render Shell**
   - Go to Render Dashboard
   - Open your backend service
   - Click "Shell" tab
   - Run: `npm start` to test locally

---

### Fix 5: Prevent Service from Sleeping (Optional)

**Use Uptime Robot (Free) to keep service awake:**

1. **Create Uptime Robot Account**
   - Go to: https://uptimerobot.com
   - Sign up (free, no credit card)

2. **Add Monitor**
   - Click "Add New Monitor"
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Your Backend Service
   - **URL**: `https://archives-z3xr.onrender.com/api/health`
   - **Monitoring Interval**: 5 minutes
   - Click "Create Monitor"

3. **Result**
   - Service will be pinged every 5 minutes
   - Service will stay awake
   - No more cold starts!

---

## 🔍 Verify Backend is Working

### Step 1: Test Health Endpoint
```
https://archives-z3xr.onrender.com/api/health
```

**Expected Response:**
```json
{
  "status": "OK",
  "message": "One Faith One Archive API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Step 2: Test from Frontend
1. Open your Vercel site
2. Open browser console (F12)
3. Check for network errors
4. Try to login or view a thesis
5. Check if API calls are successful

### Step 3: Check Environment Variables in Render
Make sure these are set:
```
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
JWT_SECRET=your_secret_key
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://onefaithonearchive.vercel.app
```

---

## 🐛 Troubleshooting

### Issue: Service Won't Start
**Solution:**
1. Check build logs for errors
2. Verify `package.json` has correct start script
3. Check environment variables are set
4. Verify database connection is working

### Issue: Service Starts but Crashes
**Solution:**
1. Check logs for error messages
2. Verify database connection string is correct
3. Check if all required environment variables are set
4. Verify port is set to 10000

### Issue: Service Works but Frontend Can't Connect
**Solution:**
1. Verify `VITE_API_URL` in Vercel is correct
2. Check CORS settings in backend
3. Verify `FRONTEND_URL` in Render matches Vercel URL
4. Check browser console for CORS errors

### Issue: Database Connection Fails
**Solution:**
1. Verify `DATABASE_URL` is correct in Render
2. Check Supabase database is accessible
3. Verify database credentials are correct
4. Check Supabase connection pooling settings

---

## 📋 Quick Checklist

- [ ] Service is running (not sleeping)
- [ ] Service URL is correct: `https://archives-z3xr.onrender.com`
- [ ] Health endpoint works: `/api/health`
- [ ] `VITE_API_URL` in Vercel is set correctly
- [ ] `FRONTEND_URL` in Render matches Vercel URL
- [ ] Database connection is working
- [ ] All environment variables are set
- [ ] Service logs show no errors

---

## 🚀 After Fixing

1. **Test Backend:**
   - Visit: `https://archives-z3xr.onrender.com/api/health`
   - Should return OK status

2. **Test Frontend:**
   - Go to your Vercel site
   - Try to login
   - Try to view a thesis
   - Try to view/download PDF

3. **Monitor:**
   - Check Render logs for any errors
   - Check Vercel logs for any errors
   - Monitor service status

---

## 💡 Pro Tips

1. **Use Uptime Robot**: Keeps service awake, prevents cold starts
2. **Monitor Logs**: Check Render logs regularly for errors
3. **Test Health Endpoint**: Use it to verify service is running
4. **Set Up Alerts**: Configure Render to email you on service failures
5. **Use Render Pro**: If you need 24/7 uptime (paid plan)

---

## 📝 Summary

**Most Common Issue:** Service is sleeping (Render free tier)

**Quick Fix:**
1. Go to Render Dashboard
2. Click "Manual Deploy" or wait for first request
3. Service will wake up in 15-30 seconds
4. Test health endpoint

**Long-term Fix:**
- Use Uptime Robot to keep service awake
- Or upgrade to Render Pro for 24/7 uptime

That's it! Your backend should be working now! 🎉

