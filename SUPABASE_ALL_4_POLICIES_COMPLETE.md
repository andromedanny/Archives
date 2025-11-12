# Supabase Storage Policies - Complete 4-Policy Setup

## Where to Set Up Policies

1. Go to **Supabase Dashboard**: https://supabase.com/dashboard
2. Select your project
3. Click **Storage** in the left sidebar
4. Click on the **thesis-documents** bucket
5. Click the **Policies** tab
6. Delete all existing policies (if any) by clicking the delete/trash icon
7. Create the 4 policies below one by one

---

## Policy 1: Public Read Access

**Click "New Policy"**

**Policy name:**
```
Public Read Access
```

**Allowed operation:**
- ☑ SELECT
- ☑ download
- ☑ getPublicUrl

**Target roles:**
- ☑ anon
- ☑ public

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

**Click "Review" then "Save policy"**

---

## Policy 2: Authenticated Upload

**Click "New Policy" again**

**Policy name:**
```
Authenticated Upload
```

**Allowed operation:**
- ☑ INSERT
- ☑ upload

**Target roles:**
- ☑ authenticated
- ☐ anon (uncheck)
- ☐ public (uncheck)

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

**Click "Review" then "Save policy"**

---

## Policy 3: Authenticated Update Delete

**Click "New Policy" again**

**Policy name:**
```
Authenticated Update Delete
```

**Allowed operation:**
- ☑ UPDATE
- ☑ DELETE
- ☑ update
- ☑ remove

**Target roles:**
- ☑ authenticated
- ☐ anon (uncheck)
- ☐ public (uncheck)

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

**Click "Review" then "Save policy"**

---

## Policy 4: Authenticated List

**Click "New Policy" again**

**Policy name:**
```
Authenticated List
```

**Allowed operation:**
- ☑ list

**Target roles:**
- ☑ authenticated
- ☐ anon (uncheck)
- ☐ public (uncheck)

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

**Click "Review" then "Save policy"**

---

## Complete Checklist

After creating all 4 policies, verify:

- [ ] Policy 1: Public Read Access - `SELECT`, `download`, `getPublicUrl` - `anon`, `public` - Active
- [ ] Policy 2: Authenticated Upload - `INSERT`, `upload` - `authenticated` - Active
- [ ] Policy 3: Authenticated Update Delete - `UPDATE`, `DELETE`, `update`, `remove` - `authenticated` - Active
- [ ] Policy 4: Authenticated List - `list` - `authenticated` - Active
- [ ] Bucket is **Public** (not Private)

---

## Navigation Path in Supabase

```
Supabase Dashboard
  → Select your project
    → Storage (left sidebar)
      → thesis-documents (bucket name)
        → Policies (tab)
          → New Policy (button)
```

---

## Quick Reference Table

| Policy | Operations | Roles | SQL |
|--------|-----------|-------|-----|
| 1. Public Read Access | SELECT, download, getPublicUrl | anon, public | `true` |
| 2. Authenticated Upload | INSERT, upload | authenticated | `true` |
| 3. Authenticated Update Delete | UPDATE, DELETE, update, remove | authenticated | `true` |
| 4. Authenticated List | list | authenticated | `true` |

---

## After Setting Up

1. **Test upload:**
   - Upload a PDF
   - Check Render logs for "Supabase upload successful"
   - Check Supabase Storage dashboard for the file

2. **Test view:**
   - Click "View" on a thesis
   - PDF should open in new tab

3. **Test download:**
   - Click "Download PDF"
   - File should download

---

## Summary

**Location:** Supabase Dashboard → Storage → thesis-documents → Policies tab

**Total Policies:** 4 policies

**All use the same SQL:** `true`

**Different operations and roles for each policy**

