# Local Database Setup Guide

## 🎯 Quick Setup (3 Steps)

### Step 1: Create `.env` File

1. **Go to `backend` folder**
   - Open: `backend/.env`
   - Create it if it doesn't exist

2. **Add This Content:**
   ```env
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   DB_TYPE=postgres
   
   # JWT (Use the same one from Render, or generate a new one)
   JWT_SECRET=your_random_jwt_secret_here_change_this_in_production
   JWT_EXPIRE=7d
   
   # Server
   NODE_ENV=development
   PORT=5000
   
   # Optional
   ENABLE_SYNC=false
   ENABLE_HTTP_LOGGING=false
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   ```

3. **Generate JWT_SECRET** (if you don't have one from Render)
   - Option 1: Use online generator: https://generate-secret.vercel.app/32
   - Option 2: Use PowerShell:
     ```powershell
     -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
     ```
   - Option 3: Copy from Render Dashboard → Environment → JWT_SECRET

### Step 2: Run Reset Script

1. **Open Terminal**
   - Navigate to project: `cd C:\Users\Rufino\Desktop\Archives`

2. **Run Reset Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Wait for Completion**
   - Should see: "PostgreSQL database connected successfully"
   - Should see: "Database tables recreated"
   - Should see: "Default admin user created"
   - Should see: "Database reset completed successfully!"

### Step 3: Verify in Supabase

1. **Go to Supabase Dashboard**
   - Open your project
   - Go to "Table Editor"

2. **Check Tables**
   - Should see: `users`, `theses`, `departments`, `courses`, `calendar_events`, `audit_logs`, `thesis_authors`

3. **Check Admin User**
   - Go to `users` table
   - Should see: `admin@faith.edu.ph`

## ✅ Success!

After completing these steps:
- ✅ Database tables created
- ✅ Default admin user created
- ✅ Departments and courses created
- ✅ Ready to use!

## 🔑 Default Credentials

- **Admin Email**: `admin@faith.edu.ph`
- **Admin Password**: `admin123`
- **⚠️ Change this after first login!**

## 🚀 Next Steps

After database is set up:
1. ✅ Verify Render logs show successful connection
2. ✅ Deploy frontend to Vercel
3. ✅ Update backend CORS in Render
4. ✅ Test full application

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Check Supabase project is active
- Check password is correct

### Error: "JWT_SECRET is required"
- Make sure `JWT_SECRET` is set in `.env`
- Generate a new secret if needed

### Error: "Tables already exist"
- This is normal if you've run the script before
- The script will recreate tables
- All data will be deleted

### Error: "Foreign key constraint fails"
- The script handles this automatically
- If it persists, check Supabase connection

## 📋 Quick Checklist

- [ ] Created `backend/.env` file
- [ ] Added Supabase `DATABASE_URL`
- [ ] Added `JWT_SECRET`
- [ ] Ran `npm run reset-db`
- [ ] Verified tables in Supabase
- [ ] Verified admin user created
- [ ] Ready to deploy frontend!

