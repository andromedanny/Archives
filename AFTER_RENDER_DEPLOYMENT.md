# What to Do After Deploying to Render

## ✅ Step 1: Check Deployment Status

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Click on your service: `faith-thesis-backend`

2. **Check Deployment Status**
   - Look for green checkmark ✅ = Success
   - Look for red X ❌ = Failed (check logs)

3. **Check Logs**
   - Click on "Logs" tab
   - You should see:
     - "Server running on port 10000"
     - "PostgreSQL database connected successfully"
   - If you see errors, note them down

## ✅ Step 2: Test Backend Health Endpoint

1. **Get Your Backend URL**
   - In Render dashboard, copy your service URL
   - Format: `https://faith-thesis-backend.onrender.com`

2. **Test Health Endpoint**
   - Visit: `https://your-service.onrender.com/api/health`
   - Should return: `{ status: 'OK', message: 'One Faith One Archive API is running' }`
   - If it works, your backend is live! ✅

## ✅ Step 3: Set Up Database Tables

Your backend is running, but you need to create the database tables.

### Option A: Using Render Shell (Recommended)

1. **Open Render Shell**
   - Go to Render dashboard → Your service
   - Click on "Shell" tab (or "Logs" → "Shell")
   - Or use the terminal icon

2. **Run Database Reset Script**
   ```bash
   cd backend
   npm run reset-db
   ```
   
3. **Wait for Completion**
   - Script will create all tables
   - Create default admin user
   - Create departments and courses
   - You should see: "Database reset completed successfully!"

4. **Verify in Supabase**
   - Go to Supabase dashboard
   - Go to Table Editor
   - You should see tables: `users`, `theses`, `departments`, `courses`, etc.

### Option B: Using Local Machine

1. **Update Local .env File**
   - Open `backend/.env`
   - Add your Supabase DATABASE_URL
   - Add other environment variables

2. **Run Reset Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Verify in Supabase**
   - Check Supabase dashboard
   - Verify tables are created

## ✅ Step 4: Verify Default Admin User

After running the reset script, you should have a default admin user:

- **Email**: `admin@faith.edu.ph`
- **Password**: `admin123`

**Test Login:**
- You can test this later after deploying the frontend
- Or use Postman/curl to test the login endpoint

## ✅ Step 5: Deploy Frontend to Vercel

Now that your backend is working, deploy the frontend.

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Login (free, connect GitHub)

2. **Create New Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select your repository

3. **Configure Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` ⚠️ Important!
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm install`

4. **Add Environment Variable**
   - Click "Environment Variables"
   - Add:
     ```
     VITE_API_URL=https://your-backend-url.onrender.com/api
     ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL
   - Example: `https://faith-thesis-backend.onrender.com/api`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment (2-3 minutes)
   - Copy your Vercel URL (e.g., `https://your-app.vercel.app`)

## ✅ Step 6: Update Backend CORS

1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Environment" tab

2. **Update FRONTEND_URL**
   - Find `FRONTEND_URL` environment variable
   - Update it to your Vercel URL:
     ```
     FRONTEND_URL=https://your-app.vercel.app
     ```
   - Click "Save Changes"
   - Render will auto-redeploy

3. **Wait for Redeploy**
   - Wait 2-3 minutes for redeploy
   - Check logs to confirm it's running

## ✅ Step 7: Test Full Application

1. **Visit Your Frontend**
   - Go to your Vercel URL
   - Should see your application

2. **Test Login**
   - Try logging in with default admin:
     - Email: `admin@faith.edu.ph`
     - Password: `admin123`

3. **Test Features**
   - Create a thesis
   - Upload a file
   - Search theses
   - Test admin features

## ✅ Step 8: Change Default Admin Password

**IMPORTANT:** Change the default admin password after first login!

1. **Login as Admin**
   - Use: `admin@faith.edu.ph` / `admin123`

2. **Go to Profile/Settings**
   - Click on your profile
   - Change password
   - Use a strong password

## 🎯 Quick Checklist

- [ ] Backend deployed to Render ✅
- [ ] Backend health endpoint works (`/api/health`)
- [ ] Database tables created (ran `npm run reset-db`)
- [ ] Verified tables in Supabase dashboard
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set (`VITE_API_URL`)
- [ ] Backend CORS updated (`FRONTEND_URL`)
- [ ] Tested login with default admin
- [ ] Tested creating a thesis
- [ ] Tested file upload
- [ ] Changed default admin password

## 🚨 Troubleshooting

### Backend Not Starting
- **Check Logs**: Go to Render → Logs tab
- **Check Environment Variables**: Make sure all are set correctly
- **Check DATABASE_URL**: Verify it's correct
- **Check PORT**: Should be 10000 (Render sets this automatically)

### Database Connection Failed
- **Check DATABASE_URL**: Verify it's correct in Render
- **Check Supabase**: Make sure project is active
- **Check Password**: Verify password is correct in DATABASE_URL
- **Check Firewall**: Supabase should allow connections

### Frontend Can't Connect to Backend
- **Check VITE_API_URL**: Should be `https://your-backend.onrender.com/api`
- **Check CORS**: Verify `FRONTEND_URL` in Render matches Vercel URL
- **Check Backend Logs**: See if requests are reaching backend
- **Check Browser Console**: Look for CORS errors

### Database Tables Not Created
- **Run Reset Script**: Use Render shell or local machine
- **Check Supabase**: Verify connection is working
- **Check Logs**: Look for errors in reset script
- **Verify DATABASE_URL**: Make sure it's correct

## 📞 Next Steps

After everything is working:

1. ✅ Test all features
2. ✅ Change default admin password
3. ✅ Set up Uptime Robot (optional - prevents cold starts)
4. ✅ Monitor logs for errors
5. ✅ Test file uploads
6. ✅ Test search functionality
7. ✅ Test admin features

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
2. ✅ Set up database tables
3. ✅ Deployed frontend to Vercel
4. ✅ Connected frontend to backend
5. ✅ Tested the application

**What's Next:**
1. Test all features
2. Change default admin password
3. Set up monitoring (optional)
4. Share your application!

## 🎯 Current Status

- ✅ Backend: Deployed to Render
- ⏭️ Database: Need to create tables
- ⏭️ Frontend: Need to deploy to Vercel
- ⏭️ Testing: Need to test everything

## 🔑 Default Admin Credentials

- **Email**: `admin@faith.edu.ph`
- **Password**: `admin123`
- **⚠️ Change this after first login!**

