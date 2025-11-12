# How to Setup Supabase Storage - Complete Guide

## 📋 Your Information
- **Project ID:** `kgoscorwfhdosrpcnvco`
- **Supabase URL:** `https://kgoscorwfhdosrpcnvco.supabase.co`
- **Bucket Name:** `thesis-documents`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws`

---

## Part 1: Set Bucket Policies (Allow Uploads)

### Where to Check/Set Policies

1. **Go to Supabase Dashboard - Storage Policies**
   - Direct link: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/policies
   - OR: Go to https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco → Storage → Policies

2. **Select Your Bucket**
   - Find `thesis-documents` in the list
   - Click on it to see its policies

3. **Check if Upload Policy Exists**
   - Look for a policy with operation: `INSERT`
   - If it exists, you're good!
   - If not, create one (see below)

4. **Create Upload Policy (if missing)**
   - Click **"New Policy"** button
   - **Policy name:** `Allow uploads to thesis-documents`
   - **Allowed operation:** Select `INSERT`
   - **Target roles:** Select `anon` (or `authenticated` if you want only logged-in users)
   - **Policy definition:** 
     ```sql
     (bucket_id = 'thesis-documents'::text)
     ```
   - Click **"Save"**

5. **Create Read Policy (if bucket is private)**
   - Click **"New Policy"** button
   - **Policy name:** `Allow reads from thesis-documents`
   - **Allowed operation:** Select `SELECT`
   - **Target roles:** Select `anon` (or `authenticated`)
   - **Policy definition:**
     ```sql
     (bucket_id = 'thesis-documents'::text)
     ```
   - Click **"Save"**

---

## Part 2: Make Bucket Public (Easier Option - Recommended)

### Option: Make Bucket Public Instead of Policies

1. **Go to Supabase Dashboard - Buckets**
   - Direct link: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/buckets
   - OR: Go to https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco → Storage → Buckets

2. **Click on `thesis-documents` Bucket**
   - Click the bucket name to open it

3. **Go to Settings Tab**
   - Click "Settings" tab
   - Find "Public bucket" toggle
   - Toggle it to **ON** (Public)
   - Click **"Save"**

4. **Benefits:**
   - ✅ No need to set complex policies
   - ✅ Files can be accessed directly via URL
   - ✅ Easier to test
   - ⚠️ Anyone with URL can access files (OK for public theses)

---

## Part 3: Put Anon Key in Render

### Where to Put the Anon Key

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Login to your account

2. **Open Your Backend Service**
   - Find your backend service (e.g., `archives-z3xr` or similar)
   - Click on it to open

3. **Go to Environment Tab**
   - Click **"Environment"** in the left sidebar
   - You'll see a list of environment variables

4. **Add/Update Environment Variables**

   **Variable 1: STORAGE_TYPE**
   - Click **"Add Environment Variable"** (or edit if exists)
   - **Key:** `STORAGE_TYPE`
   - **Value:** `supabase`
   - Click **"Save Changes"**

   **Variable 2: SUPABASE_URL**
   - Click **"Add Environment Variable"** (or edit if exists)
   - **Key:** `SUPABASE_URL`
   - **Value:** `https://kgoscorwfhdosrpcnvco.supabase.co`
   - Click **"Save Changes"**

   **Variable 3: SUPABASE_KEY** ← **THIS IS WHERE YOU PUT YOUR ANON KEY**
   - Click **"Add Environment Variable"** (or edit if exists)
   - **Key:** `SUPABASE_KEY`
   - **Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws`
   - **Important:** Paste the ENTIRE key (the long string)
   - Click **"Save Changes"**

   **Variable 4: SUPABASE_STORAGE_BUCKET**
   - Click **"Add Environment Variable"** (or edit if exists)
   - **Key:** `SUPABASE_STORAGE_BUCKET`
   - **Value:** `thesis-documents`
   - Click **"Save Changes"**

5. **Verify All Variables Are Set**
   - Check that all 4 variables appear in the list:
     - ✅ `STORAGE_TYPE` = `supabase`
     - ✅ `SUPABASE_URL` = `https://kgoscorwfhdosrpcnvco.supabase.co`
     - ✅ `SUPABASE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (your full key)
     - ✅ `SUPABASE_STORAGE_BUCKET` = `thesis-documents`

6. **Important Notes:**
   - ⚠️ Make sure there are **NO extra spaces** before or after the values
   - ⚠️ Values are **case-sensitive**
   - ⚠️ The anon key is the **ENTIRE long string** (starts with `eyJ...`)
   - ⚠️ Render will **automatically redeploy** when you save environment variables

---

## Part 4: Wait for Redeployment

1. **Render Will Auto-Redeploy**
   - After saving environment variables, Render automatically starts redeployment
   - This takes 2-5 minutes
   - You'll see a deployment in progress

2. **Check Deployment Status**
   - Go to "Events" or "Logs" tab
   - Wait for "Deploy succeeded" message
   - Look for: `Supabase Storage client initialized`

---

## Part 5: Verify Configuration

### Check Render Logs

1. **Go to Render Dashboard → Logs Tab**
   - Open your backend service
   - Click "Logs" tab

2. **Look for These Messages:**
   - ✅ `Supabase Storage client initialized: { url: 'https://kgoscorwfhdosrpcnvco.supabase.co', bucket: 'thesis-documents', hasKey: true }`
   - ✅ This confirms Supabase is configured correctly

3. **If You See:**
   - ⚠️ `Supabase Storage client NOT initialized` - Check environment variables
   - ⚠️ `Missing: { hasUrl: false, hasKey: false }` - Variables not set correctly

---

## Part 6: Test Upload

1. **Upload a PDF**
   - Go to your website
   - Create or edit a thesis
   - Upload a PDF document

2. **Check Render Logs**
   - Go to Render Dashboard → Logs
   - Look for: `✅ Uploading to Supabase Storage...`
   - Should see: `✅ Supabase upload successful`
   - Should see the file URL

3. **Check Supabase Storage**
   - Go to: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/files/buckets/thesis-documents
   - Verify the PDF appears in the bucket
   - Check the file is in `thesis/documents/` folder

---

## 📋 Quick Checklist

### Supabase Configuration
- [ ] Bucket `thesis-documents` exists
- [ ] Bucket is set to Public (OR policies configured)
- [ ] Upload policy exists (if bucket is private)
- [ ] Read policy exists (if bucket is private)

### Render Configuration
- [ ] `STORAGE_TYPE=supabase` set in Render
- [ ] `SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co` set in Render
- [ ] `SUPABASE_KEY=eyJ...` set in Render (your anon key) ← **MOST IMPORTANT**
- [ ] `SUPABASE_STORAGE_BUCKET=thesis-documents` set in Render
- [ ] Backend redeployed
- [ ] Render logs show "Supabase Storage client initialized"

### Testing
- [ ] Test upload works
- [ ] Files appear in Supabase Storage bucket
- [ ] PDF viewing works
- [ ] PDF download works

---

## 🎯 Summary

### Where to Check Policies:
**Supabase Dashboard → Storage → Policies**
- Direct link: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/policies
- OR: Make bucket Public (easier): https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/buckets

### Where to Put Anon Key:
**Render Dashboard → Your Backend Service → Environment Tab**
- Key: `SUPABASE_KEY`
- Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws`

### All Environment Variables to Set in Render:
```
STORAGE_TYPE=supabase
SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws
SUPABASE_STORAGE_BUCKET=thesis-documents
```

---

## ✅ Next Steps

1. **Set Bucket to Public** (or configure policies)
2. **Set Environment Variables in Render** (especially `SUPABASE_KEY`)
3. **Wait for Redeployment** (2-5 minutes)
4. **Check Render Logs** for "Supabase Storage client initialized"
5. **Test Upload** and verify files appear in bucket

That's it! Your PDFs will now upload to Supabase Storage! 🎉

