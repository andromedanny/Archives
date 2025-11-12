# Supabase Storage Policies Setup Guide

## Quick Reference for Policy Setup

This guide shows you exactly what to enter in the Supabase Storage policy creation form.

## Step-by-Step Policy Creation

### Policy 1: Public Read Access (Required)
**Purpose:** Allows anyone to view and download PDF files

1. Click **New Policy** in the Storage Policies page
2. Fill in the form:

   **Policy name:**
   ```
   Public Read Access
   ```

   **Allowed operation:**
   - Check ☑ `SELECT`
   - Check ☑ `download`
   - Check ☑ `getPublicUrl`
   - (Optional) Check ☑ `list` if you want public listing

   **Target roles:**
   - Check ☑ `anon`
   - Check ☑ `public`
   - (Or leave all checked - defaults to public)

   **Policy definition (USING expression):**
   ```sql
   true
   ```

   **WITH CHECK expression (if shown):**
   ```sql
   true
   ```

3. Click **Review**
4. Click **Save policy**

---

### Policy 2: Authenticated Upload (Required)
**Purpose:** Allows logged-in users to upload files

1. Click **New Policy** again
2. Fill in the form:

   **Policy name:**
   ```
   Authenticated Upload
   ```

   **Allowed operation:**
   - Check ☑ `INSERT`
   - Check ☑ `upload`

   **Target roles:**
   - Check ☑ `authenticated`
   - Uncheck ☐ `anon`
   - Uncheck ☐ `public`

   **Policy definition (USING expression):**
   ```sql
   true
   ```

   **WITH CHECK expression (if shown):**
   ```sql
   true
   ```

3. Click **Review**
4. Click **Save policy**

---

### Policy 3: Authenticated Update/Delete (Optional)
**Purpose:** Allows logged-in users to update or delete files

1. Click **New Policy** again
2. Fill in the form:

   **Policy name:**
   ```
   Authenticated Update Delete
   ```

   **Allowed operation:**
   - Check ☑ `UPDATE`
   - Check ☑ `DELETE`
   - Check ☑ `update`
   - Check ☑ `remove`

   **Target roles:**
   - Check ☑ `authenticated`
   - Uncheck ☐ `anon`
   - Uncheck ☐ `public`

   **Policy definition (USING expression):**
   ```sql
   true
   ```

   **WITH CHECK expression (if shown):**
   ```sql
   true
   ```

3. Click **Review**
4. Click **Save policy**

---

### Policy 4: Authenticated List (Optional)
**Purpose:** Allows logged-in users to list files in the bucket

1. Click **New Policy** again
2. Fill in the form:

   **Policy name:**
   ```
   Authenticated List
   ```

   **Allowed operation:**
   - Check ☑ `list`

   **Target roles:**
   - Check ☑ `authenticated`
   - Uncheck ☐ `anon`
   - Uncheck ☐ `public`

   **Policy definition (USING expression):**
   ```sql
   true
   ```

   **WITH CHECK expression (if shown):**
   ```sql
   true
   ```

3. Click **Review**
4. Click **Save policy**

---

## Minimum Required Setup

For basic functionality, you only need **2 policies**:

1. **Policy 1: Public Read Access** - So anyone can view/download PDFs
2. **Policy 2: Authenticated Upload** - So logged-in users can upload PDFs

The other policies (3 and 4) are optional and provide additional functionality.

---

## Visual Guide

### Policy 1 Form (Public Read Access)
```
Policy name: Public Read Access
Allowed operation: [☑ SELECT] [☑ download] [☑ getPublicUrl]
Target roles: [☑ anon] [☑ public]
Policy definition: true
WITH CHECK: true
```

### Policy 2 Form (Authenticated Upload)
```
Policy name: Authenticated Upload
Allowed operation: [☑ INSERT] [☑ upload]
Target roles: [☑ authenticated] [☐ anon] [☐ public]
Policy definition: true
WITH CHECK: true
```

---

## Troubleshooting

### Error: "Policy creation failed"
**Solution:** Make sure:
- Policy name is unique
- At least one operation is selected
- At least one role is selected
- SQL expression is valid (`true` is always valid)

### Error: "Cannot upload files"
**Solution:** Check that:
- Policy 2 (Authenticated Upload) is created
- `INSERT` and `upload` operations are checked
- `authenticated` role is selected
- Your user is logged in (authenticated)

### Error: "Cannot view/download files"
**Solution:** Check that:
- Policy 1 (Public Read Access) is created
- `SELECT`, `download`, and `getPublicUrl` operations are checked
- `anon` and `public` roles are selected
- Bucket is set to **Public** (in bucket settings)

### Files uploaded but not accessible
**Solution:** 
1. Check that the bucket is **Public** (not Private)
2. Check that Policy 1 is active
3. Try accessing the file URL directly in a browser
4. Check Supabase Storage logs for access errors

---

## Advanced: Restrict Access by User (Optional)

If you want to restrict access so users can only see their own files, use this instead:

**Policy 1: User-specific read access**
```sql
-- USING expression
bucket_id = 'thesis-documents' AND (storage.foldername(name))[1] = auth.uid()::text

-- WITH CHECK expression
bucket_id = 'thesis-documents' AND (storage.foldername(name))[1] = auth.uid()::text
```

**Note:** This is more complex and requires organizing files by user ID in folders. For most use cases, the simple `true` policy is sufficient.

---

## Verification

After setting up policies:

1. **Test Upload:**
   - Log in to your app
   - Upload a PDF document
   - Check Supabase Storage dashboard to see the file

2. **Test Download:**
   - Try to view/download the PDF
   - Check that it opens in the browser
   - Verify the URL is a Supabase Storage URL

3. **Check Logs:**
   - Check Render logs for: `Supabase upload successful`
   - Check Supabase Storage logs for any errors

---

## Summary

**Required Policies:**
1. Public Read Access - `SELECT`, `download`, `getPublicUrl` - `anon`, `public` - `true`
2. Authenticated Upload - `INSERT`, `upload` - `authenticated` - `true`

**Optional Policies:**
3. Authenticated Update Delete - `UPDATE`, `DELETE`, `update`, `remove` - `authenticated` - `true`
4. Authenticated List - `list` - `authenticated` - `true`

**Key Points:**
- Use `true` for the SQL expression (allows all operations)
- Public read = `anon` + `public` roles
- Authenticated operations = `authenticated` role only
- Make sure the bucket is set to **Public** in bucket settings

