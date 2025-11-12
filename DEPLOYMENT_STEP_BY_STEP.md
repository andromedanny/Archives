# Deployment Step-by-Step Guide

## 🎯 Current Status: Committed Changes ✅

You've committed your changes. Now let's deploy!

## 📋 Deployment Steps

### Step 1: Push to GitHub (if not already done)

```bash
git push origin main
```

### Step 2: Set Up Supabase (Database + Storage)

1. **Create Supabase Account**
   - Go to https://supabase.com
   - Sign up for free account
   - Create a new project

2. **Get Database Connection String**
   - Go to Project Settings → Database
   - Copy the connection string (URI)
   - It looks like: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

3. **Get Supabase API Keys**
   - Go to Project Settings → API
   - Copy:
     - `URL`: `https://[project-ref].supabase.co`
     - `anon key`: Your anon/public key
     - `service_role key`: Your service role key (keep secret!)

4. **Set Up Storage Bucket**
   - Go to Storage → Create bucket
   - Name: `thesis-documents`
   - Make it public (for downloads) or private (with signed URLs)
   - Set up bucket policies

### Step 3: Set Up Render (Backend Hosting)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (free)

2. **Create Web Service**
   - Click "New" → "Web Service"
   - Connect your GitHub repository
   - Select the repository
   - Configure:
     - **Name**: `one-faith-archive-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Set Environment Variables**
   Add these in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   DATABASE_URL=[Your Supabase connection string]
   DB_TYPE=postgres
   JWT_SECRET=[Generate a strong random string]
   JWT_EXPIRE=7d
   FRONTEND_URL=[Your Vercel frontend URL - will update later]
   BACKEND_URL=[Your Render backend URL]
   STORAGE_TYPE=supabase
   SUPABASE_URL=[Your Supabase URL]
   SUPABASE_KEY=[Your Supabase anon key]
   SUPABASE_STORAGE_BUCKET=thesis-documents
   ENABLE_SYNC=false
   ENABLE_HTTP_LOGGING=false
   ```

4. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the URL (e.g., `https://one-faith-archive-backend.onrender.com`)

### Step 4: Set Up Vercel (Frontend Hosting)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub (free)

2. **Import Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select the repository

3. **Configure Project**
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Set Environment Variables**
   Add these in Vercel dashboard:
   ```
   VITE_API_URL=[Your Render backend URL]/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Copy the URL (e.g., `https://one-faith-archive.vercel.app`)

### Step 5: Update Environment Variables

1. **Update Render Backend**
   - Go to Render dashboard
   - Update `FRONTEND_URL` to your Vercel URL
   - Restart the service

2. **Update Vercel Frontend**
   - Go to Vercel dashboard
   - Verify `VITE_API_URL` is correct
   - Redeploy if needed

### Step 6: Set Up Database

1. **Run Database Migrations**
   - Option 1: Use Render's console
     - Go to Render dashboard → Your service → Shell
     - Run: `cd backend && npm run reset-db`
   
   - Option 2: Use local machine
     - Set `DATABASE_URL` in your local `.env`
     - Run: `npm run reset-db`
     - This creates tables and default admin user

2. **Verify Database**
   - Check Supabase dashboard
   - Verify tables are created
   - Verify default admin user exists

### Step 7: Test Deployment

1. **Test Backend**
   - Visit: `https://[your-backend-url]/api/health`
   - Should return: `{ status: 'OK', message: 'One Faith One Archive API is running' }`

2. **Test Frontend**
   - Visit your Vercel URL
   - Try logging in with default admin:
     - Email: `admin@faith.edu.ph`
     - Password: `admin123`

3. **Test Features**
   - Login
   - Create thesis
   - Upload file
   - Download file
   - Search theses
   - Admin features

### Step 8: Set Up Custom Domain (Optional)

1. **Backend Domain**
   - In Render, go to Settings → Custom Domains
   - Add your domain
   - Update DNS records

2. **Frontend Domain**
   - In Vercel, go to Settings → Domains
   - Add your domain
   - Update DNS records

## 🚨 Troubleshooting

### Backend Not Starting
- Check environment variables in Render
- Check logs in Render dashboard
- Verify database connection string
- Verify JWT_SECRET is set

### Frontend Not Connecting to Backend
- Check `VITE_API_URL` in Vercel
- Check CORS settings in backend
- Verify backend URL is correct
- Check browser console for errors

### Database Connection Issues
- Verify Supabase connection string
- Check Supabase project is active
- Verify database credentials
- Check firewall settings

### File Upload Issues
- Verify Supabase Storage bucket exists
- Check bucket policies
- Verify SUPABASE_KEY is correct
- Check file size limits

## ✅ Deployment Checklist

- [ ] Pushed code to GitHub
- [ ] Created Supabase project
- [ ] Set up Supabase Storage bucket
- [ ] Created Render account
- [ ] Deployed backend to Render
- [ ] Set backend environment variables
- [ ] Created Vercel account
- [ ] Deployed frontend to Vercel
- [ ] Set frontend environment variables
- [ ] Updated CORS and URLs
- [ ] Ran database migrations
- [ ] Tested backend health endpoint
- [ ] Tested frontend login
- [ ] Tested file upload
- [ ] Tested file download
- [ ] Tested search functionality
- [ ] Changed default admin password

## 🎉 Success!

Once all steps are complete, your application will be live and accessible from anywhere!

## 📞 Need Help?

If you encounter any issues:
1. Check the logs in Render/Vercel dashboards
2. Verify environment variables are set correctly
3. Check browser console for frontend errors
4. Verify database connection is working
5. Check CORS settings

