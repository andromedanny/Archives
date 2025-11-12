# Fix PDF Upload 500 Error

## 🚨 Problem: `Failed to load resource: the server responded with a status of 500 ()` when uploading PDF

This error occurs when:
1. **Supabase Storage is not configured** but `STORAGE_TYPE=supabase` is set
2. **Supabase Storage bucket doesn't exist**
3. **Supabase credentials are incorrect**
4. **Permission errors** accessing Supabase Storage

---

## ✅ Solutions

### Solution 1: Configure Supabase Storage (Recommended)

**Why Supabase Storage?**
- ✅ Files persist across redeployments
- ✅ 1GB free storage
- ✅ Works perfectly with Render
- ✅ Fast and reliable

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

4. **Redeploy Backend**
   - Render will auto-redeploy when environment variables change
   - Wait for deployment to complete

5. **Test Upload**
   - Try uploading a PDF
   - Should work without errors

---

### Solution 2: Use Local Storage (Temporary Fix)

**If you don't want to use Supabase Storage right now:**

1. **Set Environment Variable in Render**
   ```
   STORAGE_TYPE=local
   ```

2. **Redeploy Backend**
   - Render will auto-redeploy
   - Wait for deployment

3. **Note:**
   - Files will be stored locally
   - Files will be lost on redeploy
   - Not recommended for production

---

## 🔍 Diagnose the Issue

### Step 1: Check Render Logs

1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Logs" tab
   - Look for errors when uploading PDF
   - Check for Supabase errors

2. **Common Errors:**
   - `Supabase client not initialized` - Missing SUPABASE_URL or SUPABASE_KEY
   - `Bucket not found` - Bucket doesn't exist in Supabase
   - `Permission denied` - Bucket permissions are incorrect
   - `Invalid file object` - File upload format issue

### Step 2: Check Environment Variables

1. **Go to Render Dashboard**
   - Open your backend service
   - Go to "Environment" tab
   - Check if these are set:
     - `STORAGE_TYPE` (should be `supabase` or `local`)
     - `SUPABASE_URL` (if using Supabase)
     - `SUPABASE_KEY` (if using Supabase)
     - `SUPABASE_STORAGE_BUCKET` (if using Supabase)

2. **Verify Values:**
   - `SUPABASE_URL` should start with `https://`
   - `SUPABASE_KEY` should be the anon public key
   - `SUPABASE_STORAGE_BUCKET` should match the bucket name

### Step 3: Check Supabase Storage

1. **Go to Supabase Dashboard**
   - Go to "Storage"
   - Check if bucket `thesis-documents` exists
   - Check bucket permissions (Public or Private)
   - Verify bucket is accessible

2. **Test Bucket:**
   - Try uploading a file manually in Supabase Dashboard
   - Check if upload works
   - Verify file appears in bucket

---

## 🛠️ How to Fix

### Fix 1: Configure Supabase Storage

1. **Create Bucket:**
   - Go to Supabase Dashboard → Storage
   - Create bucket: `thesis-documents`
   - Set to Public or Private

2. **Get Keys:**
   - Go to Settings → API
   - Copy Project URL
   - Copy anon public key

3. **Set Environment Variables:**
   ```
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_KEY=your_supabase_anon_key
   SUPABASE_STORAGE_BUCKET=thesis-documents
   ```

4. **Redeploy:**
   - Render will auto-redeploy
   - Wait for deployment

5. **Test:**
   - Try uploading a PDF
   - Should work without errors

---

### Fix 2: Use Local Storage (Temporary)

1. **Set Environment Variable:**
   ```
   STORAGE_TYPE=local
   ```

2. **Remove Supabase Variables (if set):**
   - Remove `SUPABASE_URL`
   - Remove `SUPABASE_KEY`
   - Remove `SUPABASE_STORAGE_BUCKET`

3. **Redeploy:**
   - Render will auto-redeploy
   - Wait for deployment

4. **Test:**
   - Try uploading a PDF
   - Should work (but files will be lost on redeploy)

---

## 📋 Quick Checklist

- [ ] Check Render logs for errors
- [ ] Verify environment variables are set
- [ ] Check Supabase Storage bucket exists
- [ ] Verify Supabase keys are correct
- [ ] Test upload after configuration
- [ ] Check bucket permissions

---

## 🐛 Troubleshooting

### Issue: Supabase Client Not Initialized
**Solution:**
1. Verify `SUPABASE_URL` is set in Render
2. Verify `SUPABASE_KEY` is set in Render
3. Check values are correct (no extra spaces)
4. Redeploy backend

### Issue: Bucket Not Found
**Solution:**
1. Go to Supabase Dashboard → Storage
2. Check if bucket `thesis-documents` exists
3. Create bucket if it doesn't exist
4. Verify bucket name matches `SUPABASE_STORAGE_BUCKET`

### Issue: Permission Denied
**Solution:**
1. Check bucket permissions in Supabase
2. Set bucket to Public if needed
3. Verify Supabase key has storage access
4. Check bucket policies

### Issue: Upload Still Fails
**Solution:**
1. Check Render logs for detailed error
2. Verify file size is under 10MB
3. Check file format is allowed (PDF, DOC, DOCX)
4. Try uploading a smaller file first
5. Check network connectivity

---

## 💡 Pro Tips

1. **Use Supabase Storage**: Best solution for Render
2. **Check Logs First**: Always check Render logs for detailed errors
3. **Test Configuration**: Test upload after configuring Supabase
4. **Set Bucket to Public**: Makes file access easier (if needed)
5. **Monitor Storage**: Check Supabase Storage usage regularly

---

## 📝 Summary

**Problem:** 500 error when uploading PDF because Supabase Storage is not configured

**Solution:** 
1. Configure Supabase Storage (recommended)
2. Or use local storage (temporary fix)

**Steps:**
1. Create Supabase Storage bucket
2. Get Supabase keys
3. Set environment variables in Render
4. Redeploy backend
5. Test upload

**Result:** PDF upload will work without errors! 🎉

---

## ✅ After Fixing

1. **Test Upload:**
   - Go to your website
   - Create or edit a thesis
   - Upload a PDF document
   - Verify upload succeeds

2. **Test Viewing:**
   - Go to thesis detail page
   - Click "View PDF"
   - Verify PDF loads correctly

3. **Test Download:**
   - Click "Download PDF"
   - Verify PDF downloads correctly

4. **Monitor:**
   - Check Render logs for any errors
   - Check Supabase Storage for uploaded files
   - Monitor storage usage

That's it! Your PDF upload should work now! 🎉

