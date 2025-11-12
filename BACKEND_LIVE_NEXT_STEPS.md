# Backend is Live! What to Do Next

## ✅ Step 1: Verify Backend is Working

### Test Health Endpoint
1. **Get Your Backend URL**
   - Copy your Render backend URL (e.g., `https://faith-thesis-backend.onrender.com`)

2. **Test Health Endpoint**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{ status: 'OK', message: 'One Faith One Archive API is running' }`
   - ✅ If it works, your backend is live!

### Check Logs
1. **Go to Render Dashboard**
   - Open your service
   - Click "Logs" tab
   - Should see: `PostgreSQL database connected successfully`
   - Should see: `Server running on port 10000`

## ✅ Step 2: Set Up Database Tables (IMPORTANT!)

Your backend is running, but you need to create the database tables.

### Option A: Using Render Shell (Recommended)

1. **Open Render Shell**
   - Go to Render Dashboard → Your Service
   - Click on "Shell" tab (or use the terminal icon)
   - This opens a command line in your Render service

2. **Run Database Setup Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Wait for Completion**
   - Script will:
     - Create all database tables
     - Create default admin user
     - Create default departments and courses
   - You should see: "Database reset completed successfully!"

4. **Verify in Supabase**
   - Go to Supabase Dashboard
   - Go to "Table Editor"
   - You should see tables: `users`, `theses`, `departments`, `courses`, `calendar_events`, etc.

### Option B: Using Local Machine

1. **Update Local .env File**
   - Open `backend/.env`
   - Add your Supabase DATABASE_URL:
     ```
     DATABASE_URL=postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
     DB_TYPE=postgres
     ```

2. **Run Reset Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Verify in Supabase**
   - Check Supabase dashboard
   - Verify tables are created

## ✅ Step 3: Verify Default Admin User

After running the reset script, you should have:

- **Email**: `admin@faith.edu.ph`
- **Password**: `admin123`

**You'll use this to login after deploying the frontend!**

## ✅ Step 4: Deploy Frontend to Vercel

Now deploy your frontend so users can access your application.

### Step 4.1: Create Vercel Account
1. **Go to Vercel**
   - Visit https://vercel.com
   - Click "Sign Up" (free)
   - Sign up with GitHub (recommended)

### Step 4.2: Create New Project
1. **Import Project**
   - Click "New Project"
   - Select "Import Git Repository"
   - Select your GitHub repository
   - Click "Import"

### Step 4.3: Configure Project
1. **Project Settings**
   - **Framework Preset**: `Vite` (or it will auto-detect)
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

2. **Environment Variables**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL
   - Example: `https://faith-thesis-backend.onrender.com/api`

### Step 4.4: Deploy
1. **Click "Deploy"**
   - Vercel will start building
   - Wait 2-3 minutes
   - You'll get a URL like: `https://your-app.vercel.app`

2. **Copy Your Frontend URL**
   - Save this URL for the next step

## ✅ Step 5: Update Backend CORS

Update your backend to allow requests from your frontend.

1. **Go to Render Dashboard**
   - Open your backend service
   - Click "Environment" tab

2. **Update FRONTEND_URL**
   - Find `FRONTEND_URL` environment variable
   - Update it to your Vercel URL:
     ```
     FRONTEND_URL=https://your-app.vercel.app
     ```
   - Replace `your-app.vercel.app` with your actual Vercel URL

3. **Save Changes**
   - Click "Save Changes"
   - Render will auto-redeploy (2-3 minutes)

4. **Wait for Redeploy**
   - Check logs to confirm redeploy is complete

## ✅ Step 6: Test Full Application

### Test Frontend
1. **Visit Your Frontend URL**
   - Go to your Vercel URL
   - Should see your application homepage

2. **Test Login**
   - Try logging in with default admin:
     - Email: `admin@faith.edu.ph`
     - Password: `admin123`
   - Should successfully login

### Test Features
1. **Test Dashboard**
   - Should see dashboard with statistics
   - Should see your profile information

2. **Test Thesis Creation**
   - Create a new thesis
   - Fill in the form
   - Submit

3. **Test File Upload**
   - Upload a PDF file
   - Should see upload progress
   - Should successfully upload

4. **Test Search**
   - Go to thesis list page
   - Try searching for theses
   - Try filtering by department, program, etc.

5. **Test Admin Features**
   - Login as admin
   - Go to admin dashboard
   - Test managing theses, users, departments

## ✅ Step 7: Change Default Admin Password

**IMPORTANT:** Change the default admin password after first login!

1. **Login as Admin**
   - Email: `admin@faith.edu.ph`
   - Password: `admin123`

2. **Go to Profile/Settings**
   - Click on your profile
   - Go to settings
   - Change password
   - Use a strong password

## 🎯 Quick Checklist

- [ ] Backend is live on Render ✅
- [ ] Backend health endpoint works (`/api/health`)
- [ ] Database tables created (ran `npm run reset-db`)
- [ ] Verified tables in Supabase dashboard
- [ ] Default admin user created
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set (`VITE_API_URL`)
- [ ] Backend CORS updated (`FRONTEND_URL`)
- [ ] Tested login with default admin
- [ ] Tested creating a thesis
- [ ] Tested file upload
- [ ] Tested search functionality
- [ ] Changed default admin password

## 🚨 Troubleshooting

### Frontend Can't Connect to Backend
- **Check VITE_API_URL**: Should be `https://your-backend.onrender.com/api`
- **Check CORS**: Verify `FRONTEND_URL` in Render matches Vercel URL exactly
- **Check Backend Logs**: See if requests are reaching backend
- **Check Browser Console**: Look for CORS errors

### Database Tables Not Created
- **Run Reset Script**: Use Render shell or local machine
- **Check Supabase**: Verify connection is working
- **Check Logs**: Look for errors in reset script
- **Verify DATABASE_URL**: Make sure it's correct

### Login Not Working
- **Check Default Admin**: Email: `admin@faith.edu.ph`, Password: `admin123`
- **Check Backend Logs**: See if login requests are reaching backend
- **Check Browser Console**: Look for errors
- **Verify JWT_SECRET**: Make sure it's set in Render

## 📞 Next Steps After Everything Works

1. ✅ Test all features thoroughly
2. ✅ Change default admin password
3. ✅ Set up Uptime Robot (optional - prevents cold starts)
4. ✅ Monitor logs for errors
5. ✅ Share your application!

## 🎉 Success!

If everything works, your application is now live and accessible from anywhere!

- **Backend**: `https://your-backend.onrender.com`
- **Frontend**: `https://your-app.vercel.app`
- **Database**: Supabase (managed)
- **Storage**: Supabase Storage (1GB free)

## 💡 Pro Tips

1. **Monitor Logs**: Check Render logs regularly for errors
2. **Backup Database**: Supabase has automatic backups
3. **Cold Starts**: Render free tier has cold starts (15-30 seconds after inactivity)
4. **Uptime Robot**: Use Uptime Robot to keep service awake (free)
5. **Environment Variables**: Keep them secure, never commit to GitHub

## 🚀 Optional: Prevent Cold Starts

1. **Use Uptime Robot** (Free)
   - Go to https://uptimerobot.com
   - Create account (free)
   - Add monitor for your Render URL
   - Set to ping every 5 minutes
   - This keeps your service awake!

## 📋 Summary

**What You've Done:**
1. ✅ Deployed backend to Render
2. ✅ Fixed database connection
3. ✅ Backend is live and working

**What's Next:**
1. ⏭️ Set up database tables (run `npm run reset-db`)
2. ⏭️ Deploy frontend to Vercel
3. ⏭️ Update backend CORS
4. ⏭️ Test the full application
5. ⏭️ Change default admin password

## 🎯 Current Status

- ✅ Backend: Live on Render
- ⏭️ Database: Need to create tables
- ⏭️ Frontend: Need to deploy to Vercel
- ⏭️ Testing: Need to test everything

## 🔑 Default Admin Credentials

- **Email**: `admin@faith.edu.ph`
- **Password**: `admin123`
- **⚠️ Change this after first login!**

