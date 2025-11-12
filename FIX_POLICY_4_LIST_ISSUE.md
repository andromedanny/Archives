# Fix Policy 4: Authenticated List Issue

## Problem: Can't Create Policy 4 with `list` Operation

If you can't check `list` or create Policy 4, here are solutions:

## Solution 1: Policy 4 is Optional

**Good news:** Policy 4 is **optional**! You only need Policies 1 and 2 for basic functionality.

- **Policy 1:** Public Read Access (required)
- **Policy 2:** Authenticated Upload (required)
- **Policy 3:** Authenticated Update Delete (optional)
- **Policy 4:** Authenticated List (optional)

**You can skip Policy 4** if it's causing issues. Your uploads and views will still work.

---

## Solution 2: Check if `list` Operation is Available

1. When creating Policy 4, look at the "Allowed operation" dropdown
2. If `list` is not in the list, it might not be available for your Supabase version
3. **Solution:** Skip Policy 4 - it's optional anyway

---

## Solution 3: Alternative - Add `list` to Policy 1

If you want listing functionality, you can add `list` to Policy 1 instead:

**Edit Policy 1: Public Read Access**
- Add `list` to the operations:
  - ☑ SELECT
  - ☑ download
  - ☑ getPublicUrl
  - ☑ list (add this)

This will allow public listing (which is usually fine for a public bucket).

---

## Solution 4: Skip Policy 4 Entirely

**Minimum Required Policies:**
- ✅ Policy 1: Public Read Access
- ✅ Policy 2: Authenticated Upload

**Optional Policies:**
- Policy 3: Authenticated Update Delete (if you want update/delete)
- Policy 4: Authenticated List (if you want listing - can skip if not available)

---

## What to Do

**Option 1: Skip Policy 4 (Recommended)**
- Just create Policies 1, 2, and 3
- Policy 4 is optional and not critical

**Option 2: Add `list` to Policy 1**
- Edit Policy 1
- Add `list` to the operations
- This gives public listing access

**Option 3: Try creating Policy 4 again**
- Make sure you're in the right bucket (thesis-documents)
- Make sure you clicked "New Policy"
- Check if `list` appears in the operations dropdown

---

## Summary

- **Policy 4 is optional** - you can skip it
- **Minimum needed:** Policies 1 and 2
- **If you want listing:** Add `list` to Policy 1 instead
- **Your uploads will work** with just Policies 1, 2, and 3

Don't worry if you can't create Policy 4 - it's not required for basic functionality!

