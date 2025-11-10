# Supabase Quick Start Guide

## ✅ What's Been Configured

1. ✅ **Database Configuration** - Updated to support PostgreSQL (Supabase)
2. ✅ **PostgreSQL Dependencies** - Installed `pg` and `pg-hstore`
3. ✅ **Environment Variables** - Updated to support Supabase connection
4. ✅ **SSL Configuration** - Automatically enabled for Supabase

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up/login
3. Click "New Project"
4. Fill in:
   - Name: `faith-thesis-archive`
   - Password: (save this!)
   - Region: (choose closest)
5. Wait for project creation (1-2 minutes)

### Step 2: Get Connection String

1. Go to **Settings** → **Database**
2. Find **Connection string** section
3. Copy the **URI** (looks like):
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Step 3: Set Environment Variables

In your backend `.env` file or Railway environment variables:

```env
DATABASE_URL=postgresql://postgres:your_password@db.project-ref.supabase.co:5432/postgres
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.railway.app
STORAGE_TYPE=local
```

### Step 4: Test Connection

```bash
cd backend
npm start
```

You should see:
```
PostgreSQL database connected successfully
Database synchronized
```

### Step 5: Create Database Schema

Run the reset script to create tables:

```bash
npm run reset-db
```

Or tables will be created automatically on first run.

## 📋 Deployment Checklist

### Backend (Railway)
- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] Environment variables set in Railway
- [ ] Backend deployed
- [ ] Database connection verified

### Frontend (Vercel)
- [ ] Frontend deployed to Vercel
- [ ] `VITE_API_URL` set to backend URL
- [ ] Frontend URL copied

### Configuration
- [ ] Backend `FRONTEND_URL` updated to Vercel URL
- [ ] CORS configured
- [ ] All features tested

## 🔧 Environment Variables Reference

### Backend (Railway)
```env
# Supabase Database (Required)
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres

# JWT (Required)
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Server (Required)
NODE_ENV=production
PORT=5000

# URLs (Required)
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.railway.app

# Storage (Optional - for now)
STORAGE_TYPE=local
```

### Frontend (Vercel)
```env
VITE_API_URL=https://your-railway-url.railway.app/api
```

## 🎯 Key Points

1. **Supabase uses PostgreSQL** - The database configuration automatically detects PostgreSQL from the connection string
2. **SSL is required** - Supabase requires SSL connections (automatically configured)
3. **Connection String Format** - `postgresql://user:password@host:port/database`
4. **Database Name** - Usually `postgres` for Supabase
5. **Username** - Usually `postgres` for Supabase

## 🐛 Troubleshooting

### Connection Fails
- Verify connection string is correct
- Check password is correct
- Ensure SSL is enabled (automatic)
- Verify Supabase project is active

### Tables Not Created
- Run `npm run reset-db`
- Check Sequelize logs
- Verify database connection

### ENUM Errors
- Sequelize automatically creates ENUM types in PostgreSQL
- If issues persist, check model definitions

## 📚 Documentation

- **Full Setup Guide**: See `SUPABASE_SETUP.md`
- **Deployment Guide**: See `VERCEL_SUPABASE_DEPLOYMENT.md`
- **Supabase Docs**: https://supabase.com/docs

## 🎉 Next Steps

1. Deploy backend to Railway
2. Deploy frontend to Vercel
3. Test all features
4. Set up cloud storage (optional)
5. Add monitoring and backups

## 💡 Tips

- Supabase free tier includes 500MB database and 1GB file storage
- Connection pooling is handled automatically
- SSL is required and configured automatically
- Tables are created automatically by Sequelize
- ENUM types are created as PostgreSQL custom types

## 🔒 Security Notes

- Never commit `.env` files
- Use strong passwords
- Rotate JWT secrets regularly
- Enable Row Level Security in Supabase (optional)
- Use environment variables for all secrets

## ✅ Success Checklist

- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] PostgreSQL packages installed
- [ ] Environment variables configured
- [ ] Database connection tested
- [ ] Tables created
- [ ] Backend deployed
- [ ] Frontend deployed
- [ ] All features working

You're ready to deploy! 🚀

