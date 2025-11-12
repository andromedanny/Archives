# Fix Admin PDF View Error - "File not found on server"

## Problem
When trying to view a PDF from the admin side, you get this error:
```json
{
  "success": false,
  "message": "File not found on server. The file may have been deleted or the server was redeployed. Please re-upload the document."
}
```

## Root Cause
This error occurs because:
1. **Render uses ephemeral storage** - Files stored locally on Render are lost when the server redeploys or restarts
2. **Files were uploaded before Supabase Storage was configured** - Old files are stored locally and are now lost
3. **Supabase Storage is not configured** - New files are still being stored locally instead of in Supabase

## Solution

### Option 1: Set Up Supabase Storage (Recommended)
This is the permanent solution that will prevent files from being lost in the future.

#### Step 1: Get Supabase Credentials
1. Go to your Supabase project: https://supabase.com/dashboard
2. Go to **Settings** → **API**
3. Copy:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public key** (the `anon` key, not the `service_role` key)

#### Step 2: Create Storage Bucket
1. Go to **Storage** in your Supabase dashboard
2. Click **New bucket**
3. Name it: `thesis-documents`
4. Make it **Public** (so files can be accessed directly)
5. Click **Create bucket**

#### Step 3: Set Up Bucket Policies
1. Go to **Storage** → **Policies** for the `thesis-documents` bucket
2. Click **New Policy**
3. Select **For full customization** (or use the template)
4. Add these policies:

**Policy 1: Allow public read access**
- Policy name: `Public Read Access`
- Allowed operation: `SELECT`
- Target roles: `public`, `anon`
- USING expression: `true`
- WITH CHECK expression: `true`

**Policy 2: Allow authenticated users to upload**
- Policy name: `Authenticated Upload`
- Allowed operation: `INSERT`
- Target roles: `authenticated`
- USING expression: `true`
- WITH CHECK expression: `true`

**Policy 3: Allow authenticated users to update**
- Policy name: `Authenticated Update`
- Allowed operation: `UPDATE`
- Target roles: `authenticated`
- USING expression: `true`
- WITH CHECK expression: `true`

#### Step 4: Configure Render Environment Variables
1. Go to your Render dashboard: https://dashboard.render.com
2. Select your backend service
3. Go to **Environment** tab
4. Add/Update these environment variables:

```
STORAGE_TYPE=supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_KEY=your-anon-key-here
SUPABASE_STORAGE_BUCKET=thesis-documents
```

5. Click **Save Changes**
6. Render will automatically redeploy your service

#### Step 5: Verify Configuration
1. Wait for Render to finish redeploying (2-5 minutes)
2. Check Render logs to see if Supabase Storage is initialized:
   ```
   Supabase Storage client initialized: { url: '...', bucket: 'thesis-documents', hasKey: true }
   ```
3. If you see warnings about Supabase not being configured, check your environment variables

### Option 2: Re-upload Missing Files (Temporary)
If you need immediate access to files:

1. **For Admin:**
   - Go to the admin theses page
   - Edit the thesis
   - Re-upload the PDF document
   - The file will now be stored in Supabase (if configured) or locally (if not configured)

2. **For Students:**
   - Go to "My Theses"
   - Edit the thesis
   - Re-upload the PDF document

## After Setting Up Supabase Storage

### New Uploads
- All new file uploads will be stored in Supabase Storage
- Files will persist even after Render redeploys
- Files can be accessed directly via public URLs

### Old Files
- Files uploaded before Supabase Storage was configured are lost (they were stored locally)
- These files need to be re-uploaded
- Once re-uploaded, they will be stored in Supabase and will persist

## Testing

1. **Upload a new file:**
   - Go to admin theses or student "My Theses"
   - Upload a PDF document
   - Check Render logs for: `Supabase upload successful`
   - Check Supabase Storage dashboard to see the file

2. **View the file:**
   - Click "View" on the thesis
   - The PDF should open in a new tab
   - The URL should be a Supabase URL (e.g., `https://xxxxx.supabase.co/storage/v1/object/public/thesis-documents/...`)

3. **Download the file:**
   - Click "Download PDF"
   - The file should download successfully
   - The file should be the correct PDF

## Troubleshooting

### Error: "Supabase Storage client NOT initialized"
**Solution:** Check that all environment variables are set correctly in Render:
- `STORAGE_TYPE=supabase`
- `SUPABASE_URL` (must start with `https://`)
- `SUPABASE_KEY` (must be the anon key)
- `SUPABASE_STORAGE_BUCKET=thesis-documents`

### Error: "Upload to Supabase failed"
**Solution:** 
1. Check that the bucket exists in Supabase
2. Check that the bucket is public
3. Check that the policies are set correctly
4. Check that the `SUPABASE_KEY` is the anon key (not service_role)

### Error: "File not found" even after uploading
**Solution:**
1. Check Supabase Storage dashboard to see if the file was uploaded
2. Check Render logs for upload errors
3. Verify that the file path in the database is a Supabase URL
4. If the file path is still a local path, the upload may have failed and fallen back to local storage

### Files Still Not Showing
**Solution:**
1. Check that the bucket is **public** (not private)
2. Check that the public read policy is set correctly
3. Try accessing the file URL directly in a browser
4. Check Supabase Storage logs for access errors

## Prevention

To prevent this issue in the future:
1. **Always use Supabase Storage** - Set `STORAGE_TYPE=supabase` in Render
2. **Keep Supabase credentials secure** - Don't commit them to Git
3. **Monitor Supabase Storage usage** - Free tier has 1GB storage limit
4. **Backup important files** - Consider backing up critical documents

## Summary

The error occurs because Render uses ephemeral storage, so files are lost on redeploy. The solution is to:
1. Set up Supabase Storage for persistent file storage
2. Configure Render environment variables
3. Re-upload any missing files
4. All new uploads will be stored in Supabase and will persist

