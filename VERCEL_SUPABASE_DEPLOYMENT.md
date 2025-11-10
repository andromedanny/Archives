# Vercel + Supabase Deployment Guide

## 🎯 Quick Start

This guide will help you deploy your FAITH Colleges Thesis Archive to:
- **Frontend**: Vercel
- **Backend**: Railway or Render
- **Database**: Supabase (PostgreSQL)

## 📋 Prerequisites

- GitHub account
- Vercel account (free)
- Railway or Render account (free)
- Supabase account (free)

## 🚀 Deployment Steps

### Step 1: Set Up Supabase Database (5 minutes)

1. Go to https://supabase.com
2. Create new project
3. Copy connection string from Settings → Database
4. Save your database password

### Step 2: Install PostgreSQL Dependencies (1 minute)

```bash
cd backend
npm install
```

The `pg` and `pg-hstore` packages are already in `package.json`.

### Step 3: Update Backend Configuration

The backend is already configured to support PostgreSQL. Just set the environment variables.

### Step 4: Deploy Backend to Railway (10 minutes)

1. Go to https://railway.app
2. New Project → Deploy from GitHub
3. Select your repository
4. Set root directory to `backend`
5. Add environment variables:
   ```env
   DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
   JWT_SECRET=your_secret_key
   JWT_EXPIRE=7d
   NODE_ENV=production
   FRONTEND_URL=https://your-app.vercel.app
   BACKEND_URL=https://your-app.railway.app
   STORAGE_TYPE=local
   ```
6. Deploy
7. Copy Railway URL

### Step 5: Create Database Schema (5 minutes)

1. Connect to your backend (via Railway logs or local)
2. Run: `npm run reset-db`
3. Or let Sequelize create tables automatically on first run

### Step 6: Deploy Frontend to Vercel (5 minutes)

1. Go to https://vercel.com
2. Add New Project
3. Import GitHub repository
4. Set root directory to `frontend`
5. Framework: Vite
6. Add environment variable:
   ```env
   VITE_API_URL=https://your-railway-url.railway.app/api
   ```
7. Deploy
8. Copy Vercel URL

### Step 7: Update Backend CORS (2 minutes)

1. Go back to Railway
2. Update `FRONTEND_URL` to your Vercel URL
3. Redeploy if needed

### Step 8: Test Deployment (5 minutes)

1. Open Vercel URL
2. Test registration
3. Test login
4. Test thesis creation
5. Test file upload
6. Test file download

## 🔧 Environment Variables

### Backend (Railway)
```env
# Supabase Database
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres

# Or use individual parameters
DB_TYPE=postgres
DB_HOST=db.project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=true

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=5000

# URLs
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.railway.app

# Storage
STORAGE_TYPE=local
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-railway-url.railway.app/api
```

## 🗄️ Database Schema

The database schema will be created automatically by Sequelize when you:
1. Run `npm run reset-db` in backend
2. Or start the server in development mode (if `NODE_ENV=development`)

Tables created:
- `users`
- `theses`
- `calendar_events`
- `departments`
- `courses`
- `thesis_authors`
- `course_department` (junction table)

## 🔒 SSL Configuration

Supabase requires SSL connections. The database configuration automatically enables SSL when using Supabase connection strings.

## 🐛 Troubleshooting

### Connection Issues
- Verify connection string is correct
- Check password is correct
- Ensure SSL is enabled (`DB_SSL=true`)
- Verify Supabase project is active

### Schema Issues
- Run `npm run reset-db` to create tables
- Check Sequelize logs for errors
- Verify ENUM types are created correctly

### Deployment Issues
- Check Railway logs for errors
- Verify environment variables are set
- Test connection locally first

## ✅ Post-Deployment Checklist

- [ ] Supabase database connected
- [ ] Database schema created
- [ ] Backend deployed to Railway
- [ ] Frontend deployed to Vercel
- [ ] CORS configured
- [ ] Environment variables set
- [ ] All features tested
- [ ] File uploads working
- [ ] Database operations working

## 🎉 Success!

Your application should now be live:
- **Frontend**: https://your-app.vercel.app
- **Backend**: https://your-app.railway.app
- **Database**: Supabase (cloud)

## 📝 Next Steps

1. Set up cloud storage (AWS S3, Cloudinary)
2. Add file integrity checks
3. Set up monitoring
4. Set up backups
5. Add custom domain

## 📞 Support

- Supabase Docs: https://supabase.com/docs
- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs

