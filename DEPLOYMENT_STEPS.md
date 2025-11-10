# Step-by-Step Deployment to Vercel

## 🎯 Overview

This guide will help you deploy your FAITH Colleges Thesis Archive to Vercel (frontend) and Railway/Render (backend).

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- Railway or Render account (free tier available)
- Cloud database account (PlanetScale, Railway MySQL, or Supabase)
- Cloud storage account (AWS S3, Cloudinary, or Vercel Blob) - Optional for now

## 🚀 Deployment Steps

### Step 1: Push Code to GitHub

1. Make sure all your code is committed
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

### Step 2: Set Up Cloud Database

#### Option A: PlanetScale (Recommended)

1. Go to https://planetscale.com
2. Sign up (free tier available)
3. Create a new database
4. Go to "Connect" and copy the connection string
   - Format: `mysql://user:password@host:port/database`
5. Save this for later

#### Option B: Railway MySQL

1. Go to https://railway.app
2. Sign up (free tier available)
3. Create a new project
4. Click "New" → "Database" → "MySQL"
5. Once created, go to "Variables" tab
6. Copy the connection details (host, user, password, database)

### Step 3: Deploy Backend to Railway

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Click "Add Service" → "GitHub Repo"
6. Select your repository again
7. In the service settings:
   - **Root Directory**: `backend`
   - **Build Command**: Leave empty (Railway auto-detects)
   - **Start Command**: `npm start`
8. Go to "Variables" tab and add:
   ```
   DATABASE_URL=your_planetscale_connection_string
   # OR
   DB_HOST=your_db_host
   DB_PORT=3306
   DB_NAME=your_db_name
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_SSL=true
   
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   
   NODE_ENV=production
   PORT=5000
   
   FRONTEND_URL=https://your-vercel-app.vercel.app
   BACKEND_URL=https://your-railway-app.railway.app
   
   STORAGE_TYPE=local
   ```
9. Click "Deploy"
10. Wait for deployment to complete
11. Copy the Railway URL (e.g., `https://your-app.railway.app`)

### Step 4: Set Up Database Schema

1. Connect to your cloud database
2. Run the database setup:
   ```bash
   # Option 1: Use the reset script (will create tables)
   cd backend
   npm run reset-db
   ```
3. Or manually run SQL to create tables (check your models)

### Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up/login
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`
6. Go to "Environment Variables" and add:
   ```
   VITE_API_URL=https://your-railway-app.railway.app/api
   ```
7. Click "Deploy"
8. Wait for deployment to complete
9. Copy the Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 6: Update Backend CORS

1. Go back to Railway
2. Update the `FRONTEND_URL` variable:
   ```
   FRONTEND_URL=https://your-vercel-app.vercel.app
   ```
3. Redeploy if needed

### Step 7: Test Deployment

1. Open your Vercel URL
2. Test the following:
   - [ ] User registration
   - [ ] User login
   - [ ] Thesis creation
   - [ ] File upload
   - [ ] File download
   - [ ] Search functionality
   - [ ] All other features

## 🔧 Optional: Set Up Cloud File Storage

### Option A: AWS S3

1. Create AWS account
2. Create S3 bucket
3. Get access keys
4. Install AWS SDK in backend:
   ```bash
   cd backend
   npm install aws-sdk
   ```
5. Update Railway environment variables:
   ```
   STORAGE_TYPE=s3
   AWS_ACCESS_KEY_ID=your_access_key
   AWS_SECRET_ACCESS_KEY=your_secret_key
   AWS_REGION=us-east-1
   AWS_S3_BUCKET=your_bucket_name
   ```
6. Update backend to use cloud storage (see `backend/config/cloudStorage.js`)

### Option B: Cloudinary

1. Sign up at https://cloudinary.com
2. Get cloud name, API key, API secret
3. Install Cloudinary in backend:
   ```bash
   cd backend
   npm install cloudinary
   ```
4. Update Railway environment variables:
   ```
   STORAGE_TYPE=cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

### Option C: Vercel Blob

1. Enable Vercel Blob in Vercel dashboard
2. Install Vercel Blob SDK:
   ```bash
   cd backend
   npm install @vercel/blob
   ```
3. Update Railway environment variables:
   ```
   STORAGE_TYPE=blob
   BLOB_READ_WRITE_TOKEN=your_blob_token
   ```

## 🐛 Troubleshooting

### CORS Errors
- Make sure `FRONTEND_URL` in backend matches your Vercel URL exactly
- Check that CORS is enabled in backend

### Database Connection Fails
- Check connection string/credentials
- Make sure database is accessible from Railway
- Check SSL settings if using PlanetScale

### File Upload Fails
- Check file storage configuration
- Make sure uploads directory exists (if using local storage)
- Check file size limits

### API Calls Fail
- Check `VITE_API_URL` in frontend environment variables
- Make sure backend is deployed and running
- Check backend logs in Railway

### Build Fails
- Check build logs in Vercel
- Make sure all dependencies are in `package.json`
- Check for any build errors

## ✅ Post-Deployment Checklist

- [ ] Test all features
- [ ] Set up custom domain (optional)
- [ ] Set up monitoring
- [ ] Set up backups
- [ ] Update documentation
- [ ] Share deployment URLs with team

## 📞 Support

If you encounter issues:
1. Check deployment logs
2. Check environment variables
3. Test locally first
4. Check documentation
5. Contact support

## 🎉 Success!

Your application should now be live on:
- Frontend: https://your-app.vercel.app
- Backend: https://your-app.railway.app

Congrats on deploying to production! 🚀

