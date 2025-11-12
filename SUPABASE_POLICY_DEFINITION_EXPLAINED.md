# Supabase Policy Definition Field - What to Enter

## The Policy Definition Field

When creating a Supabase Storage policy, you'll see a field called **"Policy definition"** or **"USING expression"**. This is where you enter a SQL expression.

## What to Type

### For All Policies in This Guide: Just Type `true`

In the **Policy definition** field, type exactly:

```
true
```

**Important:**
- Type `true` in **all lowercase**
- **No quotes** around it
- **No semicolon** at the end
- **No extra text** or spaces

## Visual Example

When you see this field:

```
Policy definition
┌─────────────────────────────────────┐
│ bucket_id = 'thesis-documents'      │  ← This might be a template
└─────────────────────────────────────┘
```

**Replace it with:**

```
Policy definition
┌─────────────────────────────────────┐
│ true                                │  ← Type just this
└─────────────────────────────────────┘
```

## What Does `true` Mean?

- `true` means "allow this operation for all files in this bucket"
- It's the simplest way to allow access
- Perfect for public read access and authenticated uploads

## Alternative: Using bucket_id (Optional)

If you want to be more explicit, you can use:

```sql
bucket_id = 'thesis-documents'
```

But this is **not necessary** because:
- The policy is already scoped to the `thesis-documents` bucket
- `true` works just as well
- `true` is simpler and easier

## Step-by-Step for Each Policy

### Policy 1: Public Read Access

**Policy definition field:**
```
true
```

**WITH CHECK field (if shown):**
```
true
```

### Policy 2: Authenticated Upload

**Policy definition field:**
```
true
```

**WITH CHECK field (if shown):**
```
true
```

### Policy 3: Authenticated Update/Delete

**Policy definition field:**
```
true
```

**WITH CHECK field (if shown):**
```
true
```

### Policy 4: Authenticated List

**Policy definition field:**
```
true
```

**WITH CHECK field (if shown):**
```
true
```

## Common Mistakes to Avoid

❌ **Don't type:**
- `"true"` (with quotes)
- `TRUE` (uppercase)
- `true;` (with semicolon)
- `bucket_id = 'thesis-documents' AND true` (too complex)
- `return true;` (not valid SQL)

✅ **Do type:**
- `true` (just this, nothing else)

## If You See a Template

Supabase might show a template like:
```
bucket_id = 'thesis-documents'
```

You can:
1. **Delete it** and type `true` (recommended)
2. **Leave it as is** (it will also work, but `true` is simpler)
3. **Replace it** with just `true`

## Verification

After entering `true`:
1. The field should show: `true`
2. Click **Review** to verify
3. You should see the policy summary
4. Click **Save policy**

## Troubleshooting

### Error: "Invalid policy definition"
**Solution:** Make sure you typed `true` exactly (all lowercase, no quotes)

### Error: "Policy definition is required"
**Solution:** The field cannot be empty. Type `true` in the field.

### Field is grayed out or disabled
**Solution:** Make sure you've selected at least one "Allowed operation" first.

## Summary

**For all policies in this setup:**
- **Policy definition:** Type `true`
- **WITH CHECK (if shown):** Type `true`

That's it! Simple and it works perfectly.

