# Vercel Environment Variables Setup

## 🎯 What Environment Variable You Need

You need to add **ONE** environment variable in Vercel:

### `VITE_API_URL`

This tells your frontend where to find your backend API.

---

## 📋 Step-by-Step Setup

### Step 1: Get Your Render Backend URL

1. **Go to Render Dashboard**
   - Open your backend service
   - Look at the top of the page
   - You'll see your service URL
   - Example: `https://faith-thesis-backend.onrender.com`

2. **Add `/api` to the end**
   - Your backend URL: `https://faith-thesis-backend.onrender.com`
   - Add `/api`: `https://faith-thesis-backend.onrender.com/api`
   - This is your `VITE_API_URL` value

### Step 2: Add Environment Variable in Vercel

1. **Go to Vercel Dashboard**
   - Open your project
   - Click on "Settings" tab
   - Click on "Environment Variables" in the left sidebar

2. **Add New Variable**
   - Click "Add New" button
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url.onrender.com` with your actual Render backend URL
     - **Make sure to include `/api` at the end!**
   - **Environment**: Select all three:
     - ☑️ Production
     - ☑️ Preview
     - ☑️ Development
   - Click "Save"

### Step 3: Redeploy (if already deployed)

1. **Go to Deployments tab**
2. Click the three dots (⋯) on the latest deployment
3. Click "Redeploy"
4. Wait for redeploy (2-3 minutes)

**Note:** If you haven't deployed yet, the environment variable will be used automatically on first deploy.

---

## ✅ Example

**Your Render Backend URL:**
```
https://faith-thesis-backend.onrender.com
```

**Your VITE_API_URL Value:**
```
https://faith-thesis-backend.onrender.com/api
```

**In Vercel Environment Variables:**
```
Key: VITE_API_URL
Value: https://faith-thesis-backend.onrender.com/api
Environment: Production, Preview, Development (all selected)
```

---

## 🔍 How to Verify

### Check Your Render Backend URL

1. Go to Render Dashboard
2. Open your backend service
3. Look at the top - you'll see your service URL
4. Copy that URL
5. Add `/api` to the end

### Test Your Backend

1. Open your browser
2. Go to: `https://your-backend-url.onrender.com/api/health`
3. Should see: `{"status":"OK","message":"One Faith One Archive API is running",...}`
4. If this works, your backend URL is correct!

---

## 📋 Quick Checklist

- [ ] Got your Render backend URL
- [ ] Added `/api` to the end
- [ ] Added `VITE_API_URL` in Vercel
- [ ] Set value to: `https://your-backend.onrender.com/api`
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Saved the variable
- [ ] Redeployed (if needed)

---

## 🐛 Troubleshooting

### Frontend Can't Connect to Backend

**Check:**
1. Is `VITE_API_URL` set in Vercel?
2. Does it include `/api` at the end?
3. Is your backend running on Render?
4. Test backend URL: `https://your-backend.onrender.com/api/health`

### CORS Errors

**Solution:**
1. Make sure `FRONTEND_URL` is set in Render
2. Set it to your Vercel URL: `https://your-app.vercel.app`
3. Wait for Render to redeploy

### Environment Variable Not Working

**Solution:**
1. Make sure variable name is exactly: `VITE_API_URL`
2. Must start with `VITE_` for Vite to expose it
3. Redeploy after adding the variable
4. Clear browser cache and hard refresh

---

## 🎯 Summary

**What to do:**
1. Get your Render backend URL
2. Add `/api` to the end
3. Add `VITE_API_URL` in Vercel with that value
4. Select all environments
5. Save and redeploy

**Example:**
```
Key: VITE_API_URL
Value: https://faith-thesis-backend.onrender.com/api
```

That's it! 🎉

---

## 💡 Pro Tips

1. **Always include `/api`**: Your backend serves API at `/api` route
2. **Use HTTPS**: Always use `https://` not `http://`
3. **Test First**: Test your backend URL in browser before adding to Vercel
4. **All Environments**: Select all environments so it works everywhere
5. **Redeploy**: Always redeploy after adding environment variables

---

## 🔗 Quick Links

- **Vercel Dashboard**: https://vercel.com/dashboard
- **Render Dashboard**: https://dashboard.render.com
- **Test Backend**: `https://your-backend.onrender.com/api/health`

---

## 📝 Notes

- Environment variables starting with `VITE_` are exposed to the frontend
- They are replaced at build time
- You need to redeploy for changes to take effect
- You can use different values for different environments if needed

---

## ✅ After Setup

Once you've added the environment variable:
1. ✅ Frontend will know where to find the backend
2. ✅ API calls will go to your Render backend
3. ✅ Your app will work end-to-end!

---

## 🚀 Next Steps

After adding environment variable:
1. Redeploy your frontend
2. Test login
3. Test creating a thesis
4. Verify everything works!

That's it! Your frontend will now connect to your backend! 🎉


