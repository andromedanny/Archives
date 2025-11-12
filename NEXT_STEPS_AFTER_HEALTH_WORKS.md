cd# Next Steps: Health Endpoint is Working! ✅

## ✅ Current Status

- ✅ Backend is live on Render
- ✅ Health endpoint is working
- ✅ Server is running successfully

## 🎯 Next Steps

### Step 1: Set Up Database Tables (IMPORTANT!)

Your server is running, but you need to create the database tables in Supabase.

#### Option A: Using Render Shell (Recommended)

1. **Go to Render Dashboard**
   - Open your service: `srv-d494lqa4d50c7394i7ng`
   - Click on **"Shell"** tab (or terminal icon)

2. **Run Database Setup Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Wait for Completion**
   - Script will:
     - Create all database tables (users, theses, departments, courses, etc.)
     - Create default admin user
     - Create default departments and courses
   - You should see: "Database reset completed successfully!"

4. **Verify in Supabase**
   - Go to Supabase Dashboard
   - Go to **"Table Editor"**
   - You should see tables: `users`, `theses`, `departments`, `courses`, `calendar_events`, `audit_logs`, `thesis_authors`

#### Option B: Using Local Machine

1. **Update Local .env File**
   - Open `backend/.env`
   - Add your Supabase DATABASE_URL:
     ```env
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

### Step 2: Verify Database Connection

After running the reset script:

1. **Check Render Logs**
   - Go to Render → Your service → Logs
   - Should see: "PostgreSQL database connected successfully"
   - No more connection errors

2. **Verify Tables in Supabase**
   - Go to Supabase Dashboard → Table Editor
   - Should see all tables created

3. **Check Default Admin User**
   - Go to Supabase → Table Editor → `users` table
   - Should see admin user: `admin@faith.edu.ph`

### Step 3: Test API Endpoints

After database is set up:

1. **Test Health Endpoint** (Already working ✅)
   - `https://your-backend.onrender.com/api/health`

2. **Test Login Endpoint**
   - You can test this after deploying frontend
   - Or use Postman/curl to test

3. **Test Other Endpoints**
   - Once frontend is deployed, test all features

### Step 4: Deploy Frontend to Vercel

Now deploy your frontend so users can access your application.

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up/Login (free, connect GitHub)

2. **Create New Project**
   - Click "New Project"
   - Import your GitHub repository
   - Select your repository

3. **Configure Project**
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
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

### Step 5: Update Backend CORS

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

### Step 6: Test Full Application

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

### Step 7: Change Default Admin Password

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

- [x] Backend is live on Render ✅
- [x] Health endpoint is working ✅
- [ ] Database tables created (run `npm run reset-db`)
- [ ] Verified tables in Supabase dashboard
- [ ] Default admin user created
- [ ] Database connection successful
- [ ] Frontend deployed to Vercel
- [ ] Frontend environment variable set (`VITE_API_URL`)
- [ ] Backend CORS updated (`FRONTEND_URL`)
- [ ] Tested login with default admin
- [ ] Tested creating a thesis
- [ ] Tested file upload
- [ ] Changed default admin password

## 🚀 Priority: Set Up Database Tables

**Most Important Next Step:**

1. **Go to Render → Your Service → Shell**
2. **Run:**
   ```bash
   cd backend
   npm run reset-db
   ```
3. **Wait for completion**
4. **Verify in Supabase dashboard**

## 📋 Summary

**What's Done:**
- ✅ Backend deployed to Render
- ✅ Server is running
- ✅ Health endpoint works

**What's Next:**
1. ⏭️ Set up database tables (run `npm run reset-db`)
2. ⏭️ Deploy frontend to Vercel
3. ⏭️ Update backend CORS
4. ⏭️ Test full application
5. ⏭️ Change default admin password

## 🎉 Great Progress!

Your backend is live and working! Now you just need to:
1. Set up the database tables
2. Deploy the frontend
3. Test everything

## 💡 Pro Tips

1. **Database Setup**: Use Render Shell to run the reset script (easiest)
2. **Frontend Deployment**: Make sure to set `VITE_API_URL` correctly
3. **CORS**: Update `FRONTEND_URL` in Render after deploying frontend
4. **Testing**: Test all features thoroughly before going live
5. **Security**: Change default admin password immediately

## 🔑 Default Admin Credentials

After running the reset script, you'll have:
- **Email**: `admin@faith.edu.ph`
- **Password**: `admin123`
- **⚠️ Change this after first login!**

