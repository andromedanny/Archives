# Railway Fix: Database Connection Error

## 🚨 Error Message

```
Database connection error: 
⚠️  Server will continue without database connection. Some features may not work.
```

This error means Railway cannot connect to your Supabase PostgreSQL database.

---

## ✅ Quick Fix Steps

### Step 1: Check Railway Environment Variables

1. **Go to your Railway project**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service)
3. **Go to "Variables" tab** (top menu)
4. **Check if `DATABASE_URL` is set**:
   - If not set, add it (see Step 2)
   - If set, verify it's correct (see Step 3)

---

### Step 2: Get Supabase Connection String

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Project Settings** → **Database** (left sidebar)
4. **Scroll down to "Connection string"**
5. **Select "Connection pooling" tab** (recommended for Railway)
6. **Select "Session mode"** or **"Transaction mode"**
7. **Copy the connection string**:
   - Format: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
   - **Note**: Make sure to use port **6543** (Pooler) for Railway
   - **Note**: If the connection string doesn't have `?pgbouncer=true`, add it at the end

---

### Step 3: Set DATABASE_URL in Railway

1. **In Railway Dashboard** → **Your Service** → **"Variables" tab**
2. **Add or update `DATABASE_URL`**:
   - **Key**: `DATABASE_URL`
   - **Value**: Paste your Supabase connection string from Step 2
   - **Example**: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
3. **Click "Add" or "Save"**
4. **Railway will automatically redeploy**

---

### Step 4: Verify Database Connection

1. **Wait for redeployment to complete** (check Deployments tab)
2. **Go to "Deployments" tab** → **Latest deployment** → **Logs**
3. **Look for**:
   - ✅ `PostgreSQL database connected successfully`
   - ❌ If you still see the error, continue to Step 5

---

## 🔍 Detailed Troubleshooting

### Issue 1: DATABASE_URL Not Set

**Problem**: `DATABASE_URL` environment variable is missing

**Solution**:
1. Go to Railway → Variables tab
2. Add `DATABASE_URL` with your Supabase connection string
3. Use Pooler connection (port 6543) for Railway
4. Wait for redeployment

---

### Issue 2: Incorrect Connection String

**Problem**: Connection string is incorrect or malformed

**Solution**:
1. **Verify connection string format**:
   - Correct: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
   - Wrong: `postgres://postgres:password@db.project-ref.supabase.co:5432/postgres` (wrong port)
   - Wrong: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres` (missing `?pgbouncer=true`)

2. **Check for typos**:
   - Verify project-ref is correct
   - Verify password is correct
   - Verify port is 6543 (Pooler) for Railway

3. **Use Pooler connection** (recommended for Railway):
   - Port: **6543** (not 5432)
   - Add `?pgbouncer=true` at the end

---

### Issue 3: Wrong Password

**Problem**: Password in connection string is incorrect

**Solution**:
1. **Go to Supabase Dashboard** → **Project Settings** → **Database**
2. **Click "Reset database password"** (if you don't know the password)
3. **Copy the new password**
4. **Update `DATABASE_URL` in Railway** with the new password
5. **Wait for redeployment**

---

### Issue 4: Using Direct Connection Instead of Pooler

**Problem**: Using Direct connection (port 5432) instead of Pooler (port 6543)

**Solution**:
1. **Use Pooler connection** (port 6543) for Railway
2. **Connection string format**: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
3. **Why**: Pooler connection works better with Railway and avoids connection limits

---

### Issue 5: Database Not Accessible

**Problem**: Supabase database is not running or not accessible

**Solution**:
1. **Check Supabase Dashboard** → **Project Settings** → **Database**
2. **Verify database is running** (should show "Active" status)
3. **Check if project is paused** (Supabase free tier pauses after inactivity)
4. **If paused, unpause it** in Supabase Dashboard

---

### Issue 6: SSL Configuration Issue

**Problem**: SSL connection issue

**Solution**:
1. **The code automatically enables SSL for PostgreSQL**, so you don't need to set `DB_SSL`
2. **If using `DATABASE_URL`, SSL is handled automatically**
3. **Make sure you're using Pooler connection** (port 6543) for better SSL compatibility

---

## 📋 Required Environment Variables

Make sure these are set in Railway:

```env
# Database (Supabase PostgreSQL) - REQUIRED
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true

# Optional (only if not using DATABASE_URL)
DB_TYPE=postgres
DB_SSL=true
```

**Note**: If using `DATABASE_URL`, you don't need to set `DB_TYPE` or `DB_SSL` (auto-detected).

---

## 🎯 Step-by-Step Fix

### 1. Get Supabase Connection String

1. Go to Supabase Dashboard → Project Settings → Database
2. Select "Connection pooling" tab
3. Select "Session mode" or "Transaction mode"
4. Copy the connection string
5. Format: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`

### 2. Set DATABASE_URL in Railway

1. Go to Railway Dashboard → Your Service → Variables tab
2. Add or update `DATABASE_URL`
3. Paste the connection string from Step 1
4. Save (Railway will redeploy)

### 3. Verify Connection

1. Wait for redeployment to complete
2. Check logs for: `PostgreSQL database connected successfully`
3. Test health endpoint: `https://your-service.railway.app/api/health`

---

## 🔍 Check Railway Logs

1. **Go to Railway Dashboard** → **Your Service** → **"Deployments" tab**
2. **Click on the latest deployment**
3. **Check the logs** for:
   - `Database connection error: ...` (this will show the specific error)
   - `PostgreSQL database connected successfully` (success message)

**Common error messages**:
- `Connection refused` → Database URL is wrong or database is not accessible
- `Password authentication failed` → Password is incorrect
- `Connection timeout` → Network issue or wrong port
- `SSL connection required` → SSL configuration issue

---

## ✅ Verification Checklist

- [ ] `DATABASE_URL` is set in Railway Variables
- [ ] Connection string uses Pooler connection (port 6543)
- [ ] Connection string includes `?pgbouncer=true`
- [ ] Password in connection string is correct
- [ ] Supabase database is running (check Supabase Dashboard)
- [ ] Deployment completed successfully
- [ ] Logs show "PostgreSQL database connected successfully"
- [ ] Health endpoint works: `https://your-service.railway.app/api/health`

---

## 🆘 Still Having Issues?

### Check Railway Logs

1. Go to Railway Dashboard → Your Service → Deployments → Latest deployment → Logs
2. Look for the specific error message
3. The error message will tell you what's wrong:
   - `Connection refused` → Database URL or password is wrong
   - `Password authentication failed` → Password is incorrect
   - `Connection timeout` → Network issue or wrong port
   - `SSL connection required` → SSL configuration issue

### Test Connection String

1. Copy your `DATABASE_URL` from Railway
2. Test it locally (if you have PostgreSQL client):
   ```bash
   psql "your-connection-string"
   ```
3. Or use an online PostgreSQL connection tester

### Verify Supabase Database

1. Go to Supabase Dashboard → Project Settings → Database
2. Verify database is running (should show "Active")
3. Check if project is paused (unpause if needed)
4. Verify connection string is correct

---

## 📚 Related Guides

- **RAILWAY_ENVIRONMENT_VARIABLES.md** - All environment variables
- **RAILWAY_SETUP_GUIDE.md** - Complete setup guide
- **SUPABASE_POOLER_SETUP.md** - Supabase Pooler connection guide

---

## 🎉 Success!

Once the database connection works, you should see:
- ✅ `PostgreSQL database connected successfully`
- ✅ Health endpoint works
- ✅ Login works
- ✅ Database operations work

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

