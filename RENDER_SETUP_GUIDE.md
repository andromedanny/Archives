# Render Setup Guide - Complete Instructions

## 🚀 Render Backend Configuration

### Step 1: Create Web Service

1. **Go to Render Dashboard**
   - Login at https://render.com
   - Click "New +" → "Web Service"

2. **Connect GitHub Repository**
   - Click "Connect GitHub"
   - Authorize Render to access your repositories
   - Select your repository: `Archives` (or whatever your repo is called)

3. **Configure Service Settings**

   **Basic Settings:**
   - **Name**: `faith-thesis-backend` (or any name you want)
   - **Region**: Choose closest to you (e.g., Oregon, US)
   - **Branch**: `main` (or `master`)
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!**
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start` ⚠️ **This is what you need!**
   - **Plan**: Free

### Step 2: Start Command Explanation

**Start Command: `npm start`**

This command:
- Runs the `start` script defined in `backend/package.json`
- Which runs: `node server.js`
- Which starts your Express.js backend server
- Listens on the port specified in `PORT` environment variable (default: 5000, but Render uses 10000)

**Why `npm start`?**
- It's the standard Node.js command to start production servers
- Your `package.json` already has this script defined
- Render will automatically set the `PORT` environment variable
- Your server will listen on that port

### Step 3: Build Command

**Build Command: `npm install`**

This command:
- Installs all dependencies from `package.json`
- Runs before the start command
- Creates `node_modules` folder with all packages
- Needed for your app to run

### Step 4: Environment Variables

After creating the service, you need to add environment variables:

1. **Click on "Environment" tab** in your Render service
2. **Add these variables:**

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:prodannyHAHA69@db.[project-ref].supabase.co:5432/postgres
DB_TYPE=postgres

# JWT
JWT_SECRET=[your-generated-random-string]
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=10000

# URLs (Update after deploying frontend)
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-service.onrender.com

# Storage (Supabase)
STORAGE_TYPE=supabase
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_KEY=[your-anon-key]
SUPABASE_STORAGE_BUCKET=thesis-documents

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

3. **Click "Save Changes"**
   - Render will automatically redeploy with new variables

### Step 5: Deploy

1. **Click "Create Web Service"**
2. **Wait for Deployment**
   - First deployment takes 5-10 minutes
   - You'll see build logs in real-time
   - Watch for any errors

3. **Check Deployment Status**
   - Green checkmark = Success
   - Red X = Failed (check logs)

4. **Get Your Backend URL**
   - Render will give you a URL like: `https://faith-thesis-backend.onrender.com`
   - Copy this URL for later (frontend needs it)

### Step 6: Verify Deployment

1. **Test Health Endpoint**
   - Visit: `https://your-service.onrender.com/api/health`
   - Should return: `{ status: 'OK', message: 'One Faith One Archive API is running' }`

2. **Check Logs**
   - Go to "Logs" tab in Render
   - Should see: "Server running on port 10000"
   - Should see: "PostgreSQL database connected successfully"

## 📋 Complete Render Configuration

### Service Settings:
```
Name: faith-thesis-backend
Region: Oregon (US West) [or closest to you]
Branch: main
Root Directory: backend
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

### Environment Variables:
```
DATABASE_URL=postgresql://postgres:prodannyHAHA69@db.[project-ref].supabase.co:5432/postgres
DB_TYPE=postgres
JWT_SECRET=[generate-random-string]
JWT_EXPIRE=7d
NODE_ENV=production
PORT=10000
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-service.onrender.com
STORAGE_TYPE=supabase
SUPABASE_URL=https://[project-ref].supabase.co
SUPABASE_KEY=[your-anon-key]
SUPABASE_STORAGE_BUCKET=thesis-documents
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

## 🎯 Quick Answer to Your Question

**Start Command: `npm start`**

This is the standard command to start your Node.js backend server. It runs the `start` script from your `package.json`, which executes `node server.js` to start your Express server.

## ✅ Checklist

- [ ] Created Render account
- [ ] Connected GitHub repository
- [ ] Created Web Service
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Added all environment variables
- [ ] Clicked "Create Web Service"
- [ ] Waited for deployment
- [ ] Tested health endpoint
- [ ] Verified logs show server running

## 🚨 Common Issues

### Issue: "Cannot find module"
- **Cause**: Dependencies not installed
- **Solution**: Make sure Build Command is `npm install`

### Issue: "Port already in use"
- **Cause**: Wrong port configuration
- **Solution**: Use `PORT=10000` in environment variables (Render sets this automatically)

### Issue: "Database connection failed"
- **Cause**: Wrong DATABASE_URL or credentials
- **Solution**: Verify DATABASE_URL is correct, check Supabase credentials

### Issue: "Service failed to start"
- **Cause**: Missing environment variables or wrong Start Command
- **Solution**: Check logs, verify Start Command is `npm start`, check all env variables are set

## 📞 Next Steps

After Render deployment:
1. ✅ Copy your Render backend URL
2. ✅ Update FRONTEND_URL in Render (after Vercel deployment)
3. ✅ Deploy frontend to Vercel
4. ✅ Set VITE_API_URL in Vercel to your Render URL
5. ✅ Test the full application

## 💡 Pro Tips

1. **Root Directory is Important**: Make sure it's set to `backend`, not the root of your repo
2. **Build Command**: `npm install` installs dependencies
3. **Start Command**: `npm start` starts your server
4. **Port**: Render automatically sets PORT, but you can override with PORT=10000
5. **Logs**: Always check logs if something goes wrong
6. **Auto-Deploy**: Render auto-deploys on every git push to main branch

## 🎉 Success!

Once deployed, your backend will be live at:
`https://your-service-name.onrender.com`

And your API will be available at:
`https://your-service-name.onrender.com/api`

