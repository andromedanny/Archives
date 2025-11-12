# Deploy Frontend to Vercel - Step by Step Guide

## 🚀 Step-by-Step Deployment

### Step 1: Fix Backend Trust Proxy (Already Done ✅)

The backend has been updated to trust Render's proxy. The error should be resolved after Render redeploys.

### Step 2: Prepare Frontend for Vercel

1. **Check Frontend Configuration**
   - Make sure `frontend/src/services/api.js` uses `import.meta.env.VITE_API_URL`
   - This allows Vercel to set the backend URL via environment variable

2. **Verify Build Works Locally** (Optional)
   ```bash
   cd frontend
   npm run build
   ```
   - Should create a `dist` folder
   - If it works locally, it will work on Vercel

### Step 3: Deploy to Vercel

#### Option A: Using Vercel Dashboard (Recommended)

1. **Go to Vercel**
   - Visit: https://vercel.com
   - Sign up/Login (free)
   - Connect your GitHub account

2. **Create New Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select your repository: `Archives` (or your repo name)

3. **Configure Project Settings**
   - **Framework Preset**: `Vite` (should auto-detect)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
     - Click "Edit" next to Root Directory
     - Type: `frontend`
     - This tells Vercel to build from the `frontend` folder
   - **Build Command**: `npm run build` (should be auto-filled)
   - **Output Directory**: `dist` (should be auto-filled)
   - **Install Command**: `npm install` (should be auto-filled)

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Click "Add New"
   - **Key**: `VITE_API_URL`
   - **Value**: `https://your-backend-url.onrender.com/api`
     - Replace `your-backend-url.onrender.com` with your actual Render backend URL
     - Example: `https://faith-thesis-backend.onrender.com/api`
   - **Environment**: Select all (Production, Preview, Development)
   - Click "Save"

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Vercel will show you the deployment URL (e.g., `https://your-app.vercel.app`)

#### Option B: Using Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Navigate to Frontend**
   ```bash
   cd frontend
   ```

4. **Deploy**
   ```bash
   vercel
   ```

5. **Add Environment Variable**
   ```bash
   vercel env add VITE_API_URL
   ```
   - Enter: `https://your-backend-url.onrender.com/api`
   - Select all environments

6. **Redeploy**
   ```bash
   vercel --prod
   ```

### Step 4: Update Backend CORS in Render

1. **Get Your Vercel URL**
   - Copy your Vercel deployment URL
   - Example: `https://your-app.vercel.app`

2. **Go to Render Dashboard**
   - Open your backend service
   - Click "Environment" tab

3. **Update FRONTEND_URL**
   - Find `FRONTEND_URL` environment variable
   - Update it to your Vercel URL:
     ```
     https://your-app.vercel.app
     ```
   - Replace `your-app.vercel.app` with your actual Vercel URL
   - Click "Save Changes"

4. **Wait for Redeploy**
   - Render will automatically redeploy (2-3 minutes)
   - Check logs to confirm redeploy is complete

### Step 5: Test Your Application

1. **Visit Your Frontend URL**
   - Go to your Vercel URL
   - Should see your application homepage

2. **Test Login**
   - Try logging in with default admin:
     - Email: `admin@faith.edu.ph`
     - Password: `admin123`
   - Should successfully login

3. **Test Features**
   - Create a thesis
   - Upload a file
   - Search theses
   - Test admin features

### Step 6: Change Default Admin Password

**IMPORTANT:** Change the default admin password after first login!

1. **Login as Admin**
   - Email: `admin@faith.edu.ph`
   - Password: `admin123`

2. **Go to Profile/Settings**
   - Click on your profile
   - Go to settings
   - Change password
   - Use a strong password

## 🔧 Troubleshooting

### Error: "Failed to fetch" or CORS errors

**Solution:**
1. Check `FRONTEND_URL` in Render matches your Vercel URL exactly
2. Check `VITE_API_URL` in Vercel matches your Render backend URL
3. Make sure backend CORS is configured correctly
4. Wait for Render to redeploy after updating `FRONTEND_URL`

### Error: "API URL not found"

**Solution:**
1. Check `VITE_API_URL` is set in Vercel environment variables
2. Make sure it includes `/api` at the end
3. Example: `https://your-backend.onrender.com/api`

### Error: "Build failed"

**Solution:**
1. Check Root Directory is set to `frontend`
2. Check Build Command is `npm run build`
3. Check Output Directory is `dist`
4. Try building locally first: `cd frontend && npm run build`

### Error: "Module not found"

**Solution:**
1. Make sure all dependencies are in `package.json`
2. Run `npm install` in frontend folder
3. Commit `package-lock.json` to git

## 📋 Checklist

- [ ] Backend trust proxy fixed ✅
- [ ] Frontend repository pushed to GitHub
- [ ] Vercel account created
- [ ] Project created in Vercel
- [ ] Root Directory set to `frontend`
- [ ] Environment variable `VITE_API_URL` added
- [ ] Frontend deployed to Vercel
- [ ] Vercel URL copied
- [ ] `FRONTEND_URL` updated in Render
- [ ] Render redeployed
- [ ] Tested login
- [ ] Tested creating thesis
- [ ] Tested file upload
- [ ] Changed default admin password

## 🎯 Quick Reference

**Vercel Configuration:**
- Framework: Vite
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`

**Render Configuration:**
- Environment Variable: `FRONTEND_URL=https://your-app.vercel.app`

## 🎉 Success!

After completing these steps:
- ✅ Frontend is live on Vercel
- ✅ Backend is live on Render
- ✅ Database is set up in Supabase
- ✅ CORS is configured
- ✅ Application is fully functional!

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain in Vercel settings
2. **Environment Variables**: Use different values for Production, Preview, and Development
3. **Auto Deploy**: Vercel automatically deploys on every git push
4. **Preview Deploys**: Every PR gets a preview URL
5. **Analytics**: Enable Vercel Analytics for performance monitoring

## 🔗 Useful Links

- Vercel Dashboard: https://vercel.com/dashboard
- Render Dashboard: https://dashboard.render.com
- Supabase Dashboard: https://supabase.com/dashboard

