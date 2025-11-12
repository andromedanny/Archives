# Configure Supabase Storage for PDF Uploads

## 🎯 Goal: Upload PDFs to Supabase Storage bucket `thesis-documents`

Your Supabase project: `kgoscorwfhdosrpcnvco`
Your bucket: `thesis-documents`

---

## ✅ Step-by-Step Setup

### Step 1: Get Supabase URL and Key

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco
   - Go to "Settings" → "API"

2. **Get Project URL**
   - Look for "Project URL"
   - Copy the URL: `https://kgoscorwfhdosrpcnvco.supabase.co`

3. **Get Anon Public Key**
   - Look for "Project API keys"
   - Find "anon public" key
   - Copy the key (starts with `eyJ...`)

---

### Step 2: Verify Bucket Exists and Permissions

1. **Go to Storage**
   - Visit: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/files/buckets/thesis-documents
   - Verify bucket `thesis-documents` exists

2. **Check Bucket Permissions**
   - Click on bucket settings
   - Verify bucket is set to "Public" (for easy access)
   - Or set to "Private" (requires authentication)

3. **Check Bucket Policies**
   - Go to "Policies" tab
   - Verify upload policy exists
   - For public bucket, you may need:
     - "Allow public uploads" policy
     - "Allow public reads" policy

---

### Step 3: Set Environment Variables in Render

1. **Go to Render Dashboard**
   - Visit: https://dashboard.render.com
   - Open your backend service

2. **Go to Environment Tab**
   - Click "Environment" in the left sidebar
   - Add/Update these environment variables:

   ```
   STORAGE_TYPE=supabase
   SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co
   SUPABASE_KEY=your_anon_public_key_here
   SUPABASE_STORAGE_BUCKET=thesis-documents
   ```

3. **Important Notes:**
   - Replace `your_anon_public_key_here` with your actual anon public key
   - Make sure there are no extra spaces
   - Values are case-sensitive
   - Click "Save Changes" after adding each variable

4. **Verify Variables**
   - Check that all 4 variables are set:
     - ✅ `STORAGE_TYPE=supabase`
     - ✅ `SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co`
     - ✅ `SUPABASE_KEY=eyJ...` (your key)
     - ✅ `SUPABASE_STORAGE_BUCKET=thesis-documents`

---

### Step 4: Set Bucket Policies (If Needed)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard/project/kgoscorwfhdosrpcnvco/storage/policies

2. **Create Upload Policy**
   - Click "New Policy"
   - Policy name: `Allow uploads to thesis-documents`
   - Target roles: `authenticated` or `anon` (depending on your needs)
   - Policy definition:
     ```sql
     (bucket_id = 'thesis-documents'::text)
     ```
   - Operations: `INSERT`
   - Click "Save"

3. **Create Read Policy (if bucket is private)**
   - Click "New Policy"
   - Policy name: `Allow reads from thesis-documents`
   - Target roles: `authenticated` or `anon`
   - Policy definition:
     ```sql
     (bucket_id = 'thesis-documents'::text)
     ```
   - Operations: `SELECT`
   - Click "Save"

---

### Step 5: Redeploy Backend

1. **Render Will Auto-Redeploy**
   - When you save environment variables, Render will auto-redeploy
   - Wait for deployment to complete (2-5 minutes)

2. **Check Deployment Logs**
   - Go to "Logs" tab in Render
   - Look for: `Supabase Storage client initialized`
   - Should see your Supabase URL and bucket name

3. **Verify Configuration**
   - Look for: `✅ Supabase Storage configured: true`
   - If you see: `⚠️ Supabase Storage is not configured`, check environment variables

---

### Step 6: Test Upload

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

## 🔍 Troubleshooting

### Issue: Files Not Appearing in Bucket

**Check 1: Environment Variables**
- Verify all 4 variables are set in Render
- Check values are correct (no typos)
- Verify no extra spaces

**Check 2: Render Logs**
- Look for: `Supabase Storage client initialized`
- Look for: `✅ Uploading to Supabase Storage...`
- Look for any error messages

**Check 3: Bucket Permissions**
- Verify bucket exists
- Check bucket is accessible
- Verify upload policies exist

**Check 4: Supabase Keys**
- Verify `SUPABASE_URL` is correct
- Verify `SUPABASE_KEY` is the anon public key
- Check key hasn't expired

---

### Issue: "Supabase client not initialized"

**Solution:**
1. Check `SUPABASE_URL` is set in Render
2. Check `SUPABASE_KEY` is set in Render
3. Verify values are correct
4. Redeploy backend

---

### Issue: "Bucket not found"

**Solution:**
1. Verify bucket `thesis-documents` exists in Supabase
2. Check bucket name matches `SUPABASE_STORAGE_BUCKET`
3. Verify bucket name is correct (case-sensitive)

---

### Issue: "Permission denied"

**Solution:**
1. Check bucket policies in Supabase
2. Verify upload policy exists
3. Check policy allows uploads
4. Verify key has storage access

---

## 📋 Quick Checklist

- [ ] Supabase bucket `thesis-documents` exists
- [ ] Bucket permissions set (Public or Private)
- [ ] Bucket policies configured
- [ ] `STORAGE_TYPE=supabase` set in Render
- [ ] `SUPABASE_URL` set in Render (correct URL)
- [ ] `SUPABASE_KEY` set in Render (anon public key)
- [ ] `SUPABASE_STORAGE_BUCKET=thesis-documents` set in Render
- [ ] Backend redeployed
- [ ] Render logs show "Supabase Storage client initialized"
- [ ] Test upload works
- [ ] Files appear in Supabase Storage bucket

---

## 🚀 After Setup

1. **Test Upload**
   - Upload a PDF
   - Check Render logs for success
   - Verify file appears in Supabase Storage

2. **Test Viewing**
   - Go to thesis detail page
   - Click "View PDF"
   - Verify PDF loads from Supabase Storage

3. **Test Download**
   - Click "Download PDF"
   - Verify PDF downloads correctly

4. **Monitor Storage**
   - Check Supabase Storage usage
   - Monitor file uploads
   - Check for any errors

---

## 💡 Pro Tips

1. **Use Public Bucket**: Easier to access files (if privacy is not a concern)
2. **Check Logs**: Always check Render logs for detailed error messages
3. **Test First**: Test upload after configuring Supabase
4. **Monitor Usage**: Check Supabase Storage usage regularly
5. **Set Policies**: Configure bucket policies for security

---

## 📝 Summary

**Your Supabase Project:** `kgoscorwfhdosrpcnvco`
**Your Bucket:** `thesis-documents`
**Your Supabase URL:** `https://kgoscorwfhdosrpcnvco.supabase.co`

**Environment Variables to Set in Render:**
```
STORAGE_TYPE=supabase
SUPABASE_URL=https://kgoscorwfhdosrpcnvco.supabase.co
SUPABASE_KEY=your_anon_public_key_here
SUPABASE_STORAGE_BUCKET=thesis-documents
```

**Steps:**
1. Get Supabase URL and key
2. Verify bucket exists
3. Set environment variables in Render
4. Set bucket policies (if needed)
5. Redeploy backend
6. Test upload

**Result:** PDFs will upload to Supabase Storage! 🎉

---

## ✅ Next Steps

1. **Set Environment Variables** in Render
2. **Redeploy Backend**
3. **Test Upload**
4. **Verify Files in Bucket**
5. **Test Viewing/Downloading**

That's it! Your PDFs will now upload to Supabase Storage! 🎉

