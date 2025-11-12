# Setup Supabase Storage - Step by Step

## 📋 Your Information
- **Project ID:** `kgoscorwfhdosrpcnvco`
- **Supabase URL:** `https://kgoscorwfhdosrpcnvco.supabase.co`
- **Bucket Name:** `thesis-documents`
- **Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws`

---

## Step 1: Set Bucket Policies (Allow Uploads)

### Where to Check/Set Policies

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco

2. **Go to Storage → Policies**
   - Click "Storage" in the left sidebar
   - Click "Policies" tab
   - OR go directly to: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/policies

3. **Select Your Bucket**
   - Find `thesis-documents` bucket
   - Click on it to see its policies

4. **Check Existing Policies**
   - Look for policies that allow:
     - **INSERT** (for uploads)
     - **SELECT** (for reads)
     - **UPDATE** (for updates)
     - **DELETE** (for deletes)

5. **Create Upload Policy (if missing)**
   - Click "New Policy"
   - Policy name: `Allow uploads to thesis-documents`
   - Allowed operation: `INSERT`
   - Target roles: `authenticated` or `anon` (your choice)
   - Policy definition:
     ```sql
     (bucket_id = 'thesis-documents'::text)
     ```
   - Click "Save"

6. **Create Read Policy (if bucket is private)**
   - Click "New Policy"
   - Policy name: `Allow reads from thesis-documents`
   - Allowed operation: `SELECT`
   - Target roles: `authenticated` or `anon`
   - Policy definition:
     ```sql
     (bucket_id = 'thesis-documents'::text)
     ```
   - Click "Save"

---

## Step 2: Set Bucket to Public (Easier Option)

### Option A: Make Bucket Public (Recommended for Testing)

1. **Go to Storage → Buckets**
   - Visit: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/buckets

2. **Click on `thesis-documents` Bucket**
   - Click the bucket name

3. **Click "Settings" Tab**
   - Find "Public bucket" toggle
   - Toggle it to **ON** (Public)
   - This allows anyone to read files (if needed)
   - Click "Save"

4. **Benefits of Public Bucket:**
   - ✅ No need for complex policies
   - ✅ Files can be accessed directly via URL
   - ✅ Easier to test
   - ⚠️ Anyone with URL can access files (if privacy is a concern, use Private)

---

## Step 3: Put Anon Key in Render

### Where to Put the Anon Key

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Login to your account

2. **Open Your Backend Service**
   - Find your backend service (e.g., `archives-z3xr`)
   - Click on it

3. **Go to Environment Tab**
   - Click "Environment" in the left sidebar
   - Or go to: https://dashboard.render.com/web/your-service-name/environment

4. **Add/Update Environment Variables**
   - Click "Add Environment Variable" or "Edit" existing ones
   - Add these 4 variables:

   **Variable 1:**
   - Key: `STORAGE_TYPE`
   - Value: `supabase`
   - Click "Save"

   **Variable 2:**
   - Key: `SUPABASE_URL`
   - Value: `https://kgoscorwfhdosrpcnvco.supabase.co`
   - Click "Save"

   **Variable 3:**
   - Key: `SUPABASE_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws`
   - Click "Save"

   **Variable 4:**
   - Key: `SUPABASE_STORAGE_BUCKET`
   - Value: `thesis-documents`
   - Click "Save"

5. **Verify All Variables Are Set**
   - Check that all 4 variables are listed:
     - ✅ `STORAGE_TYPE=supabase`
     - ✅ `SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co`
     - ✅ `SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
     - ✅ `SUPABASE_STORAGE_BUCKET=thesis-documents`

6. **Important Notes:**
   - ⚠️ Make sure there are **no extra spaces** in the values
   - ⚠️ Values are **case-sensitive**
   - ⚠️ The anon key is the **full long string** (starts with `eyJ...`)
   - ⚠️ Render will **auto-redeploy** when you save environment variables

---

## Step 4: Wait for Redeployment

1. **Render Will Auto-Redeploy**
   - When you save environment variables, Render automatically redeploys
   - This takes 2-5 minutes

2. **Check Deployment Status**
   - Go to "Events" or "Logs" tab
   - Wait for deployment to complete
   - Look for "Deploy succeeded" message

---

## Step 5: Verify Configuration

### Check Render Logs

1. **Go to Render Dashboard**
   - Open your backend service
   - Click "Logs" tab

2. **Look for These Messages:**
   - ✅ `Supabase Storage client initialized: { url: 'https://kgoscorwfhdosrpcnvco.supabase.co', bucket: 'thesis-documents', hasKey: true }`
   - ✅ This confirms Supabase is configured correctly

3. **If You See:**
   - ⚠️ `Supabase Storage client NOT initialized` - Check environment variables
   - ⚠️ `Missing: { hasUrl: false, hasKey: false }` - Variables not set correctly

---

## Step 6: Test Upload

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
- [ ] Bucket is set to Public (or policies configured)
- [ ] Upload policy exists (if bucket is private)
- [ ] Read policy exists (if bucket is private)

### Render Configuration
- [ ] `STORAGE_TYPE=supabase` set in Render
- [ ] `SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co` set in Render
- [ ] `SUPABASE_KEY=eyJ...` set in Render (your anon key)
- [ ] `SUPABASE_STORAGE_BUCKET=thesis-documents` set in Render
- [ ] Backend redeployed
- [ ] Render logs show "Supabase Storage client initialized"

### Testing
- [ ] Test upload works
- [ ] Files appear in Supabase Storage bucket
- [ ] PDF viewing works
- [ ] PDF download works

---

## 🐛 Troubleshooting

### Issue: "Supabase Storage is not configured"
**Solution:**
1. Check environment variables are set in Render
2. Verify values are correct (no typos, no extra spaces)
3. Check Render logs for detailed error messages
4. Redeploy backend after setting variables

### Issue: "Permission denied" or "Bucket not found"
**Solution:**
1. Check bucket exists in Supabase
2. Verify bucket name matches `SUPABASE_STORAGE_BUCKET`
3. Check bucket policies allow uploads
4. Set bucket to Public (easier) or configure policies

### Issue: Files Still Not Appearing
**Solution:**
1. Check Render logs for upload errors
2. Verify Supabase URL and key are correct
3. Check bucket permissions
4. Test upload and check logs for success message

---

## 💡 Pro Tips

1. **Use Public Bucket**: Easier to test and configure
2. **Check Logs First**: Always check Render logs for detailed error messages
3. **Test After Setup**: Test upload immediately after configuring
4. **Monitor Storage**: Check Supabase Storage usage regularly
5. **Keep Key Secure**: Don't share your anon key publicly

---

## 📝 Summary

### Your Configuration:
```
STORAGE_TYPE=supabase
SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtnb3Njb3J3Zmhkb3NycGNudmNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI4MDIwOTEsImV4cCI6MjA3ODM3ODA5MX0.Kv3aG0aV2BcMeUY1KijNXxq2YbTHZASniIhMp28cAws
SUPABASE_STORAGE_BUCKET=thesis-documents
```

### Steps:
1. ✅ Set bucket policies (or make bucket public)
2. ✅ Set environment variables in Render
3. ✅ Wait for redeployment
4. ✅ Verify configuration in logs
5. ✅ Test upload

### Result:
PDFs will upload to Supabase Storage and appear in your bucket! 🎉

---

## ✅ Next Steps

1. **Set Bucket Policies** (or make bucket public)
2. **Set Environment Variables** in Render
3. **Wait for Redeployment**
4. **Check Render Logs** for "Supabase Storage client initialized"
5. **Test Upload** and verify files appear in bucket

That's it! Your PDFs will now upload to Supabase Storage! 🎉

