# Run Database Setup Locally

## ✅ Step 1: Get JWT_SECRET from Render (OR Generate New One)

### Option A: Get from Render (Recommended)

1. **Go to Render Dashboard**
   - Open your service: `srv-d494lqa4d50c7394i7ng`
   - Click "Environment" tab
   - Find `JWT_SECRET`
   - Copy the value

2. **Update `backend/.env` File**
   - Open `backend/.env`
   - Replace `your_random_jwt_secret_here_change_this_in_production` with the value from Render
   - Save the file

### Option B: Generate New One

1. **Generate JWT Secret**
   - Go to: https://generate-secret.vercel.app/32
   - Copy the generated secret

2. **Update Both Places**
   - Update `backend/.env` file with the new secret
   - Update Render Environment variable with the same secret
   - **Important**: Use the same secret in both places!

## ✅ Step 2: Run Reset Script

1. **Open Terminal**
   - Navigate to: `C:\Users\Rufino\Desktop\Archives`

2. **Run Reset Script**
   ```bash
   cd backend
   npm run reset-db
   ```

3. **Wait for Completion**
   - Should see: "PostgreSQL database connected successfully"
   - Should see: "Database tables recreated"
   - Should see: "Default admin user created: admin@faith.edu.ph"
   - Should see: "Database reset completed successfully!"

## ✅ Step 3: Verify in Supabase

1. **Go to Supabase Dashboard**
   - Open your project
   - Go to "Table Editor"

2. **Check Tables**
   - Should see: `users`, `theses`, `departments`, `courses`, `calendar_events`, `audit_logs`, `thesis_authors`

3. **Check Admin User**
   - Go to `users` table
   - Should see: `admin@faith.edu.ph`

## ✅ Step 4: Verify Render Connection

1. **Check Render Logs**
   - Go to Render Dashboard → Your service → Logs
   - Should see: "PostgreSQL database connected successfully"
   - No more connection errors

2. **Test API Endpoints**
   - Health endpoint should still work
   - Other endpoints should work now

## 🎯 Quick Commands

```bash
# Navigate to backend
cd backend

# Run reset script
npm run reset-db

# Verify .env file exists
cat .env
```

## 🔑 Default Credentials

After running the reset script:
- **Admin Email**: `admin@faith.edu.ph`
- **Admin Password**: `admin123`
- **⚠️ Change this after first login!**

## 🐛 Troubleshooting

### Error: "Cannot connect to database"
- Check `DATABASE_URL` in `backend/.env` is correct
- Check Supabase project is active
- Check password is correct: `prodannyHAHA69`

### Error: "JWT_SECRET is required"
- Make sure `JWT_SECRET` is set in `backend/.env`
- Get it from Render or generate a new one

### Error: "Tables already exist"
- This is normal if you've run the script before
- The script will drop and recreate tables
- All existing data will be deleted

## 📋 Checklist

- [ ] Updated `backend/.env` with JWT_SECRET from Render
- [ ] Ran `npm run reset-db`
- [ ] Verified tables in Supabase dashboard
- [ ] Verified admin user created
- [ ] Checked Render logs for successful connection
- [ ] Ready to deploy frontend!

## 🚀 Next Steps

After database is set up:
1. ✅ Deploy frontend to Vercel
2. ✅ Update backend CORS in Render
3. ✅ Test full application
4. ✅ Change default admin password

