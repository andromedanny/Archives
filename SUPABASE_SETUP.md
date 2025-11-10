# Supabase Setup Guide

## 🎯 Overview

This guide will help you set up Supabase (PostgreSQL) as your cloud database for the FAITH Colleges Thesis Archive.

## 📋 Prerequisites

- Supabase account (free tier available)
- GitHub account (for deployment)
- Backend code updated for PostgreSQL

## 🚀 Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Click "New Project"
4. Fill in project details:
   - **Name**: `faith-thesis-archive` (or your preferred name)
   - **Database Password**: Choose a strong password (save this!)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Free tier is sufficient for development
5. Click "Create new project"
6. Wait for project to be created (takes 1-2 minutes)

## 🔑 Step 2: Get Connection Details

1. In your Supabase project dashboard, go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Copy the **URI** connection string:
   - Format: `postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres`
4. Alternatively, you can use individual parameters:
   - **Host**: `db.[PROJECT-REF].supabase.co`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **User**: `postgres`
   - **Password**: (the one you set during project creation)

## 🔧 Step 3: Install PostgreSQL Dependencies

In your backend directory, install PostgreSQL drivers:

```bash
cd backend
npm install pg pg-hstore
```

These packages are already added to `package.json`, so just run:
```bash
npm install
```

## 📝 Step 4: Configure Environment Variables

### Option A: Using Connection String (Recommended)

In your backend `.env` file or Railway environment variables:

```env
# Supabase Connection String
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# Or set DB_TYPE explicitly
DB_TYPE=postgres

# Other required variables
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.railway.app
STORAGE_TYPE=local
```

### Option B: Using Individual Parameters

```env
# Database Configuration
DB_TYPE=postgres
DB_HOST=db.[PROJECT-REF].supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_password
DB_SSL=true

# Other required variables
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
NODE_ENV=production
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.railway.app
STORAGE_TYPE=local
```

## 🗄️ Step 5: Create Database Schema

### Option A: Using Reset Script (Recommended)

1. Update your `backend/scripts/reset-database.js` if needed
2. Run the reset script:
   ```bash
   cd backend
   npm run reset-db
   ```

### Option B: Using Supabase SQL Editor

1. Go to your Supabase project dashboard
2. Click on **SQL Editor**
3. Run the following SQL to create tables (or use Sequelize sync):

```sql
-- Note: Sequelize will create tables automatically when you run the app
-- But you can also create them manually using the SQL Editor
```

### Option C: Using Sequelize Sync

The database configuration will automatically create tables when you start the server in development mode.

## 🔒 Step 6: Configure SSL (Required for Supabase)

Supabase requires SSL connections. The database configuration is already set up to use SSL:

```javascript
dialectOptions: {
  ssl: {
    require: true,
    rejectUnauthorized: false
  }
}
```

Make sure `DB_SSL` is not set to `false` in your environment variables.

## 🧪 Step 7: Test Connection

1. Start your backend server:
   ```bash
   cd backend
   npm start
   ```

2. Check the console for:
   ```
   PostgreSQL database connected successfully
   Database synchronized
   ```

3. If you see errors, check:
   - Connection string is correct
   - Password is correct
   - SSL is enabled
   - Network allows connections to Supabase

## 📊 Step 8: Verify Tables Created

1. Go to Supabase dashboard
2. Click on **Table Editor**
3. You should see tables:
   - `users`
   - `theses`
   - `calendar_events`
   - `departments`
   - `courses`
   - `thesis_authors`
   - etc.

## 🚀 Step 9: Deploy Backend

### Using Railway

1. Go to https://railway.app
2. Create new project
3. Deploy from GitHub
4. Set root directory to `backend`
5. Add environment variables (from Step 4)
6. Deploy

### Using Render

1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `backend`
5. Add environment variables (from Step 4)
6. Deploy

## 🔍 Step 10: Verify Deployment

1. Check backend logs for successful database connection
2. Test API endpoints
3. Verify data is being stored in Supabase
4. Check Supabase dashboard for tables and data

## 🎯 Key Differences: MySQL vs PostgreSQL

### 1. ENUM Types
- **MySQL**: ENUMs are native types
- **PostgreSQL**: ENUMs are created as custom types (Sequelize handles this automatically)

### 2. Auto Increment
- **MySQL**: `AUTO_INCREMENT`
- **PostgreSQL**: `SERIAL` or `BIGSERIAL` (Sequelize handles this)

### 3. JSON Support
- Both support JSON natively
- Sequelize uses `DataTypes.JSON` which works for both

### 4. Connection String
- **MySQL**: `mysql://user:password@host:port/database`
- **PostgreSQL**: `postgresql://user:password@host:port/database`

### 5. SSL
- Supabase requires SSL connections
- MySQL may or may not require SSL depending on provider

## 🐛 Troubleshooting

### Issue: Connection Timeout
**Solution**: 
- Check if Supabase project is active
- Verify connection string is correct
- Check network/firewall settings

### Issue: SSL Error
**Solution**: 
- Make sure `DB_SSL` is not set to `false`
- Verify SSL configuration in database.js
- Check Supabase SSL requirements

### Issue: Authentication Failed
**Solution**: 
- Verify password is correct
- Check username is `postgres`
- Verify database name is `postgres`

### Issue: Tables Not Created
**Solution**: 
- Run `npm run reset-db`
- Or manually sync database in development mode
- Check Sequelize logs for errors

### Issue: ENUM Errors
**Solution**: 
- Sequelize automatically creates ENUM types in PostgreSQL
- If issues persist, check model definitions
- Verify ENUM values are consistent

## ✅ Checklist

- [ ] Supabase project created
- [ ] Connection string obtained
- [ ] PostgreSQL dependencies installed
- [ ] Environment variables configured
- [ ] Database schema created
- [ ] SSL configured
- [ ] Connection tested
- [ ] Tables verified
- [ ] Backend deployed
- [ ] Deployment verified

## 📞 Support

If you encounter issues:
1. Check Supabase documentation: https://supabase.com/docs
2. Check Sequelize PostgreSQL docs: https://sequelize.org/docs/v6/getting-started/
3. Check backend logs for errors
4. Verify environment variables
5. Test connection locally first

## 🎉 Success!

Your Supabase database should now be set up and connected to your backend!

Next steps:
1. Deploy frontend to Vercel
2. Update frontend API URL
3. Test full application
4. Set up cloud storage (optional)

