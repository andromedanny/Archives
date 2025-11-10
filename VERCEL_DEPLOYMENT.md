# Vercel Deployment Guide - FAITH Colleges Thesis Archive

## 📋 Deployment Strategy

Since you have a **separate backend and frontend**, here's the recommended approach:

### Option 1: Vercel Frontend + Separate Backend (Recommended)
- **Frontend**: Deploy to Vercel (React/Vite)
- **Backend**: Deploy to Railway, Render, or Fly.io
- **Database**: Use PlanetScale, Supabase, or Railway MySQL
- **File Storage**: Use AWS S3, Cloudinary, or Vercel Blob

### Option 2: All on Vercel (More Complex)
- **Frontend**: Vercel
- **Backend**: Convert to Vercel Serverless Functions
- **Database**: PlanetScale or Supabase
- **File Storage**: Vercel Blob or AWS S3

## 🚀 Step-by-Step Deployment

### Phase 1: Prepare Database (Cloud MySQL)

#### Option A: PlanetScale (Recommended for MySQL)
1. Sign up at https://planetscale.com
2. Create a new database
3. Get connection string
4. Update `.env` with PlanetScale credentials

#### Option B: Supabase (PostgreSQL - requires migration)
1. Sign up at https://supabase.com
2. Create a new project
3. Get connection string
4. Migrate from MySQL to PostgreSQL

#### Option C: Railway MySQL
1. Sign up at https://railway.app
2. Create MySQL service
3. Get connection string

### Phase 2: Deploy Backend

#### Option A: Railway (Easiest)
1. Sign up at https://railway.app
2. Connect GitHub repository
3. Select `backend` folder
4. Add environment variables
5. Deploy

#### Option B: Render
1. Sign up at https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Select `backend` folder
5. Add environment variables
6. Deploy

### Phase 3: Deploy Frontend to Vercel

1. Sign up at https://vercel.com
2. Connect GitHub repository
3. Configure build settings
4. Add environment variables
5. Deploy

### Phase 4: Set Up File Storage

#### Option A: Vercel Blob (Easiest)
- Integrated with Vercel
- Simple API
- Good for file uploads

#### Option B: AWS S3
- More control
- Better for large files
- Requires AWS account

#### Option C: Cloudinary
- Image optimization
- Video support
- Free tier available

## 📝 Required Configuration Files

### 1. Frontend: `vercel.json`
### 2. Backend: Update for cloud deployment
### 3. Environment Variables: Update for production

## ⚠️ Important Considerations

1. **File Storage**: Vercel doesn't support persistent file storage
   - Need cloud storage (S3, Cloudinary, Vercel Blob)
   - Update upload middleware

2. **Database**: Vercel doesn't provide MySQL
   - Need cloud database (PlanetScale, Railway, Supabase)
   - Update connection string

3. **Backend**: Vercel is optimized for serverless
   - Consider Railway/Render for Express backend
   - Or convert to Vercel Serverless Functions

4. **Environment Variables**: Must be set in Vercel dashboard
   - Never commit `.env` files
   - Use Vercel environment variables

5. **CORS**: Update CORS settings for production URLs
   - Allow Vercel domain
   - Allow backend domain

6. **File Uploads**: Must use cloud storage
   - Cannot use local filesystem on Vercel
   - Update multer configuration

## 🔧 Migration Checklist

- [ ] Set up cloud database
- [ ] Update database connection
- [ ] Set up cloud file storage
- [ ] Update file upload configuration
- [ ] Deploy backend to Railway/Render
- [ ] Deploy frontend to Vercel
- [ ] Configure environment variables
- [ ] Update CORS settings
- [ ] Test all functionality
- [ ] Set up custom domain (optional)

