# Fix Supabase Connection Error on Render

## 🚨 Error: ENETUNREACH (IPv6 Connection Issue)

**Problem:** Render is trying to connect to Supabase using IPv6, but it's failing.

**Solution:** Use the **Connection Pooler** connection string instead of the direct connection.

## 🔧 Fix: Use Supabase Connection Pooler

### Step 1: Get the Correct Connection String from Supabase

1. **Go to Supabase Dashboard**
   - Login at https://supabase.com
   - Select your project

2. **Go to Settings → Database**
   - Click on "Settings" → "Database"

3. **Find Connection Pooling**
   - Scroll down to **Connection Pooling** section
   - You'll see two options:
     - **Session mode** (Recommended for most cases)
     - **Transaction mode** (For serverless)

4. **Copy the Connection String**
   - **Use Session mode** connection string
   - It will look like:
     ```
     postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```
   - Or:
     ```
     postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres
     ```

5. **Replace Password**
   - Replace `[YOUR-PASSWORD]` with your actual password: `prodannyHAHA69`
   - Final URL should look like:
     ```
     postgresql://postgres.abcdefghijklmnop:prodannyHAHA69@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
     ```

### Step 2: Update Render Environment Variables

1. **Go to Render Dashboard**
   - Open your backend service
   - Click on "Environment" tab

2. **Update DATABASE_URL**
   - Find `DATABASE_URL` environment variable
   - Replace it with the **pooler connection string** from Step 1
   - Make sure it uses the pooler URL (port 6543, not 5432)

3. **Add SSL Configuration (if needed)**
   - The pooler connection should work without extra SSL config
   - But if it doesn't, add:
     ```
     DB_SSL=true
     ```

4. **Save Changes**
   - Click "Save Changes"
   - Render will auto-redeploy

### Step 3: Verify Connection String Format

**Correct Format (Pooler - Use This):**
```
postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Wrong Format (Direct - Don't Use):**
```
postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

### Step 4: Check Database Configuration

Make sure your `backend/config/database.js` handles SSL properly for Supabase.

## 📝 Complete DATABASE_URL Example

```env
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:prodannyHAHA69@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
```

**Key Differences:**
- Uses `postgres.[project-ref]` (not `postgres`)
- Uses `pooler.supabase.com` (not `db.[project-ref].supabase.co`)
- Uses port `6543` (not `5432`)
- Has `?pgbouncer=true` parameter

## 🔍 Alternative: Use Transaction Mode (If Session Mode Doesn't Work)

If Session mode doesn't work, try Transaction mode:

1. **Go to Supabase → Settings → Database**
2. **Find Connection Pooling → Transaction mode**
3. **Copy the connection string**
4. **Update DATABASE_URL in Render**

## 🚨 Common Issues and Solutions

### Issue 1: Still Getting IPv6 Error
**Solution:** Make sure you're using the pooler connection string (port 6543), not the direct connection (port 5432).

### Issue 2: Connection Timeout
**Solution:** 
- Check if your Supabase project is active
- Verify your password is correct
- Make sure you're using the pooler URL

### Issue 3: SSL Error
**Solution:**
- Add `DB_SSL=true` to environment variables
- Or add `?sslmode=require` to the connection string

### Issue 4: Authentication Failed
**Solution:**
- Verify your password is correct in the connection string
- Make sure you're using the pooler connection string format
- Check if your Supabase project is active

## ✅ Step-by-Step Fix

1. **Go to Supabase Dashboard**
   - Settings → Database
   - Find Connection Pooling section

2. **Copy Pooler Connection String**
   - Use Session mode (recommended)
   - Copy the connection string
   - It should have `pooler.supabase.com` and port `6543`

3. **Replace Password in Connection String**
   - Replace `[YOUR-PASSWORD]` with `prodannyHAHA69`
   - Make sure the format is correct

4. **Update Render Environment Variable**
   - Go to Render → Your service → Environment
   - Update `DATABASE_URL` with the pooler connection string
   - Save changes

5. **Wait for Redeploy**
   - Render will automatically redeploy
   - Check logs to see if connection works

6. **Verify Connection**
   - Check logs for: "PostgreSQL database connected successfully"
   - Test health endpoint: `/api/health`

## 🎯 Quick Checklist

- [ ] Got pooler connection string from Supabase (Session mode)
- [ ] Connection string uses `pooler.supabase.com` (not `db.[project-ref].supabase.co`)
- [ ] Connection string uses port `6543` (not `5432`)
- [ ] Replaced password with: `prodannyHAHA69`
- [ ] Updated DATABASE_URL in Render
- [ ] Saved changes in Render
- [ ] Waited for redeploy
- [ ] Checked logs for successful connection

## 📋 Example Environment Variables (Render)

```env
# Database (Use Pooler Connection String)
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:prodannyHAHA69@aws-0-us-east-1.pooler.supabase.com:6543/postgres?pgbouncer=true
DB_TYPE=postgres
DB_SSL=true

# JWT
JWT_SECRET=[your-jwt-secret]
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=10000

# URLs
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com

# Storage
STORAGE_TYPE=supabase
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=[your-anon-key]
SUPABASE_STORAGE_BUCKET=thesis-documents
```

## 💡 Why This Works

**Connection Pooler:**
- Uses IPv4 (not IPv6) - compatible with Render
- Handles connections more efficiently
- Better for serverless/server environments
- Recommended by Supabase for production

**Direct Connection:**
- May use IPv6 (not supported by Render)
- Can have connection issues
- Not recommended for serverless

## 🚀 After Fix

Once you update the connection string:

1. ✅ Render will auto-redeploy
2. ✅ Check logs for successful connection
3. ✅ Test health endpoint
4. ✅ Run database setup script

## 📞 Still Having Issues?

If it still doesn't work:

1. **Check Supabase Dashboard**
   - Verify project is active
   - Check if database is running

2. **Verify Connection String**
   - Make sure it's the pooler URL
   - Check password is correct
   - Verify project-ref is correct

3. **Check Render Logs**
   - Look for more detailed error messages
   - Check if SSL is the issue

4. **Try Transaction Mode**
   - If Session mode doesn't work, try Transaction mode
   - Get connection string from Supabase

5. **Contact Support**
   - Render support for deployment issues
   - Supabase support for database issues

## ✅ Success Indicators

After fixing, you should see in logs:
```
PostgreSQL database connected successfully
Server running on port 10000
Environment: production
```

No more `ENETUNREACH` errors!

