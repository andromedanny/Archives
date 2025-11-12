# How to Find Supabase Project Ref and API Keys

## 🔍 Step-by-Step Guide

### Step 1: Find Your Project Reference (project-ref)

1. **Go to Supabase Dashboard**
   - Login at https://supabase.com
   - Select your project

2. **Find Project Reference in URL**
   - Look at your browser's address bar
   - The URL will look like: `https://supabase.com/dashboard/project/[project-ref]`
   - The `[project-ref]` is the long string of characters (e.g., `abcdefghijklmnop`)

3. **Or Find in Settings**
   - Go to **Settings → General**
   - Look for **Reference ID** or **Project ID**
   - Copy this value

**Example:**
- If your URL is: `https://supabase.com/dashboard/project/abcdefghijklmnop`
- Your project-ref is: `abcdefghijklmnop`

### Step 2: Find Your Database Connection String

1. **Go to Settings → Database**
   - Click on **Settings** in the left sidebar
   - Click on **Database**

2. **Find Connection String**
   - Scroll down to **Connection String** section
   - Select the **URI** tab (not Session mode)
   - You'll see something like:
     ```
     postgresql://postgres.[project-ref]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```

3. **Replace [YOUR-PASSWORD] with your actual password**
   - Your password is: `prodannyHAHA69`
   - Replace `[YOUR-PASSWORD]` with `prodannyHAHA69`

4. **Copy the Connection String**
   - It should look like:
     ```
     postgresql://postgres.abcdefghijklmnop:prodannyHAHA69@aws-0-us-east-1.pooler.supabase.com:6543/postgres
     ```
   - OR use the direct connection:
     ```
     postgresql://postgres:prodannyHAHA69@db.abcdefghijklmnop.supabase.co:5432/postgres
     ```

### Step 3: Find Your Supabase URL

1. **Go to Settings → API**
   - Click on **Settings** in the left sidebar
   - Click on **API**

2. **Find Project URL**
   - Look for **Project URL** or **API URL**
   - It will look like: `https://[project-ref].supabase.co`
   - Copy this URL

**Example:**
- If your project-ref is `abcdefghijklmnop`
- Your Supabase URL is: `https://abcdefghijklmnop.supabase.co`

### Step 4: Find Your Anon Key (API Key)

1. **Still in Settings → API**
   - You should already be here from Step 3

2. **Find API Keys Section**
   - Scroll down to **API Keys** section
   - You'll see two keys:
     - **anon public** - This is the one you need!
     - **service_role** - Don't use this one (it's secret)

3. **Copy the anon public key**
   - Click the **Copy** button next to **anon public**
   - It will look like: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890`
   - This is a very long string

### Step 5: Generate JWT_SECRET

You need to generate a random string for JWT_SECRET. Here are options:

**Option 1: Use Online Generator**
- Go to: https://generate-secret.vercel.app/32
- Click "Generate"
- Copy the generated string

**Option 2: Use PowerShell (Windows)**
```powershell
# Run this in PowerShell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | % {[char]$_})
```

**Option 3: Use Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Option 4: Use a Simple String (Not Recommended for Production)**
- You can use: `my_super_secret_jwt_key_change_this_in_production_12345`
- But generate a random one is better!

## 📝 Complete Example

After finding all the information, your environment variables should look like this:

```env
# Database (Replace [project-ref] with your actual project-ref)
DATABASE_URL=postgresql://postgres:prodannyHAHA69@db.abcdefghijklmnop.supabase.co:5432/postgres
DB_TYPE=postgres

# Supabase (Replace [project-ref] with your actual project-ref)
SUPABASE_URL=https://abcdefghijklmnop.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTMxODE1MDIyfQ.abcdefghijklmnopqrstuvwxyz1234567890
SUPABASE_STORAGE_BUCKET=thesis-documents
STORAGE_TYPE=supabase

# JWT (Replace with generated random string)
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
JWT_EXPIRE=7d

# Server
NODE_ENV=production
PORT=10000

# URLs (Update after deploying)
FRONTEND_URL=https://your-app.vercel.app
BACKEND_URL=https://your-app.onrender.com

# Optional
ENABLE_SYNC=false
ENABLE_HTTP_LOGGING=false
```

## 🎯 Quick Checklist

- [ ] Found project-ref from URL or Settings → General
- [ ] Got DATABASE_URL from Settings → Database (replaced password)
- [ ] Got SUPABASE_URL from Settings → API
- [ ] Got SUPABASE_KEY (anon public) from Settings → API
- [ ] Generated JWT_SECRET (random string)
- [ ] Verified storage bucket exists: `thesis-documents`

## 📸 Visual Guide

### Finding Project Ref:
```
Supabase Dashboard URL:
https://supabase.com/dashboard/project/[THIS-IS-YOUR-PROJECT-REF]
                                      ^^^^^^^^^^^^^^^^^^^^^^^^^^
```

### Finding Database URL:
```
Settings → Database → Connection String → URI Tab
Copy the connection string and replace [YOUR-PASSWORD] with: prodannyHAHA69
```

### Finding API Keys:
```
Settings → API → API Keys Section
Copy the "anon public" key (long string starting with eyJ...)
```

## ⚠️ Important Notes

1. **Password in URL**: Make sure to URL-encode your password if it has special characters
   - Your password `prodannyHAHA69` should work as-is (no special characters)
   - If you had special characters like `@` or `#`, you'd need to encode them

2. **Anon Key vs Service Role Key**:
   - Use **anon public** key for client-side and backend
   - **service_role** key is more powerful - only use for server-side admin tasks
   - For now, use **anon public** key

3. **Project Ref**:
   - It's usually 20 characters long
   - Looks like: `abcdefghijklmnop` or `xyz1234567890abcd`
   - Found in your dashboard URL or Settings → General

4. **Database URL Format**:
   - Use the **URI** format, not Session mode
   - Should start with: `postgresql://`
   - Contains your password and project-ref

## 🚨 Troubleshooting

### Can't Find Project Ref?
- Check your browser's address bar when on Supabase dashboard
- Go to Settings → General → Reference ID
- It's usually visible in multiple places

### Can't Find Anon Key?
- Make sure you're in Settings → API
- Scroll down to API Keys section
- Look for "anon public" (not "service_role")
- Click the "Copy" button to copy it

### Database URL Not Working?
- Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check if your password has special characters that need encoding
- Try the direct connection format: `postgresql://postgres:prodannyHAHA69@db.[project-ref].supabase.co:5432/postgres`

### Connection Issues?
- Verify your password is correct
- Check if your Supabase project is active
- Make sure you're using the correct project-ref
- Try the pooler connection string if direct doesn't work

## ✅ Next Steps

After you have all the information:

1. ✅ Fill in the environment variables with your actual values
2. ✅ Deploy backend to Render
3. ✅ Paste environment variables in Render dashboard
4. ✅ Deploy and test!

## 📞 Need More Help?

If you're still stuck:
1. Take a screenshot of your Supabase Settings → API page
2. Check the browser URL for project-ref
3. Verify you're copying the correct anon key (not service_role)
4. Make sure your password is correct

