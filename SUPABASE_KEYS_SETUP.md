# Where to Paste Supabase Keys

## 🔑 What You Need from Supabase

After creating your Supabase project, you need these 4 things:

1. **Database Connection String** (DATABASE_URL)
2. **Supabase URL** (SUPABASE_URL)
3. **Supabase API Key** (SUPABASE_KEY - use the `anon` key)
4. **Storage Bucket Name** (SUPABASE_STORAGE_BUCKET) - You already created: `thesis-documents`

## 📍 Where to Find These in Supabase

### 1. Database Connection String
- Go to: **Settings → Database**
- Scroll down to **Connection String**
- Select **URI** tab
- Copy the connection string
- Format: `postgresql://postgres.[project-ref]:[password]@aws-0-us-east-1.pooler.supabase.com:6543/postgres`
- Or use: `postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres`

### 2. Supabase URL
- Go to: **Settings → API**
- Copy the **Project URL**
- Format: `https://[project-ref].supabase.co`

### 3. Supabase API Key
- Go to: **Settings → API**
- Copy the **anon public** key (this is the one you need)
- Format: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- ⚠️ **Use the `anon` key, NOT the `service_role` key for now**

### 4. Storage Bucket Name
- You already created: `thesis-documents`
- Verify in: **Storage → Buckets**

## 🎯 Where to Paste These Keys

### Option 1: Render Backend (Production) ⭐ RECOMMENDED

**This is where you'll deploy your backend server.**

1. **Go to Render Dashboard**
   - https://render.com
   - Sign in with your account

2. **Create a New Web Service** (if not created yet)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repository
   - Configure:
     - **Name**: `faith-thesis-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Plan**: Free

3. **Add Environment Variables**
   - Scroll down to **Environment Variables** section
   - Click "Add Environment Variable"
   - Add these one by one:

   ```
   NODE_ENV=production
   PORT=10000
   
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   DB_TYPE=postgres
   
   JWT_SECRET=your_random_secret_key_here
   JWT_EXPIRE=7d
   
   FRONTEND_URL=https://your-app.vercel.app
   BACKEND_URL=https://your-app.onrender.com
   
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://[project-ref].supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_STORAGE_BUCKET=thesis-documents
   
   ENABLE_SYNC=false
   ENABLE_HTTP_LOGGING=false
   ```

4. **Generate JWT_SECRET**
   - For JWT_SECRET, generate a random string
   - You can use: https://generate-secret.vercel.app/32
   - Or run in terminal: `openssl rand -base64 32`
   - Copy the generated string and paste it as JWT_SECRET

5. **Save and Deploy**
   - Click "Create Web Service"
   - Render will start deploying
   - Wait for deployment to complete (5-10 minutes)

### Option 2: Local .env File (For Testing)

**Use this for local development and testing before deploying.**

1. **Create/Edit `.env` file in `backend` folder**
   - Path: `backend/.env`
   - Create this file if it doesn't exist

2. **Add these environment variables:**

   ```env
   # Database (Supabase)
   DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
   DB_TYPE=postgres
   
   # JWT
   JWT_SECRET=your_random_secret_key_here
   JWT_EXPIRE=7d
   
   # Server
   NODE_ENV=development
   PORT=5000
   
   # URLs (update after deploying)
   FRONTEND_URL=http://localhost:3000
   BACKEND_URL=http://localhost:5000
   
   # Storage (Supabase)
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://[project-ref].supabase.co
   SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_STORAGE_BUCKET=thesis-documents
   
   # Optional
   ENABLE_SYNC=false
   ENABLE_HTTP_LOGGING=false
   ```

3. **Replace the placeholders:**
   - `[password]` - Your Supabase database password
   - `[project-ref]` - Your Supabase project reference ID
   - `your_random_secret_key_here` - Generate a random string for JWT

4. **Test locally:**
   - Run: `npm start` in the `backend` folder
   - Should connect to Supabase successfully

### Option 3: Vercel Frontend (After Backend is Deployed)

**Frontend doesn't need Supabase keys directly. It only needs the backend API URL.**

1. **Go to Vercel Dashboard**
   - https://vercel.com
   - Sign in with your account

2. **Create New Project** (if not created yet)
   - Click "New Project"
   - Import your GitHub repository
   - Select your repository

3. **Configure Project:**
   - Framework Preset: `Vite`
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`

4. **Add Environment Variable:**
   - Only ONE variable needed:
   ```
   VITE_API_URL=https://your-backend-url.onrender.com/api
   ```
   - Replace `your-backend-url.onrender.com` with your actual Render backend URL

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment

## 📝 Example .env File (Backend)

Here's a complete example of what your `backend/.env` file should look like:

```env
# Database (Supabase)
DATABASE_URL=postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
DB_TYPE=postgres

# JWT
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRE=7d

# Server
NODE_ENV=development
PORT=5000

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:5000

# Storage (Supabase)
STORAGE_TYPE=supabase
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
SUPABASE_STORAGE_BUCKET=thesis-documents

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

## ✅ Checklist

- [ ] Got DATABASE_URL from Supabase (Settings → Database)
- [ ] Got SUPABASE_URL from Supabase (Settings → API)
- [ ] Got SUPABASE_KEY (anon key) from Supabase (Settings → API)
- [ ] Verified storage bucket exists: `thesis-documents`
- [ ] Generated JWT_SECRET (random string)
- [ ] Created Render account
- [ ] Created Web Service in Render
- [ ] Added all environment variables in Render
- [ ] Deployed backend to Render
- [ ] Created Vercel account
- [ ] Added VITE_API_URL in Vercel
- [ ] Deployed frontend to Vercel

## 🚨 Important Notes

1. **Never commit `.env` files to GitHub**
   - They contain sensitive information
   - Already in `.gitignore`

2. **Use different JWT_SECRET for production**
   - Don't use the same secret for development and production
   - Generate a strong random string for production

3. **Supabase Keys:**
   - Use `anon` key for client-side operations
   - Use `service_role` key only for server-side operations (backend)
   - For now, use `anon` key in backend (it's safer)

4. **Storage Bucket:**
   - Make sure bucket name matches exactly: `thesis-documents`
   - Check bucket policies in Supabase dashboard

## 🎯 Next Steps

1. ✅ Set up Supabase (DONE - you have the keys)
2. ⏭️ Deploy backend to Render (paste keys in Render environment variables)
3. ⏭️ Set up database tables (run migration script)
4. ⏭️ Deploy frontend to Vercel (only needs backend URL)

## 📞 Need Help?

If you're stuck:
1. Check Supabase dashboard for all the values
2. Verify you copied the correct connection string (URI format)
3. Make sure storage bucket exists and is named correctly
4. Check Render logs if backend fails to start
5. Verify all environment variables are set correctly

