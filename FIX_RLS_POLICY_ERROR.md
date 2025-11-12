# Fix: "new row violates row-level security policy" Error

## Problem
Getting this error when uploading:
```
StorageApiError: new row violates row-level security policy
statusCode: '403'
```

This means your Supabase Storage policies are blocking the upload.

## Solution: Fix Your Storage Policies

### Step 1: Check Your Bucket Settings

1. Go to **Supabase Dashboard** → **Storage** → **thesis-documents** bucket
2. Click on the bucket name
3. Make sure the bucket is set to **Public** (not Private)
4. If it's Private, click **Edit** and change it to **Public**

### Step 2: Verify Your Policies

1. Go to **Storage** → **thesis-documents** → **Policies** tab
2. You should have at least these 2 policies:

**Policy 1: Public Read Access**
- Policy name: `Public Read Access`
- Allowed operation: `SELECT`, `download`, `getPublicUrl`
- Target roles: `anon`, `public`
- Policy definition: `true`

**Policy 2: Authenticated Upload** ⚠️ **THIS IS THE ONE THAT'S MISSING/WRONG**
- Policy name: `Authenticated Upload`
- Allowed operation: **MUST INCLUDE** `INSERT` and `upload`
- Target roles: `authenticated` (ONLY - uncheck anon and public)
- Policy definition: `true`

### Step 3: Fix Policy 2 (Authenticated Upload)

The error happens because Policy 2 is either:
- Missing
- Not active
- Missing `INSERT` or `upload` operations
- Wrong target roles

**To fix:**

1. Go to **Storage** → **thesis-documents** → **Policies**
2. Find the "Authenticated Upload" policy
3. If it doesn't exist, create it:
   - Click **New Policy**
   - Policy name: `Authenticated Upload`
   - **Allowed operation:** Check ☑ `INSERT` AND ☑ `upload` (BOTH are required!)
   - **Target roles:** Check ☑ `authenticated` ONLY (uncheck anon and public)
   - **Policy definition:** `true`
   - **WITH CHECK:** `true`
   - Click **Save policy**

4. If it exists, edit it:
   - Click on the policy
   - Make sure `INSERT` is checked
   - Make sure `upload` is checked
   - Make sure `authenticated` role is selected
   - Make sure `anon` and `public` are NOT selected
   - Policy definition should be `true`
   - Click **Save**

### Step 4: Verify Policy is Active

1. In the Policies list, make sure the policy shows as **Active** (not disabled)
2. If it's disabled, click to enable it

### Step 5: Test Again

1. Try uploading a PDF again
2. Check Render logs - you should see:
   ```
   ✅ Supabase upload successful
   ```
3. Check Supabase Storage dashboard - file should appear

## Common Mistakes

### ❌ Wrong: Only `upload` checked
```
Allowed operation: [☑ upload] [☐ INSERT]
```
**Fix:** Check BOTH `INSERT` and `upload`

### ❌ Wrong: Wrong roles selected
```
Target roles: [☑ authenticated] [☑ anon] [☑ public]
```
**Fix:** Only check `authenticated`, uncheck `anon` and `public`

### ❌ Wrong: Policy disabled
```
Policy status: Disabled
```
**Fix:** Enable the policy

### ❌ Wrong: Bucket is Private
```
Bucket visibility: Private
```
**Fix:** Change bucket to Public

## Quick Checklist

- [ ] Bucket is **Public** (not Private)
- [ ] Policy 2 exists: "Authenticated Upload"
- [ ] Policy 2 has `INSERT` checked
- [ ] Policy 2 has `upload` checked
- [ ] Policy 2 has `authenticated` role selected
- [ ] Policy 2 does NOT have `anon` or `public` selected
- [ ] Policy 2 is **Active** (not disabled)
- [ ] Policy definition is `true`

## Alternative: Use Service Role Key (Not Recommended)

If you still have issues, you can temporarily use the service_role key instead of anon key:

1. Go to Supabase Dashboard → Settings → API
2. Copy the **service_role** key (NOT anon key)
3. In Render, set `SUPABASE_KEY` to the service_role key
4. **Warning:** This bypasses RLS policies - less secure, only for testing

**Better solution:** Fix the policies instead of using service_role key.

## Summary

The error means your upload policy is blocking the upload. Make sure:
1. Bucket is Public
2. You have an "Authenticated Upload" policy
3. Policy has `INSERT` AND `upload` operations checked
4. Policy has `authenticated` role selected (not anon/public)
5. Policy is Active

After fixing, try uploading again!

