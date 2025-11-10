# Complete Setup: Railway (Backend) + Supabase (Database) + Vercel (Frontend)

## 🎯 Architecture

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Vercel    │ ───▶ │   Railway   │ ───▶ │  Supabase   │
│  (Frontend) │      │  (Backend)  │      │ (Database)  │
└─────────────┘      └─────────────┘      └─────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │ File Storage│
                    │ (Local/Cloud)│
                    └─────────────┘
```

## 🚀 Step-by-Step Setup

### Step 1: Set Up Supabase Database

1. **Create Supabase Project**
   - Go to https://supabase.com
   - Sign up/login
   - Click "New Project"
   - Fill in project details
   - Wait for project creation

2. **Get Connection String**
   - Go to Settings → Database
   - Copy the connection string (URI)
   - Format: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`

3. **Save Credentials**
   - Database password
   - Connection string
   - Project reference

### Step 2: Deploy Backend to Railway

1. **Create Railway Account**
   - Go to https://railway.app
   - Sign up with GitHub
   - Free tier available

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Select your repository

3. **Configure Service**
   - Root Directory: `backend`
   - Build Command: (auto-detected)
   - Start Command: `npm start`

4. **Add Environment Variables**
   ```env
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
   
   # JWT
   JWT_SECRET=your_super_secret_key_change_this
   JWT_EXPIRE=7d
   
   # Server
   NODE_ENV=production
   PORT=5000
   
   # URLs
   FRONTEND_URL=https://your-app.vercel.app
   BACKEND_URL=https://your-app.railway.app
   
   # Storage
   STORAGE_TYPE=local
   MAX_FILE_SIZE=10485760
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy Railway URL (e.g., `https://your-app.railway.app`)

### Step 3: Create Database Schema

1. **Option A: Using Reset Script**
   ```bash
   # Connect to Railway service
   # Run reset script
   npm run reset-db
   ```

2. **Option B: Using Sequelize Sync**
   - Start backend server
   - Sequelize will create tables automatically
   - Check Supabase dashboard for tables

3. **Verify Tables**
   - Go to Supabase dashboard
   - Check Table Editor
   - Verify tables are created

### Step 4: Deploy Frontend to Vercel

1. **Create Vercel Account**
   - Go to https://vercel.com
   - Sign up with GitHub
   - Free tier available

2. **Create New Project**
   - Click "Add New Project"
   - Import GitHub repository
   - Select your repository

3. **Configure Project**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```env
   VITE_API_URL=https://your-app.railway.app/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment
   - Copy Vercel URL (e.g., `https://your-app.vercel.app`)

### Step 5: Update Backend CORS

1. **Go to Railway**
   - Open your backend service
   - Go to Variables tab
   - Update `FRONTEND_URL` to your Vercel URL

2. **Redeploy** (if needed)
   - Railway will auto-redeploy on variable change
   - Or manually trigger redeploy

### Step 6: Test Deployment

1. **Test Frontend**
   - Open Vercel URL
   - Check if frontend loads
   - Verify API calls work

2. **Test Backend**
   - Test API endpoints
   - Verify database connection
   - Check file uploads

3. **Test Database**
   - Verify data is saved
   - Check tables in Supabase
   - Test queries

## 🔧 Configuration Files

### Backend Environment Variables (Railway)
```env
# Database
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres

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
MAX_FILE_SIZE=10485760
```

### Frontend Environment Variables (Vercel)
```env
VITE_API_URL=https://your-app.railway.app/api
```

## ✅ Objectives Support

### ✅ Objective 1: Digital Preservation
- **File Integrity**: Railway supports file system access for checksums
- **Secure Storage**: Can use local or cloud storage
- **File Validation**: Easy to implement on Railway

### ✅ Objective 2: Calendar Management
- **No Cold Starts**: Instant responses
- **Conflict Detection**: Real-time processing
- **Reliable**: Stable connections

### ✅ Objective 3: Automation
- **No Timeout Limits**: Can run long processes
- **Background Jobs**: Supported
- **Scheduled Tasks**: Can use cron jobs

### ✅ Objective 4: Web-Based Accessibility
- **File Uploads**: Stable, no timeout issues
- **Progress Tracking**: Supported
- **Reliable Downloads**: No limitations

### ✅ Objective 5: Centralized Repository
- **Audit Logging**: Easy to implement
- **Search & Filter**: Reliable API
- **User Activity**: Can track all operations

## 🐛 Troubleshooting

### Database Connection Issues
- Verify connection string is correct
- Check Supabase project is active
- Verify SSL is enabled
- Check firewall settings

### CORS Issues
- Verify `FRONTEND_URL` matches Vercel URL exactly
- Check CORS configuration in backend
- Verify environment variables are set

### File Upload Issues
- Check file size limits
- Verify uploads directory exists
- Check permissions
- Verify storage configuration

### API Issues
- Check backend logs in Railway
- Verify environment variables
- Test API endpoints directly
- Check network connectivity

## 📊 Cost Estimation

### Free Tier (Development)
- **Railway**: $5 free credit/month
- **Vercel**: Free tier (generous)
- **Supabase**: Free tier (500MB database)
- **Total**: $0/month for development

### Production (Estimated)
- **Railway**: ~$5-20/month (depending on usage)
- **Vercel**: Free tier or $20/month (Pro)
- **Supabase**: Free tier or $25/month (Pro)
- **Total**: ~$5-65/month

## 🎉 Benefits of This Setup

1. **Perfect for Your Objectives** ✅
   - Supports all 5 objectives
   - No limitations
   - Reliable and stable

2. **Easy to Deploy** ✅
   - Simple setup process
   - Automatic deployments
   - Easy to scale

3. **Cost Effective** ✅
   - Free tiers available
   - Pay as you go
   - Affordable pricing

4. **Reliable** ✅
   - No cold starts
   - No timeout limits
   - Stable connections

5. **Scalable** ✅
   - Easy to scale up
   - Handles traffic well
   - Supports growth

## 🚀 Next Steps

1. ✅ Set up Supabase database
2. ✅ Deploy backend to Railway
3. ✅ Deploy frontend to Vercel
4. ✅ Configure environment variables
5. ✅ Test all objectives
6. ✅ Deploy to production!

## 📝 Checklist

- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] Railway account created
- [ ] Backend deployed to Railway
- [ ] Environment variables set
- [ ] Database schema created
- [ ] Vercel account created
- [ ] Frontend deployed to Vercel
- [ ] API URL configured
- [ ] CORS configured
- [ ] All features tested
- [ ] Objectives verified

## 🎯 Conclusion

**Railway + Supabase + Vercel is the perfect combination** for your objectives:
- ✅ Railway handles backend perfectly
- ✅ Supabase provides reliable database
- ✅ Vercel excels at frontend
- ✅ All objectives supported
- ✅ Easy to deploy and maintain

You're ready to deploy! 🚀

