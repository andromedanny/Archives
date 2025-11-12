# Quick Database Setup (Without Render Shell)

## 🎯 Easiest Method: Run Reset Script Locally

Since Render Shell might require payment, run the script on your local machine!

## ✅ Step-by-Step

### Step 1: Update Local .env File

1. **Open `backend/.env` File**
   - Create it if it doesn't exist
   - Path: `backend/.env`

2. **Add This Content:**
   ```env
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   DB_TYPE=postgres
   
   # JWT (Generate a random string)
   JWT_SECRET=your_random_jwt_secret_here
   JWT_EXPIRE=7d
   
   # Server
   NODE_ENV=development
   PORT=5000
   ```

3. **Generate JWT_SECRET**
   - Go to: https://generate-secret.vercel.app/32
   - Or use: `openssl rand -base64 32`
   - Copy the generated string
   - Replace `your_random_jwt_secret_here` with it

### Step 2: Run Reset Script

1. **Open Terminal**
   - Navigate to your project: `cd C:\Users\Rufino\Desktop\Archives`

2. **Run Reset Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Wait for Completion**
   - Script will:
     - Connect to Supabase
     - Create all tables
     - Create default admin user
     - Create departments and courses
   - You should see: "Database reset completed successfully!"

4. **Verify in Supabase**
   - Go to Supabase Dashboard → Table Editor
   - Should see tables: `users`, `theses`, `departments`, `courses`, etc.
   - Should see admin user in `users` table

### Step 3: Verify Database Connection in Render

1. **Check Render Logs**
   - Go to Render Dashboard → Your service → Logs
   - Should see: "PostgreSQL database connected successfully"
   - No more connection errors

2. **Test API Endpoints**
   - Health endpoint should still work
   - Other endpoints should work now

## ✅ Alternative: Enable Auto-Sync in Render

If you can't run the script locally, enable automatic table creation:

1. **Go to Render Dashboard**
   - Open your backend service
   - Click "Environment" tab

2. **Set ENABLE_SYNC to true**
   - Find `ENABLE_SYNC` (or create it)
   - Set value to: `true`
   - Click "Save Changes"

3. **Wait for Redeploy**
   - Render will auto-redeploy
   - Sequelize will create tables on startup

4. **Check Logs**
   - Should see: "Database synchronized"

5. **Create Default Data**
   - After tables are created, you need to create admin user and departments
   - Use Supabase SQL Editor or run reset script locally

## 🎯 Recommended: Run Script Locally

**This is the best option because:**
- ✅ No payment required
- ✅ Creates all tables correctly
- ✅ Creates default admin user with correct password hash
- ✅ Creates departments and courses
- ✅ Everything is set up properly

## 📋 Quick Checklist

- [ ] Updated `backend/.env` with Supabase DATABASE_URL
- [ ] Generated JWT_SECRET
- [ ] Ran `npm run reset-db` locally
- [ ] Verified tables in Supabase dashboard
- [ ] Verified admin user created
- [ ] Checked Render logs for successful connection
- [ ] Ready to deploy frontend!

## 🚀 After Database Setup

1. ✅ Database tables created
2. ✅ Default admin user created
3. ✅ Departments and courses created
4. ✅ Database connection successful
5. ✅ Deploy frontend to Vercel
6. ✅ Update backend CORS
7. ✅ Test full application

## 🔑 Default Admin Credentials

After running reset script:
- **Email**: `admin@faith.edu.ph`
- **Password**: `admin123`
- **⚠️ Change this after first login!**

