# Railway Environment Variables

Complete list of environment variables needed for Railway deployment.

---

## 📋 Required Variables

Copy these into Railway Dashboard → Variables tab:

### Database Configuration (Supabase)

```env
# Option 1: Use connection string (recommended)
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres

# Option 2: Use individual parameters (alternative)
DB_TYPE=postgres
DB_HOST=db.project-ref.supabase.co
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=your_supabase_password
DB_SSL=true
```

**How to get**:
- Go to Supabase Dashboard → Project Settings → Database
- Copy the **Connection string** (use **Pooler** connection for better compatibility)
- Format: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`

---

### Supabase Storage Configuration

```env
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
# OR use:
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
STORAGE_TYPE=supabase
```

**How to get**:
1. **SUPABASE_URL**:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the **Project URL**: `https://your-project-ref.supabase.co`

2. **SUPABASE_KEY** or **SUPABASE_ANON_KEY**:
   - Go to Supabase Dashboard → Project Settings → API
   - Copy the **anon public** key

3. **SUPABASE_STORAGE_BUCKET**:
   - Should be: `thesis-documents` (the bucket you created)
   - Verify it exists in Supabase Dashboard → Storage

---

### JWT Configuration

```env
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

**How to generate**:
- Use a strong, random string (at least 32 characters)
- Example: `openssl rand -base64 32`
- **Never commit this to GitHub!**

---

### Server Configuration

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://onefaithonearchive.vercel.app
```

**Notes**:
- `PORT=5000` - Railway will override this with their port (usually 5000 or 3000)
- `FRONTEND_URL` - Your Vercel frontend URL (for CORS)
- `NODE_ENV=production` - Required for production mode

---

### File Upload Configuration

```env
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads
```

**Notes**:
- `MAX_FILE_SIZE` - Maximum file size in bytes (10MB = 10485760)
- `UPLOAD_PATH` - Local upload path (not used if using Supabase Storage)

---

## 🔧 Optional Variables

### Database Sync (Optional)

```env
ENABLE_SYNC=false
```

**When to use**:
- Set to `true` only when you need to create/update database tables
- Keep as `false` in production (tables should already exist)

---

### HTTP Logging (Optional)

```env
ENABLE_HTTP_LOGGING=false
```

**When to use**:
- Set to `true` to enable HTTP request logging
- Keep as `false` to reduce log output

---

## 📝 Complete Template

Copy this complete template and fill in your values:

```env
# Database Configuration (Supabase)
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
DB_TYPE=postgres
DB_SSL=true

# Supabase Storage Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
STORAGE_TYPE=supabase

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://onefaithonearchive.vercel.app

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_PATH=./uploads

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

---

## 🔍 How to Get Supabase Credentials

### 1. DATABASE_URL

1. Go to Supabase Dashboard
2. Click on your project
3. Go to **Project Settings** → **Database**
4. Scroll down to **Connection string**
5. Select **Pooler** connection (recommended)
6. Copy the connection string
7. Format: `postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres`

**Note**: If you don't know your password:
- Click **"Reset database password"**
- Save the new password securely

---

### 2. SUPABASE_URL

1. Go to Supabase Dashboard
2. Click on your project
3. Go to **Project Settings** → **API**
4. Copy the **Project URL**
5. Format: `https://your-project-ref.supabase.co`

---

### 3. SUPABASE_KEY (anon key)

1. Go to Supabase Dashboard
2. Click on your project
3. Go to **Project Settings** → **API**
4. Copy the **anon public** key
5. This is your `SUPABASE_KEY` or `SUPABASE_ANON_KEY`

---

## 🔐 Security Checklist

- [ ] `JWT_SECRET` is a strong, random string (at least 32 characters)
- [ ] `NODE_ENV=production` is set
- [ ] `DB_SSL=true` for Supabase connection
- [ ] `FRONTEND_URL` is set to your Vercel URL
- [ ] `DATABASE_URL` contains the correct password
- [ ] `SUPABASE_KEY` is the anon key (not the service role key)
- [ ] All sensitive values are kept secret (never commit to GitHub)

---

## 🚨 Common Mistakes

### 1. Wrong Database Connection String
- **Error**: `Database connection error`
- **Fix**: Use Supabase **Pooler** connection string (port 6543 or 5432)

### 2. Missing DB_SSL
- **Error**: `SSL connection required`
- **Fix**: Set `DB_SSL=true`

### 3. Wrong SUPABASE_KEY
- **Error**: `Supabase Storage client NOT initialized`
- **Fix**: Use the **anon public** key (not service role key)

### 4. Missing FRONTEND_URL
- **Error**: CORS errors in browser
- **Fix**: Set `FRONTEND_URL=https://onefaithonearchive.vercel.app`

### 5. Wrong STORAGE_TYPE
- **Error**: Files not uploading to Supabase
- **Fix**: Set `STORAGE_TYPE=supabase`

---

## 📊 Railway Environment Variables UI

In Railway Dashboard:
1. Go to your service
2. Click **"Variables"** tab
3. Click **"New Variable"**
4. Enter:
   - **Key**: `DATABASE_URL`
   - **Value**: `postgresql://...`
   - Click **"Add"**
5. Repeat for all variables

---

## 🔄 Update Variables

To update variables:
1. Go to Railway Dashboard → Your Service → **Variables** tab
2. Click on the variable you want to update
3. Edit the value
4. Click **"Save"**
5. Railway will automatically redeploy

---

## ✅ Verification

After setting all variables:

1. **Check Railway logs**:
   - Go to Railway Dashboard → Your Service → **Logs** tab
   - Look for: `PostgreSQL database connected successfully`
   - Look for: `Supabase Storage client initialized`

2. **Test health endpoint**:
   - Visit: `https://your-project.railway.app/api/health`
   - Should return: `{ status: "OK" }`

3. **Test database connection**:
   - Check Railway logs for database connection success
   - Try logging in from frontend

4. **Test Supabase Storage**:
   - Try uploading a file
   - Check Supabase Storage bucket for the file

---

## 🆘 Troubleshooting

### Database Connection Error
- Check `DATABASE_URL` is correct
- Verify `DB_SSL=true`
- Use Supabase Pooler connection
- Check Supabase database is running

### Supabase Storage Error
- Check `SUPABASE_URL` and `SUPABASE_KEY`
- Verify `STORAGE_TYPE=supabase`
- Check Supabase Storage bucket exists
- Verify Supabase Storage policies are set up

### CORS Error
- Check `FRONTEND_URL` is set
- Verify Vercel `VITE_API_URL` points to Railway
- Check browser console for exact error

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

