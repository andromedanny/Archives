# Set Up Database Without Render Shell

## 🚨 The Issue

Render Shell might require payment, but we have alternatives!

## ✅ Solution 1: Enable Automatic Table Creation (EASIEST!)

This is the simplest method - let Sequelize create tables automatically.

### Step 1: Update Render Environment Variables

1. **Go to Render Dashboard**
   - Open your backend service
   - Click "Environment" tab

2. **Add/Update Environment Variable**
   - Find `ENABLE_SYNC` (or create it if it doesn't exist)
   - Set value to: `true`
   - Click "Save Changes"

3. **Wait for Redeploy**
   - Render will auto-redeploy (2-3 minutes)
   - Sequelize will automatically create tables on startup

4. **Check Logs**
   - Go to "Logs" tab
   - Should see: "Database synchronized"
   - Should see: "PostgreSQL database connected successfully"

5. **Verify in Supabase**
   - Go to Supabase Dashboard → Table Editor
   - Should see all tables created

### Step 2: Create Default Data (Admin User, Departments, Courses)

After tables are created, you need to create the default admin user and departments.

#### Option A: Use Supabase SQL Editor (Recommended)

1. **Go to Supabase Dashboard**
   - Go to "SQL Editor"

2. **Run This SQL Script:**
   ```sql
   -- Insert default admin user
   INSERT INTO users (first_name, last_name, email, password, role, department, is_active, is_email_verified, created_at, updated_at)
   VALUES (
     'Admin',
     'User',
     'admin@faith.edu.ph',
     '$2a$10$rQ8K8K8K8K8K8K8K8K8KuK8K8K8K8K8K8K8K8K8K8K8K8K8K8K8K',
     'admin',
     'College of Computing and Information Technology',
     true,
     true,
     NOW(),
     NOW()
   )
   ON CONFLICT (email) DO NOTHING;
   
   -- Note: You'll need to hash the password 'admin123' using bcrypt
   -- Or use the reset script to create the admin user with proper password hash
   ```

#### Option B: Use Local Machine to Run Reset Script

Run the reset script on your local machine:

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
   - Verify tables and default data are created

## ✅ Solution 2: Use Supabase SQL Editor (Manual)

Create tables manually using SQL.

### Step 1: Go to Supabase SQL Editor

1. **Go to Supabase Dashboard**
   - Select your project
   - Click "SQL Editor" in the left sidebar

2. **Create Tables Manually**
   - You can run the SQL scripts to create tables
   - But this is complex - better to use Solution 1

## ✅ Solution 3: Run Reset Script Locally (BEST!)

This is the best alternative - run the script on your local machine.

### Step 1: Update Local .env File

1. **Open `backend/.env` File**
   - Create it if it doesn't exist

2. **Add Supabase Connection:**
   ```env
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
   DB_TYPE=postgres
   
   # JWT
   JWT_SECRET=your_random_jwt_secret_here
   JWT_EXPIRE=7d
   
   # Server
   NODE_ENV=development
   PORT=5000
   
   # URLs
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   
   # Storage (Supabase)
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co
   SUPABASE_KEY=your_anon_key_here
   SUPABASE_STORAGE_BUCKET=thesis-documents
   
   # Optional
   ENABLE_SYNC=false
   ENABLE_HTTP_LOGGING=false
   ```

### Step 2: Run Reset Script

1. **Open Terminal**
   - Navigate to your project directory

2. **Run Reset Script**
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
   - Go to Supabase Dashboard → Table Editor
   - Should see all tables created
   - Should see admin user in `users` table

## ✅ Solution 4: Enable Auto-Sync in Render (SIMPLEST!)

Let Sequelize automatically create tables when the server starts.

### Step 1: Update Render Environment

1. **Go to Render Dashboard**
   - Open your backend service
   - Click "Environment" tab

2. **Set ENABLE_SYNC to true**
   - Find `ENABLE_SYNC` environment variable
   - Set value to: `true`
   - Click "Save Changes"

3. **Wait for Redeploy**
   - Render will auto-redeploy
   - On startup, Sequelize will create tables automatically

4. **Check Logs**
   - Should see: "Database synchronized"
   - Tables will be created automatically

### Step 2: Create Default Data

After tables are created, create default admin user and departments.

**Use Supabase SQL Editor or run reset script locally to create default data.**

## 🎯 Recommended: Solution 3 (Run Locally)

**Best Option:** Run the reset script on your local machine.

### Why This Works:
- ✅ No payment required
- ✅ Creates all tables
- ✅ Creates default admin user with correct password hash
- ✅ Creates departments and courses
- ✅ Everything is set up correctly

### Steps:
1. Update `backend/.env` with Supabase connection
2. Run: `cd backend && npm run reset-db`
3. Verify in Supabase dashboard
4. Done!

## 📋 Quick Checklist

### Option 1: Enable Auto-Sync
- [ ] Set `ENABLE_SYNC=true` in Render
- [ ] Wait for redeploy
- [ ] Check logs for "Database synchronized"
- [ ] Verify tables in Supabase
- [ ] Create default data (admin user, departments)

### Option 2: Run Locally (Recommended)
- [ ] Update `backend/.env` with Supabase DATABASE_URL
- [ ] Run: `npm run reset-db`
- [ ] Verify tables in Supabase
- [ ] Verify admin user created
- [ ] Done!

## 🚨 Important Notes

1. **Password Hashing**: The reset script properly hashes the admin password. If you create admin manually via SQL, you need to hash the password first.

2. **Default Admin**: After running reset script, you'll have:
   - Email: `admin@faith.edu.ph`
   - Password: `admin123`

3. **Tables Created**: The script creates all necessary tables and relationships.

4. **Verification**: Always verify in Supabase dashboard that tables are created.

## ✅ Success!

After setting up the database:

1. ✅ Tables created in Supabase
2. ✅ Default admin user created
3. ✅ Departments and courses created
4. ✅ Database connection successful
5. ✅ Ready to deploy frontend!

## 🎯 Next Steps

After database is set up:

1. ✅ Test API endpoints
2. ✅ Deploy frontend to Vercel
3. ✅ Update backend CORS
4. ✅ Test full application
5. ✅ Change default admin password

