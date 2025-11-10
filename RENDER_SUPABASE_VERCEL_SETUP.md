# Complete Free Setup: Render + Supabase + Vercel

## 🎯 Completely Free Setup (No Payment Required)

```
Vercel (Frontend - Free) → Render (Backend - Free) → Supabase (Database + Storage - Free)
```

## 🆓 Free Tier Limits

### Render (Backend)
- ✅ 750 hours/month free
- ✅ Auto-sleeps after 15 min inactivity
- ✅ Free SSL
- ✅ No credit card required
- ✅ Free forever

### Supabase (Database + Storage)
- ✅ 500MB database free
- ✅ 1GB file storage free
- ✅ Free forever
- ✅ No credit card required

### Vercel (Frontend)
- ✅ Unlimited deployments
- ✅ Free SSL
- ✅ Free forever
- ✅ No credit card required

## 🚀 Step-by-Step Setup

### Step 1: Set Up Supabase (5 minutes)

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Sign up (free, no credit card)
   - Click "New Project"
   - Fill in project details
   - Wait for project creation

2. **Get Connection String**
   - Go to Settings → Database
   - Copy the connection string (URI)
   - Format: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`

3. **Enable Supabase Storage**
   - Go to Storage in Supabase dashboard
   - Create a bucket called `thesis-documents`
   - Set it to public or private (your choice)
   - This gives you 1GB free storage!

### Step 2: Deploy Backend to Render (10 minutes)

1. **Create Render Account**
   - Go to https://render.com
   - Sign up with GitHub (free, no credit card)
   - Verify your email

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository

3. **Configure Service**
   - **Name**: `faith-thesis-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

4. **Add Environment Variables**
   ```env
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
   
   # JWT
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   
   # Server
   NODE_ENV=production
   PORT=10000
   
   # URLs
   FRONTEND_URL=https://your-app.vercel.app
   BACKEND_URL=https://your-app.onrender.com
   
   # Storage (Use Supabase Storage)
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_STORAGE_BUCKET=thesis-documents
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment (5-10 minutes first time)
   - Copy Render URL (e.g., `https://your-app.onrender.com`)

### Step 3: Create Database Schema (5 minutes)

1. **Option A: Using Reset Script**
   - Connect to your Render service
   - Run: `npm run reset-db`
   - Or use Render's shell

2. **Option B: Using Sequelize Sync**
   - Start backend server
   - Sequelize will create tables automatically
   - Check Supabase dashboard for tables

### Step 4: Set Up Supabase Storage Integration

1. **Install Supabase Client**
   ```bash
   cd backend
   npm install @supabase/supabase-js
   ```

2. **Update Upload Middleware**
   - Use Supabase Storage for file uploads
   - Store file URLs in database
   - Free 1GB storage!

### Step 5: Deploy Frontend to Vercel (5 minutes)

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub (free, no credit card)

2. **Create New Project**
   - Click "Add New Project"
   - Import GitHub repository
   - Select your repository

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variables**
   ```env
   VITE_API_URL=https://your-app.onrender.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy Vercel URL

### Step 6: Update Backend CORS (2 minutes)

1. **Go to Render**
   - Open your backend service
   - Go to Environment tab
   - Update `FRONTEND_URL` to your Vercel URL

2. **Redeploy** (automatic)
   - Render will auto-redeploy on variable change

### Step 7: Prevent Cold Starts (Optional but Recommended)

1. **Use Uptime Robot** (Free)
   - Go to https://uptimerobot.com
   - Create account (free)
   - Add monitor for your Render URL
   - Set to ping every 5 minutes
   - This keeps your service awake!

2. **Or Use Render Cron Job** (Free)
   - Create a cron job in Render
   - Ping your service every 10 minutes
   - Keeps service awake

## 🔧 Configuration Files

### Backend Environment Variables (Render)
```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres

# JWT
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=10000

# URLs
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.onrender.com

# Storage (Supabase Storage - FREE!)
STORAGE_TYPE=supabase
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
```

### Frontend Environment Variables (Vercel)
```env
VITE_API_URL=https://your-app.onrender.com/api
```

## ✅ Objectives Support

### ✅ Objective 1: Digital Preservation
- **File Storage**: Supabase Storage (free, 1GB)
- **File Integrity**: Can calculate checksums
- **Secure Storage**: Supabase provides security
- **Long-term**: Supabase storage is reliable

### ✅ Objective 2: Calendar Management
- **Cold Starts**: 15-30 seconds after inactivity (use Uptime Robot to prevent)
- **Conflict Detection**: Works perfectly
- **Reliable**: Good for your use case

### ✅ Objective 3: Automation
- **Background Jobs**: Supported
- **Scheduled Tasks**: Can use Render cron jobs (free)
- **Automation**: Works well

### ✅ Objective 4: Web-Based Accessibility
- **File Uploads**: Supabase Storage (free)
- **Progress Tracking**: Supported
- **Downloads**: Works well
- **Clear Feedback**: Can implement

### ✅ Objective 5: Centralized Repository
- **Audit Logging**: Supported
- **Search & Filter**: Works well
- **User Activity**: Can track all operations
- **Accountability**: Can implement

## ⚠️ Important Notes

### Render Free Tier:
1. **Cold Starts**: Service sleeps after 15 min inactivity
   - Solution: Use Uptime Robot (free) to keep awake
   - Or accept 15-30 second delay on first request

2. **Spinning Down**: Service stops after inactivity
   - Wakes automatically on request
   - No data loss
   - Just a delay on first request

3. **Resources**: Limited CPU/RAM
   - Enough for your project
   - Can handle moderate traffic
   - Free forever

### Supabase Free Tier:
1. **Database**: 500MB free
   - Enough for thousands of theses
   - Free forever

2. **Storage**: 1GB free
   - Enough for many thesis documents
   - Free forever
   - Can upgrade if needed

### Vercel Free Tier:
1. **Deployments**: Unlimited
   - Free forever
   - No limits

## 🎉 Benefits

### ✅ Completely Free
- No payment required
- No credit card needed
- Free forever

### ✅ Supports All Objectives
- File storage (Supabase Storage)
- File integrity checks
- Calendar management
- Audit logging
- All features work!

### ✅ Easy Setup
- Simple deployment
- Automatic deployments
- Easy to maintain

### ✅ Reliable
- Good uptime
- Free SSL
- Secure connections

## 🐛 Troubleshooting

### Cold Starts
- **Problem**: 15-30 second delay on first request
- **Solution**: Use Uptime Robot to keep service awake (free)

### Database Connection
- **Problem**: Connection fails
- **Solution**: Check connection string, verify Supabase is active

### File Uploads
- **Problem**: Files not uploading
- **Solution**: Check Supabase Storage configuration, verify bucket exists

### CORS Issues
- **Problem**: CORS errors
- **Solution**: Verify FRONTEND_URL matches Vercel URL exactly

## 📊 Cost Breakdown

### Development (Free)
- **Render**: $0/month ✅
- **Supabase**: $0/month ✅
- **Vercel**: $0/month ✅
- **Uptime Robot**: $0/month ✅
- **Total**: $0/month ✅

### Production (Still Free)
- **Render**: $0/month (free tier) ✅
- **Supabase**: $0/month (free tier) ✅
- **Vercel**: $0/month (free tier) ✅
- **Uptime Robot**: $0/month (free) ✅
- **Total**: $0/month ✅

## 🚀 Next Steps

1. ✅ Set up Supabase (database + storage)
2. ✅ Deploy backend to Render
3. ✅ Deploy frontend to Vercel
4. ✅ Set up Uptime Robot (optional, prevents cold starts)
5. ✅ Test all objectives
6. ✅ Deploy to production!

## 🎯 Conclusion

**Render + Supabase + Vercel is the perfect free setup:**
- ✅ Completely free
- ✅ No payment required
- ✅ No credit card needed
- ✅ Supports all objectives
- ✅ Easy to setup
- ✅ Free forever

You're ready to deploy for FREE! 🎉

