# Railway Fix: Theses Not Visible in Vercel App

## 🚨 Problem

Theses uploaded cannot be seen in the Vercel app. The thesis list page is empty or shows no results.

---

## 🔍 Possible Causes

### 1. Thesis Status Not Published
**Issue**: Theses are uploaded but status is not set to "Published"

**Solution**: Check thesis status in database and publish them

### 2. Thesis Not Public
**Issue**: Theses have `is_public: false`

**Solution**: Check `is_public` flag in database and set to `true`

### 3. Department Mismatch
**Issue**: Logged-in user's department doesn't match thesis department

**Solution**: Verify department matching logic

### 4. Database Connection Issue
**Issue**: Backend cannot connect to database

**Solution**: Check database connection and Railway logs

### 5. API Endpoint Not Working
**Issue**: Frontend cannot fetch theses from backend

**Solution**: Check API endpoint and network requests

---

## ✅ Step-by-Step Troubleshooting

### Step 1: Check Railway Logs

1. **Go to Railway Dashboard**: https://railway.com/project/2ef33b8d-1fbd-451a-9b77-33c3de54a0a4
2. **Click on your service** (the backend service)
3. **Go to "Deployments" tab** → **Latest deployment** → **Logs**
4. **Look for**:
   - ✅ `PostgreSQL database connected successfully`
   - ✅ `Server running on port 5000`
   - ❌ Any database connection errors
   - ❌ Any API errors

---

### Step 2: Test API Endpoint Directly

1. **Open your browser**
2. **Visit**: `https://archives-production-4f1d.up.railway.app/api/thesis`
3. **You should see**:
   ```json
   {
     "success": true,
     "data": [...],
     "total": 0,
     "pages": 1
   }
   ```
4. **If you see empty data**, the theses might not be in the database or not published
5. **If you see an error**, check Railway logs for details

---

### Step 3: Check Database Connection

1. **Go to Railway Dashboard** → **Your Service** → **Variables tab**
2. **Verify `DATABASE_URL` is set**:
   - Should be: `postgresql://postgres:password@db.project-ref.supabase.co:6543/postgres?pgbouncer=true`
   - If not set, add it (see `RAILWAY_FIX_DATABASE_CONNECTION.md`)
3. **Check Railway logs** for database connection:
   - Should see: `PostgreSQL database connected successfully`
   - If not, fix database connection (see `RAILWAY_FIX_DATABASE_CONNECTION.md`)

---

### Step 4: Check Thesis Status in Database

The backend only shows theses that match these criteria:

**If user is logged in and has a department**:
- Published public theses (from any department), OR
- All theses from user's department (regardless of status or is_public)

**If user is not logged in**:
- Only published public theses (`status: 'Published'` AND `is_public: true`)

**Solution**: Check thesis status in Supabase database:

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Table Editor** → **theses** table
4. **Check thesis records**:
   - `status` should be `'Published'` (for public access)
   - `is_public` should be `true` (for public access)
   - `department` should match user's department (for department access)

---

### Step 5: Publish Theses (If Needed)

If theses are not published, you need to publish them:

#### Option 1: Publish via Admin Panel

1. **Go to your Vercel app**: `https://onefaithonearchive.vercel.app`
2. **Login as admin**
3. **Go to Admin** → **Theses**
4. **Find the thesis you want to publish**
5. **Click "Publish"** or update status to "Published"
6. **Make sure `is_public` is set to `true`**

#### Option 2: Publish via Database

1. **Go to Supabase Dashboard** → **Table Editor** → **theses** table
2. **Find the thesis you want to publish**
3. **Update the record**:
   - `status`: `'Published'`
   - `is_public`: `true`
4. **Save the changes**

#### Option 3: Publish via API

1. **Use the admin API endpoint** to update thesis status:
   ```
   PUT https://archives-production-4f1d.up.railway.app/api/admin/thesis/:id/review
   ```
2. **Send**:
   ```json
   {
     "status": "Approved"
   }
   ```
3. **Then update thesis**:
   ```
   PUT https://archives-production-4f1d.up.railway.app/api/thesis/:id
   ```
4. **Send**:
   ```json
   {
     "status": "Published",
     "isPublic": true
   }
   ```

---

### Step 6: Check Frontend Network Requests

1. **Open your Vercel app**: `https://onefaithonearchive.vercel.app`
2. **Open browser DevTools** (F12 → Network tab)
3. **Go to the thesis list page** (`/thesis`)
4. **Check the network request**:
   - Should see: `GET https://archives-production-4f1d.up.railway.app/api/thesis`
   - Check the response:
     - If `success: true` and `data: []`, theses are not in database or not published
     - If `success: false`, check error message
     - If request fails, check CORS or network issues

---

### Step 7: Verify User Department

If you're logged in, make sure your user has a department set:

1. **Go to your Vercel app**: `https://onefaithonearchive.vercel.app`
2. **Login and go to Profile**
3. **Check your department**:
   - If department is empty, theses from your department won't show
   - Update your department if needed

4. **Check database**:
   - Go to Supabase Dashboard → Table Editor → **users** table
   - Find your user record
   - Check `department` field
   - Make sure it matches thesis `department` field

---

## 🎯 Quick Fix Checklist

- [ ] Database connection is working (check Railway logs)
- [ ] API endpoint works: `https://archives-production-4f1d.up.railway.app/api/thesis`
- [ ] Theses exist in database (check Supabase)
- [ ] Theses have `status: 'Published'` (check database)
- [ ] Theses have `is_public: true` (check database)
- [ ] User department matches thesis department (if logged in)
- [ ] Frontend can fetch theses (check browser network requests)
- [ ] No CORS errors (check browser console)

---

## 🚨 Common Issues

### Issue 1: Theses Not Published

**Problem**: Theses are in database but not published

**Solution**:
1. Go to Admin panel → Theses
2. Publish theses (set status to "Published" and is_public to true)
3. Or update database directly in Supabase

---

### Issue 2: Database Connection Failed

**Problem**: Backend cannot connect to database

**Solution**:
1. Check `DATABASE_URL` is set in Railway
2. Verify database connection (check Railway logs)
3. See `RAILWAY_FIX_DATABASE_CONNECTION.md` for detailed fix

---

### Issue 3: Department Mismatch

**Problem**: User department doesn't match thesis department

**Solution**:
1. Check user department in database
2. Check thesis department in database
3. Update either user or thesis department to match
4. Or publish thesis as public (`is_public: true`)

---

### Issue 4: Frontend Cannot Fetch Theses

**Problem**: Frontend cannot connect to backend API

**Solution**:
1. Check `VITE_API_URL` is set correctly in Vercel
2. Verify API endpoint works: `https://archives-production-4f1d.up.railway.app/api/thesis`
3. Check browser network requests for errors
4. Check CORS configuration (see `RAILWAY_FIX_CORS_AND_FRONTEND_URL.md`)

---

## ✅ Verification

After fixing the issue, verify:

1. **API endpoint returns theses**:
   - Visit: `https://archives-production-4f1d.up.railway.app/api/thesis`
   - Should see theses in response

2. **Frontend shows theses**:
   - Go to: `https://onefaithonearchive.vercel.app/thesis`
   - Should see thesis list

3. **Theses are visible**:
   - Check thesis list page
   - Theses should be displayed
   - Can click on thesis to view details

---

## 📚 Related Guides

- **RAILWAY_FIX_DATABASE_CONNECTION.md** - Database connection fix
- **RAILWAY_FIX_CORS_AND_FRONTEND_URL.md** - CORS and frontend URL fix
- **RAILWAY_DEPLOY_STEP_BY_STEP.md** - Complete deployment guide

---

## 🎉 Success!

Once the issue is fixed:
- ✅ Theses are visible in the app
- ✅ Users can view thesis list
- ✅ Users can view thesis details
- ✅ Theses can be searched and filtered

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

