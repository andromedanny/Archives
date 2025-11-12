# Set Up Database Tables First

## 🎯 The Issue

Your backend server is running, but you need to create the database tables in Supabase first.

## ✅ Solution: Create Database Tables

### Option 1: Using Render Shell (Recommended)

1. **Go to Render Dashboard**
   - Open your backend service
   - Click on "Shell" tab (or terminal icon)

2. **Run Database Setup Script**
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
   - Go to Supabase Dashboard
   - Go to "Table Editor"
   - You should see tables: `users`, `theses`, `departments`, `courses`, etc.

### Option 2: Using Local Machine

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

## 🔍 Verify Database Connection

### Check Render Logs
1. **Go to Render Dashboard**
   - Open your service
   - Click "Logs" tab
   - Should see: "PostgreSQL database connected successfully"

### Check Supabase Dashboard
1. **Go to Supabase Dashboard**
   - Go to "Table Editor"
   - Should see all tables created

## 🎯 After Database Setup

Once tables are created:

1. ✅ **Test Health Endpoint**
   - Visit: `https://your-backend.onrender.com/api/health`
   - Should return: `{ status: 'OK' }`

2. ✅ **Test Database Connection**
   - Server logs should show: "PostgreSQL database connected successfully"

3. ✅ **Ready for Frontend**
   - Deploy frontend to Vercel
   - Connect frontend to backend
   - Test the full application

## 📋 Quick Checklist

- [ ] Database tables created (ran `npm run reset-db`)
- [ ] Verified tables in Supabase dashboard
- [ ] Default admin user created
- [ ] Tested health endpoint
- [ ] Verified database connection in logs

## 🚨 Troubleshooting

### Database Connection Still Failing
- **Check DATABASE_URL**: Verify it's the pooler connection string
- **Check Password**: Make sure password is correct
- **Check Supabase**: Make sure project is active
- **Check Logs**: Look for specific error messages

### Tables Not Creating
- **Check Connection**: Make sure database connection works
- **Check Logs**: Look for errors in reset script
- **Verify DATABASE_URL**: Make sure it's correct
- **Try Again**: Run reset script again

### Health Endpoint Still Not Working
- **Check Server Logs**: See if server is running
- **Check URL**: Make sure you're using the correct backend URL
- **Check Route**: Health endpoint is at `/api/health`
- **Wait for Redeploy**: Server might need to restart

## ✅ Success!

After setting up the database:

1. ✅ Tables created in Supabase
2. ✅ Default admin user created
3. ✅ Health endpoint works
4. ✅ Database connection successful
5. ✅ Ready to deploy frontend!

## 🎯 Next Steps

After database is set up:

1. ✅ Test health endpoint
2. ✅ Deploy frontend to Vercel
3. ✅ Update backend CORS
4. ✅ Test full application
5. ✅ Change default admin password

