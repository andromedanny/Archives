# Quick Fix: Theses Not Visible in App

## 🎯 Most Common Issue

**Theses are uploaded but not published!**

The backend only shows:
- Published public theses (if not logged in)
- Published public theses OR theses from your department (if logged in)

---

## ✅ Quick Fix: Publish Theses

### Method 1: Via Admin Panel (Easiest)

1. **Go to your app**: `https://onefaithonearchive.vercel.app`
2. **Login as admin**
3. **Go to Admin** → **Theses** (or `/admin/theses`)
4. **Find the thesis you want to publish**
5. **Click "Publish" button** or update status:
   - Set `status` to `Published`
   - Set `is_public` to `true`
6. **Save changes**
7. **Refresh the thesis list page** - thesis should now be visible!

---

### Method 2: Via Supabase Database (Direct)

1. **Go to Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**
3. **Go to Table Editor** → **theses** table
4. **Find the thesis you want to publish**
5. **Update the record**:
   - `status`: `Published` (select from dropdown)
   - `is_public`: `true` (check the checkbox)
6. **Click "Save"** (or press Enter)
7. **Refresh your app** - thesis should now be visible!

---

### Method 3: Via API (If you have API access)

1. **Update thesis status**:
   ```
   PUT https://archives-production-4f1d.up.railway.app/api/thesis/:id
   ```
   ```json
   {
     "status": "Published",
     "isPublic": true
   }
   ```

---

## 🔍 Check If Theses Are Published

### Step 1: Test API Endpoint

1. **Open browser**
2. **Visit**: `https://archives-production-4f1d.up.railway.app/api/thesis`
3. **Check the response**:
   - If `data: []` is empty, theses are not published or not public
   - If `data: [...]` has theses, they should be visible in the app

---

### Step 2: Check Database

1. **Go to Supabase Dashboard** → **Table Editor** → **theses** table
2. **Check thesis records**:
   - `status` should be `Published`
   - `is_public` should be `true`
   - If not, update them (see Method 2 above)

---

### Step 3: Check User Department (If Logged In)

If you're logged in, you should see:
- All published public theses (from any department)
- All theses from your department (regardless of status)

**To check**:
1. **Go to your app** → **Profile**
2. **Check your department**
3. **Go to Supabase** → **users** table
4. **Check your user's department**
5. **Make sure it matches thesis department** (if you want to see unpublished theses)

---

## 🚨 Common Issues

### Issue 1: Theses Not Published

**Problem**: Theses are uploaded but status is not "Published"

**Solution**: Publish theses via Admin panel or database (see above)

---

### Issue 2: Theses Not Public

**Problem**: Theses have `is_public: false`

**Solution**: Set `is_public: true` via Admin panel or database

---

### Issue 3: User Not Logged In

**Problem**: User is not logged in, so only sees published public theses

**Solution**: 
- Login to see theses from your department
- Or publish theses as public

---

### Issue 4: Department Mismatch

**Problem**: User department doesn't match thesis department

**Solution**:
- Update user department to match thesis
- Or update thesis department to match user
- Or publish thesis as public

---

### Issue 5: Database Connection Issue

**Problem**: Backend cannot connect to database

**Solution**:
1. Check Railway logs for database connection errors
2. Check `DATABASE_URL` is set in Railway
3. See `RAILWAY_FIX_DATABASE_CONNECTION.md` for detailed fix

---

## ✅ Verification

After publishing theses:

1. **Check API endpoint**:
   - Visit: `https://archives-production-4f1d.up.railway.app/api/thesis`
   - Should see theses in response

2. **Check app**:
   - Go to: `https://onefaithonearchive.vercel.app/thesis`
   - Should see thesis list

3. **Check thesis details**:
   - Click on a thesis
   - Should see thesis details

---

## 🎯 Quick Checklist

- [ ] Theses are in database (check Supabase)
- [ ] Theses have `status: 'Published'` (check database)
- [ ] Theses have `is_public: true` (check database)
- [ ] API endpoint returns theses (test `/api/thesis`)
- [ ] App shows thesis list (check `/thesis` page)
- [ ] User is logged in (if needed for department access)

---

## 🆘 Still Not Working?

1. **Check Railway logs** for errors
2. **Check browser console** for errors
3. **Check network requests** in browser DevTools
4. **Test API endpoint directly** in browser
5. **Check database** in Supabase
6. **Verify thesis status** in database
7. **See detailed guide**: `RAILWAY_FIX_THESIS_NOT_VISIBLE.md`

---

## 🎉 Success!

Once theses are published:
- ✅ Theses are visible in the app
- ✅ Users can view thesis list
- ✅ Users can view thesis details
- ✅ Theses can be searched and filtered

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

