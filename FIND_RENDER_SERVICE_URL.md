# How to Find Your Render Backend Service URL

## 🎯 The Issue

You're looking at the deployment log URL, but you need the **service URL** to test your API.

## 📍 Where to Find Your Service URL

### Step 1: Go to Render Dashboard

1. **Go to Render Dashboard**
   - Visit https://dashboard.render.com
   - Login to your account

2. **Go to Your Service**
   - Click on "Services" in the left sidebar
   - OR click on your service name in the dashboard
   - You should see your service: `faith-thesis-backend` (or whatever you named it)

### Step 2: Find Your Service URL

1. **On Your Service Page**
   - Look at the top of the page
   - You'll see your service name and URL
   - The URL will look like: `https://faith-thesis-backend.onrender.com`
   - Or: `https://[random-name].onrender.com`

2. **Copy the URL**
   - This is your backend service URL
   - Use this to test your API endpoints

### Step 3: Test Your Health Endpoint

1. **Your Service URL + `/api/health`**
   - Example: `https://faith-thesis-backend.onrender.com/api/health`
   - Replace `faith-thesis-backend` with your actual service name

2. **Visit in Browser**
   - Should return: `{ status: 'OK', message: 'One Faith One Archive API is running' }`

## 🔍 Alternative: Find URL in Render Dashboard

### Method 1: Service Overview Page
- Go to your service page
- Look at the top - service URL is displayed there
- Format: `https://[service-name].onrender.com`

### Method 2: Settings Page
- Go to your service → Settings
- Look for "Service URL" or "URL"
- Copy the URL

### Method 3: Service List
- Go to Render Dashboard → Services
- Your service URL is displayed next to the service name

## 📋 Your Service URL Format

**Your service URL will be:**
```
https://[your-service-name].onrender.com
```

**To test health endpoint:**
```
https://[your-service-name].onrender.com/api/health
```

## 🎯 Quick Steps

1. ✅ Go to Render Dashboard
2. ✅ Click on "Services" (left sidebar)
3. ✅ Click on your backend service
4. ✅ Copy the service URL (displayed at the top)
5. ✅ Test: `https://your-service-url.onrender.com/api/health`

## 🚨 Common Issues

### Can't Find Service URL?
- **Check Service List**: Go to Services → Your service name
- **Check Service Page**: URL is displayed at the top
- **Check Settings**: Go to Settings → Service URL

### Service URL Not Working?
- **Check Deployment Status**: Make sure deployment is successful (green checkmark)
- **Check Logs**: See if server is running
- **Wait for Deployment**: First deployment takes 5-10 minutes
- **Check Health Endpoint**: Try `/api/health` endpoint

### Getting 404 Not Found?
- **Check URL**: Make sure you're using the service URL, not deployment URL
- **Check Route**: Health endpoint is at `/api/health`
- **Check Server**: Make sure server is running (check logs)

## ✅ Example

**Your Deployment URL (what you have):**
```
https://dashboard.render.com/web/srv-d494lqa4d50c7394i7ng/deploys/...
```
❌ This is for viewing logs, not for API access

**Your Service URL (what you need):**
```
https://faith-thesis-backend.onrender.com
```
✅ This is for API access

**To test health endpoint:**
```
https://faith-thesis-backend.onrender.com/api/health
```
✅ This should work!

## 🎯 Next Steps

1. ✅ Find your service URL in Render dashboard
2. ✅ Test health endpoint: `https://your-service-url.onrender.com/api/health`
3. ✅ If it works, proceed to set up database tables
4. ✅ If it doesn't work, check Render logs for errors

## 💡 Pro Tip

**Your service name is usually:**
- The name you gave it when creating the service
- Or Render auto-generated a name
- Check your service page to see the exact name

**To find it:**
1. Go to Render Dashboard
2. Click "Services"
3. Look for your backend service
4. The URL is displayed next to the service name

