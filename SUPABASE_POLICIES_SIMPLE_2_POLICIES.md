# Supabase Storage Policies - Simple 2-Policy Setup

## Minimum Required: Only 2 Policies

You only need **2 policies** to make everything work. Here's the simplest setup:

---

## Policy 1: Public Read Access

**Policy name:**
```
Public Read Access
```

**Allowed operation:**
- SELECT
- download
- getPublicUrl

**Target roles:**
- anon
- public

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

---

## Policy 2: Authenticated Upload

**Policy name:**
```
Authenticated Upload
```

**Allowed operation:**
- INSERT
- upload

**Target roles:**
- authenticated

**Policy definition (USING expression):**
```sql
true
```

**WITH CHECK expression:**
```sql
true
```

---

## That's It!

These 2 policies are all you need:
- **Policy 1:** Anyone can view/download files (public access)
- **Policy 2:** Logged-in users can upload files

You don't need Policy 3 or Policy 4 unless you want users to update/delete files.

---

## Can You Combine Them Into 1 Policy?

**No, you cannot combine them into 1 policy** because:
- Policy 1 needs `anon` and `public` roles (for viewing)
- Policy 2 needs `authenticated` role (for uploading)
- Different roles need different permissions

You must have at least 2 separate policies.

---

## Quick Setup Steps

1. **Create Policy 1:**
   - Name: `Public Read Access`
   - Operations: `SELECT`, `download`, `getPublicUrl`
   - Roles: `anon`, `public`
   - SQL: `true`

2. **Create Policy 2:**
   - Name: `Authenticated Upload`
   - Operations: `INSERT`, `upload`
   - Roles: `authenticated` (ONLY)
   - SQL: `true`

3. **Done!** That's all you need.

---

## Summary

- **Minimum:** 2 policies (Public Read + Authenticated Upload)
- **Can't combine:** Must be separate because different roles
- **Same SQL:** Both use `true` (that's the same part)
- **Different operations:** Different operations for different roles

