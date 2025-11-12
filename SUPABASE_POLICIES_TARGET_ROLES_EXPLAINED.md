# Supabase Storage Policies - Target Roles Explained

## About Target Roles

In Supabase Storage policies, when you select target roles:

### Policy 1: Public Read Access

**Target roles options:**
- `anon` - Anonymous users (not logged in)
- `public` - All users (may not be visible as separate option)
- `authenticated` - Logged-in users

**What to do:**
- **Option 1:** Select `anon` only (this covers public access)
- **Option 2:** Leave target roles empty (if caption says "defaults to public")
- **Option 3:** If both `anon` and `public` are visible, select both

**Result:** Anyone (logged in or not) can view/download files ✅

---

### Policy 2, 3, 4: Authenticated Only

**Target roles:**
- Select `authenticated` only
- Do NOT select `anon` or `public`
- If `anon` or `public` are selected, uncheck them

**Result:** Only logged-in users can upload/update/delete ✅

---

## Quick Guide

### Policy 1: Public Read Access
**Target roles:**
- Select `anon` (or leave empty if it says "defaults to public")
- That's it! This gives public access.

### Policy 2, 3, 4: Authenticated Operations
**Target roles:**
- Select `authenticated` only
- Make sure `anon` and `public` are NOT selected

---

## Summary

- **Policy 1:** `anon` only (or empty for default public) = Public access
- **Policy 2, 3, 4:** `authenticated` only = Logged-in users only

The caption "if there's no chosen target roles it will go to public" means:
- If you leave it empty for Policy 1, it defaults to public (which is what you want)
- For Policy 2, 3, 4, you MUST select `authenticated` (don't leave empty)

