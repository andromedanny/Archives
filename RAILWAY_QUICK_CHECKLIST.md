# Railway Setup Quick Checklist

## ✅ Step-by-Step Checklist

### 1. Create Railway Account
- [ ] Go to https://railway.app
- [ ] Sign up with GitHub
- [ ] Authorize Railway to access repositories

### 2. Create New Project
- [ ] Click "New Project"
- [ ] Select "Deploy from GitHub repo"
- [ ] Choose your repository
- [ ] Wait for Railway to detect Node.js

### 3. Configure Service
- [ ] Go to Settings → Source
- [ ] Set Root Directory: `backend`
- [ ] Verify Start Command: `npm start`

### 4. Set Environment Variables
- [ ] `DATABASE_URL` (Supabase connection string)
- [ ] `DB_TYPE=postgres`
- [ ] `DB_SSL=true`
- [ ] `SUPABASE_URL` (Supabase project URL)
- [ ] `SUPABASE_KEY` (Supabase anon key)
- [ ] `SUPABASE_STORAGE_BUCKET=thesis-documents`
- [ ] `STORAGE_TYPE=supabase`
- [ ] `JWT_SECRET` (strong random string)
- [ ] `JWT_EXPIRE=7d`
- [ ] `NODE_ENV=production`
- [ ] `PORT=5000`
- [ ] `FRONTEND_URL=https://onefaithonearchive.vercel.app`
- [ ] `ENABLE_SYNC=false`
- [ ] `ENABLE_HTTP_LOGGING=false`
- [ ] `MAX_FILE_SIZE=10485760`

### 5. Deploy
- [ ] Wait for deployment to complete
- [ ] Check deployment logs for errors
- [ ] Copy Railway URL: `https://your-project.railway.app`

### 6. Update Frontend (Vercel)
- [ ] Go to Vercel Dashboard → Settings → Environment Variables
- [ ] Add/Update: `VITE_API_URL=https://your-project.railway.app/api`
- [ ] Redeploy Vercel frontend

### 7. Test
- [ ] Test health endpoint: `https://your-project.railway.app/api/health`
- [ ] Test frontend login
- [ ] Test file upload
- [ ] Check browser console for errors
- [ ] Check Railway logs for errors

---

## 🔍 Quick Test Commands

### Test Health Endpoint
```bash
curl https://your-project.railway.app/api/health
```

### Test Database Connection
Check Railway logs for: `PostgreSQL database connected successfully`

### Test Supabase Storage
Check Railway logs for: `Supabase Storage client initialized`

---

## 🚨 Common Issues

### Database Connection Error
- Check `DATABASE_URL` is correct
- Use Supabase Pooler connection (port 6543)
- Verify `DB_SSL=true`

### CORS Error
- Check `FRONTEND_URL` is set
- Verify Vercel `VITE_API_URL` points to Railway
- Check browser console for exact error

### File Upload Error
- Check `SUPABASE_URL` and `SUPABASE_KEY`
- Verify Supabase Storage bucket exists
- Check Supabase Storage policies

### Build Failed
- Check Root Directory is `backend`
- Verify `package.json` exists
- Check build logs for missing dependencies

---

## 📋 Environment Variables Template

Copy this and fill in your values:

```env
# Database
DATABASE_URL=postgresql://postgres:password@db.project-ref.supabase.co:5432/postgres
DB_TYPE=postgres
DB_SSL=true

# Supabase Storage
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_KEY=your_supabase_anon_key
SUPABASE_STORAGE_BUCKET=thesis-documents
STORAGE_TYPE=supabase

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://onefaithonearchive.vercel.app

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
MAX_FILE_SIZE=10485760
```

---

## 🎯 Success Criteria

- [ ] Health endpoint returns `{ status: "OK" }`
- [ ] Frontend can connect to backend
- [ ] Login works
- [ ] File upload works
- [ ] No CORS errors in browser console
- [ ] No errors in Railway logs

---

## 📞 Need Help?

1. Check Railway logs
2. Check Supabase logs
3. Check browser console
4. Verify environment variables
5. Test health endpoint
6. See `RAILWAY_SETUP_GUIDE.md` for detailed steps

---

**Last Updated**: 2024-01-01

