# Troubleshoot: Supabase Upload 404 Error

## Problem
- Getting `{"statusCode":"404","error":"not_found","message":"Object not found"}` when uploading/viewing PDFs
- Files are not appearing in Supabase bucket
- Upload seems to succeed but file can't be viewed

## Step 1: Check Render Environment Variables

1. Go to **Render Dashboard** → Your Backend Service → **Environment** tab
2. Verify these variables are set **exactly** as shown:

```
STORAGE_TYPE=supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_STORAGE_BUCKET=thesis-documents
```

**Common mistakes:**
- ❌ `STORAGE_TYPE=supabase ` (extra space)
- ❌ `STORAGE_TYPE="supabase"` (quotes not needed)
- ❌ `SUPABASE_URL=your-project-id.supabase.co` (missing https://)
- ❌ Using `service_role` key instead of `anon` key

**Correct format:**
- ✅ `STORAGE_TYPE=supabase` (no quotes, no spaces)
- ✅ `SUPABASE_URL=https://xxxxx.supabase.co` (with https://)
- ✅ `SUPABASE_KEY=eyJhbGc...` (anon key, not service_role)

3. After updating, click **Save Changes**
4. Wait for Render to redeploy (2-5 minutes)

## Step 2: Check Render Logs

1. Go to **Render Dashboard** → Your Backend Service → **Logs** tab
2. Look for these messages when the server starts:

**✅ Good - Supabase is configured:**
```
Supabase Storage client initialized: { url: 'https://...', bucket: 'thesis-documents', hasKey: true }
```

**❌ Bad - Supabase is NOT configured:**
```
Supabase Storage client NOT initialized. Missing: { hasUrl: false, hasKey: false }
```

3. When you upload a file, look for:

**✅ Good - Upload successful:**
```
File upload - Storage type: supabase
Supabase Storage configured: true
Uploading to Supabase Storage: bucket=thesis-documents, path=...
Supabase upload successful: ...
Supabase file URL: https://...
```

**❌ Bad - Falling back to local storage:**
```
⚠️ Supabase Storage is not configured. Falling back to local storage.
```
or
```
❌ Supabase upload error: ...
⚠️ Falling back to local storage due to Supabase upload error
```

## Step 3: Verify Supabase Configuration

1. **Check Supabase URL:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the **Project URL**
   - Make sure it matches what's in Render (including `https://`)

2. **Check Supabase Key:**
   - Go to Supabase Dashboard → Settings → API
   - Copy the **anon public** key (NOT service_role)
   - Make sure it matches what's in Render

3. **Check Bucket Name:**
   - Go to Supabase Dashboard → Storage
   - Verify the bucket is named exactly: `thesis-documents`
   - Make sure it's **Public** (not Private)

4. **Check Bucket Policies:**
   - Go to Supabase Dashboard → Storage → thesis-documents → Policies
   - Verify you have at least:
     - Policy 1: Public Read Access (SELECT, download, getPublicUrl) for anon/public
     - Policy 2: Authenticated Upload (INSERT, upload) for authenticated

## Step 4: Test Upload and Check Logs

1. **Try uploading a PDF:**
   - Go to your app
   - Upload a new thesis document
   - Watch the Render logs in real-time

2. **What to look for in logs:**

**If you see this, Supabase is working:**
```
File upload - Storage type: supabase
Supabase Storage configured: true
Uploading to Supabase Storage: bucket=thesis-documents, path=thesis/documents/...
Supabase upload successful: { path: 'thesis/documents/...' }
Supabase file URL: https://xxxxx.supabase.co/storage/v1/object/public/thesis-documents/thesis/documents/...
```

**If you see this, Supabase is NOT working:**
```
File upload - Storage type: local
```
or
```
File upload - Storage type: supabase
Supabase Storage configured: false
⚠️ Supabase Storage is not configured. Falling back to local storage.
```

## Step 5: Common Issues and Fixes

### Issue 1: "Supabase Storage client NOT initialized"

**Cause:** Environment variables not set or incorrect

**Fix:**
1. Go to Render → Environment tab
2. Verify all 4 variables are set:
   - `STORAGE_TYPE=supabase`
   - `SUPABASE_URL=https://...`
   - `SUPABASE_KEY=...`
   - `SUPABASE_STORAGE_BUCKET=thesis-documents`
3. Make sure there are no extra spaces or quotes
4. Save and wait for redeploy

### Issue 2: "Supabase upload error" or "Falling back to local storage"

**Cause:** Upload to Supabase failed (permissions, bucket doesn't exist, etc.)

**Fix:**
1. Check Supabase Storage dashboard - does the bucket exist?
2. Check bucket is **Public** (not Private)
3. Check policies are set correctly
4. Check you're using the **anon** key (not service_role)
5. Check Render logs for the specific error message

### Issue 3: "Object not found" when viewing

**Cause:** File was uploaded to local storage but file path is wrong or file was lost

**Fix:**
1. Check Render logs to see where the file was uploaded
2. If it says "Falling back to local storage", Supabase upload failed
3. Fix Supabase configuration and re-upload the file
4. Files uploaded to local storage are lost on Render redeploy

### Issue 4: File uploads but 404 when viewing

**Possible causes:**
1. File was uploaded to local storage (not Supabase)
2. File path in database is wrong
3. Bucket policies don't allow public read

**Fix:**
1. Check Supabase Storage dashboard - is the file there?
2. If file is NOT in Supabase, it was uploaded locally
3. Check Render logs to see where upload went
4. Fix Supabase config and re-upload

## Step 6: Verify File is in Supabase

1. Go to **Supabase Dashboard** → **Storage** → **thesis-documents**
2. You should see files in folders like:
   - `thesis/documents/...`
3. If you see files, Supabase upload is working
4. If you don't see files, upload is going to local storage

## Step 7: Test the Complete Flow

1. **Upload a test file:**
   - Upload a PDF through your app
   - Check Render logs for "Supabase upload successful"
   - Check Supabase Storage dashboard for the file

2. **View the file:**
   - Click "View" on the thesis
   - Should open PDF in new tab
   - URL should be: `https://xxxxx.supabase.co/storage/v1/object/public/thesis-documents/...`

3. **If it works:**
   - ✅ Supabase is configured correctly
   - ✅ All future uploads will go to Supabase

4. **If it doesn't work:**
   - Check Render logs for errors
   - Verify environment variables again
   - Check Supabase bucket and policies

## Quick Checklist

- [ ] `STORAGE_TYPE=supabase` in Render (no quotes, no spaces)
- [ ] `SUPABASE_URL=https://...` in Render (with https://)
- [ ] `SUPABASE_KEY=...` in Render (anon key, not service_role)
- [ ] `SUPABASE_STORAGE_BUCKET=thesis-documents` in Render
- [ ] Render logs show "Supabase Storage client initialized"
- [ ] Bucket `thesis-documents` exists in Supabase
- [ ] Bucket is **Public** (not Private)
- [ ] Policies are set (Public Read + Authenticated Upload)
- [ ] Render logs show "Supabase upload successful" when uploading
- [ ] File appears in Supabase Storage dashboard

## Still Not Working?

1. **Check Render logs** for the exact error message
2. **Check Supabase Storage logs** for access errors
3. **Try uploading a small test file** and watch logs
4. **Verify environment variables** are saved (no typos)
5. **Wait for Render to fully redeploy** after changing env vars

## Summary

The 404 error usually means:
- File was uploaded to **local storage** (not Supabase)
- Local files are lost on Render redeploy
- Need to fix Supabase configuration in Render
- Then re-upload files to Supabase

**Most common issue:** `STORAGE_TYPE` is not set to `supabase` in Render, or Supabase environment variables are missing/incorrect.

