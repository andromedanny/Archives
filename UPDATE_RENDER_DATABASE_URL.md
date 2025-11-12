# Update DATABASE_URL in Render

## ✅ Your Connection String

**Your Supabase Pooler Connection String:**
```
postgresql://postgres.kgoscorwfhdosrpcnvco:[YOUR-PASSWORD]@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

## 🔧 Step-by-Step: Update in Render

### Step 1: Replace Password

Replace `[YOUR-PASSWORD]` with: `prodannyHAHA69`

**Your Final Connection String:**
```
postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

### Step 2: Update in Render Dashboard

1. **Go to Render Dashboard**
   - Visit https://render.com
   - Login to your account

2. **Open Your Backend Service**
   - Click on your service: `faith-thesis-backend` (or whatever you named it)

3. **Go to Environment Tab**
   - Click on **"Environment"** tab in the top menu
   - You'll see all your environment variables

4. **Find DATABASE_URL**
   - Scroll down to find `DATABASE_URL`
   - Click on it to edit

5. **Replace the Value**
   - Delete the old value
   - Paste your new connection string:
     ```
     postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
     ```

6. **Save Changes**
   - Click **"Save Changes"** button
   - Render will automatically redeploy your service

7. **Wait for Redeploy**
   - Wait 2-3 minutes for redeploy
   - Check the "Logs" tab to see deployment progress

### Step 3: Verify Connection

1. **Check Logs**
   - Go to **"Logs"** tab
   - Look for: `PostgreSQL database connected successfully`
   - Should NOT see: `ENETUNREACH` error

2. **Test Health Endpoint**
   - Visit: `https://your-backend-url.onrender.com/api/health`
   - Should return: `{ status: 'OK', message: 'One Faith One Archive API is running' }`

## ✅ Complete DATABASE_URL

**Copy this exact string:**
```
postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
```

## 📋 Your Complete Environment Variables (Render)

Make sure you have all these in Render:

```env
# Database (Use the pooler connection string above)
DATABASE_URL=postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres
DB_TYPE=postgres

# JWT
JWT_SECRET=[your-generated-jwt-secret]
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=10000

# URLs (Update after deploying frontend)
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-backend.onrender.com

# Storage (Supabase)
STORAGE_TYPE=supabase
SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co
SUPABASE_KEY=[your-anon-key-from-supabase]
SUPABASE_STORAGE_BUCKET=thesis-documents

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

## 🎯 Quick Action Items

1. ✅ **Update DATABASE_URL in Render:**
   - Value: `postgresql://postgres.kgoscorwfhdosrpcnvco:prodannyHAHA69@aws-1-ap-southeast-2.pooler.supabase.com:5432/postgres`

2. ✅ **Update SUPABASE_URL in Render:**
   - Value: `https://kgoscorwfhdosrpcnvco.supabase.co`
   - (Your project-ref is: `kgoscorwfhdosrpcnvco`)

3. ✅ **Save Changes**
   - Render will auto-redeploy

4. ✅ **Check Logs**
   - Should see: "PostgreSQL database connected successfully"

## 🚨 Important Notes

1. **Password in URL:**
   - Your password `prodannyHAHA69` is already in the connection string
   - No URL encoding needed (no special characters)

2. **Project Ref:**
   - Your project-ref is: `kgoscorwfhdosrpcnvco`
   - Use this for SUPABASE_URL: `https://kgoscorwfhdosrpcnvco.supabase.co`

3. **Region:**
   - Your region is: `ap-southeast-2` (Asia Pacific - Sydney)
   - This is correct for your Supabase project

4. **Port:**
   - Your pooler uses port `5432`
   - This is correct for your Supabase setup

## ✅ After Update

Once you update DATABASE_URL in Render:

1. ✅ Render will auto-redeploy (2-3 minutes)
2. ✅ Check logs for: "PostgreSQL database connected successfully"
3. ✅ Test health endpoint: `/api/health`
4. ✅ No more connection errors!

## 🎉 Success!

After updating, your backend should connect to Supabase successfully!

## 📞 Next Steps

After connection is working:

1. ✅ Run database setup: `npm run reset-db` (in Render Shell)
2. ✅ Deploy frontend to Vercel
3. ✅ Update FRONTEND_URL in Render
4. ✅ Test the full application

