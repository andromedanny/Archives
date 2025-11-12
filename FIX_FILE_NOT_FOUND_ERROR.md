# Fix "File not found on server" Error

## 🚨 Problem: `{"success":false,"message":"File not found on server"}`

This error occurs because:
1. **Render's filesystem is ephemeral** - Files uploaded to local disk are lost on redeploy
2. **File paths are stored in database** but files don't exist on server
3. **Files were uploaded before** but server was redeployed

---

## ✅ Solutions

### Solution 1: Use Supabase Storage (Recommended)

**Why Supabase Storage?**
- ✅ Files persist across redeployments
- ✅ 1GB free storage (perfect for thesis documents)
- ✅ Works perfectly with Render
- ✅ Fast and reliable
- ✅ No file loss on redeploy

**How to Set Up:**

1. **Create Supabase Storage Bucket**
   - Go to Supabase Dashboard
   - Go to "Storage"
   - Click "New bucket"
   - Name: `thesis-documents`
   - Set to "Public" or "Private" (your choice)
   - Click "Create bucket"

2. **Get Supabase Keys**
   - Go to "Settings" → "API"
   - Copy "Project URL" (e.g., `https://your-project.supabase.co`)
   - Copy "anon public" key

3. **Set Environment Variables in Render**
   ```
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_STORAGE_BUCKET=thesis-documents
   ```

4. **Update Upload Middleware**
   - The backend already supports Supabase Storage
   - Just need to set environment variables
   - Files will be uploaded to Supabase Storage instead of local disk

5. **Redeploy Backend**
   - Render will auto-redeploy when environment variables change
   - Wait for deployment to complete

6. **Re-upload Documents**
   - Existing files in database won't work (they're lost)
   - Users need to re-upload their documents
   - New uploads will go to Supabase Storage

---

### Solution 2: Fix Path Resolution (Temporary Fix)

**What This Does:**
- Improves path resolution for local files
- Adds better error messages
- Checks multiple possible file locations

**Status:**
- ✅ Already implemented in latest code
- ✅ Better error messages
- ✅ Checks for files in uploads directory

**Limitations:**
- ❌ Files are still lost on redeploy
- ❌ Not a permanent solution
- ❌ Users need to re-upload after redeploy

---

## 🔍 Diagnose the Issue

### Step 1: Check if File Exists
1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Shell" tab
   - Run: `ls -la uploads/thesis/documents/`
   - Check if files exist

2. **Check Database**
   - Go to Supabase Dashboard
   - Go to "Table Editor"
   - Open "theses" table
   - Check "main_document" column
   - See what path is stored

### Step 2: Check Environment Variables
1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Environment" tab
   - Check if `STORAGE_TYPE` is set
   - If not set, it defaults to "local"

### Step 3: Check Logs
1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Logs" tab
   - Look for file path errors
   - Check for "File not found" messages

---

## 🛠️ How to Fix

### Option 1: Switch to Supabase Storage (Recommended)

1. **Set Up Supabase Storage**
   ```bash
   # In Supabase Dashboard
   # 1. Create bucket: thesis-documents
   # 2. Get URL and key from Settings → API
   ```

2. **Update Render Environment Variables**
   ```
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_STORAGE_BUCKET=thesis-documents
   ```

3. **Redeploy Backend**
   - Render will auto-redeploy
   - Wait for deployment

4. **Test Upload**
   - Upload a new document
   - Check if it's stored in Supabase Storage
   - Verify file can be viewed/downloaded

5. **Re-upload Existing Documents**
   - Users need to re-upload their documents
   - Old files are lost (can't recover them)

---

### Option 2: Keep Local Storage (Not Recommended)

**Why Not Recommended:**
- ❌ Files lost on redeploy
- ❌ Not persistent
- ❌ Users lose their documents

**If You Must Use Local Storage:**
1. **Don't redeploy** (files will be lost)
2. **Backup files** before redeploying
3. **Use persistent volumes** (paid Render feature)

---

## 📋 Quick Checklist

- [ ] Check if files exist in `uploads/thesis/documents/`
- [ ] Check database for stored file paths
- [ ] Check `STORAGE_TYPE` environment variable
- [ ] Set up Supabase Storage (recommended)
- [ ] Update environment variables in Render
- [ ] Redeploy backend
- [ ] Test file upload
- [ ] Test file viewing/downloading
- [ ] Inform users to re-upload documents

---

## 🚀 After Fixing

### Test File Upload
1. **Upload a Document**
   - Go to your website
   - Create or edit a thesis
   - Upload a PDF document
   - Verify upload succeeds

2. **Test File Viewing**
   - Go to thesis detail page
   - Click "View PDF"
   - Verify PDF loads correctly

3. **Test File Download**
   - Click "Download PDF"
   - Verify PDF downloads correctly

---

## 💡 Pro Tips

1. **Use Supabase Storage**: Best solution for Render
2. **Set Up Bucket**: Create bucket before setting environment variables
3. **Test First**: Test upload/view/download after setup
4. **Inform Users**: Let users know they need to re-upload documents
5. **Monitor Storage**: Check Supabase Storage usage regularly

---

## 🐛 Troubleshooting

### Issue: Files Still Not Found After Switching to Supabase
**Solution:**
1. Verify environment variables are set correctly
2. Check Supabase bucket exists
3. Verify bucket name matches `SUPABASE_STORAGE_BUCKET`
4. Check Supabase keys are correct
5. Test Supabase connection

### Issue: Upload Fails After Switching to Supabase
**Solution:**
1. Check Supabase bucket permissions
2. Verify Supabase keys have storage access
3. Check file size (max 10MB)
4. Verify bucket name is correct
5. Check Supabase logs for errors

### Issue: Files Upload but Can't View
**Solution:**
1. Check if bucket is public or private
2. Verify file URLs are correct
3. Check CORS settings in Supabase
4. Verify file path in database
5. Test file URL directly in browser

---

## 📝 Summary

**Problem:** Files are lost on Render redeploy because filesystem is ephemeral

**Solution:** Use Supabase Storage for persistent file storage

**Steps:**
1. Create Supabase Storage bucket
2. Set environment variables in Render
3. Redeploy backend
4. Re-upload documents
5. Test file upload/view/download

**Result:** Files persist across redeployments! 🎉

---

## ✅ Next Steps

1. **Set Up Supabase Storage** (if not already done)
2. **Update Environment Variables** in Render
3. **Redeploy Backend**
4. **Test File Upload**
5. **Inform Users** to re-upload documents

That's it! Your files will now persist across redeployments! 🎉

