# Using Vercel for Backend (Serverless Functions)

## ⚠️ Important Considerations

If you want to use Vercel for your backend, you need to convert your Express app to serverless functions. Here's what this involves:

## 🔄 Required Changes

### 1. Convert Express Routes to Serverless Functions

Instead of a single Express server, each route becomes a separate serverless function.

**Current Structure:**
```
backend/
  routes/
    auth.js
    thesis.js
    users.js
  server.js
```

**Vercel Structure:**
```
api/
  auth/
    login.js
    register.js
  thesis/
    index.js
    [id].js
  users/
    index.js
    [id].js
```

### 2. Use Cloud Storage (Required)

Vercel's file system is read-only (except `/tmp`), so you MUST use cloud storage:
- ✅ AWS S3
- ✅ Cloudinary
- ✅ Vercel Blob

We already have cloud storage setup in `backend/config/cloudStorage.js`!

### 3. Handle Serverless Limitations

- **Cold Starts**: First request after inactivity can be slow
- **Timeout**: 10 seconds on Hobby plan, 60 seconds on Pro
- **Memory**: Limited memory per function
- **File System**: Read-only (except `/tmp`)

## 🚀 Setup Guide

### Step 1: Create API Directory Structure

Create `api/` directory in your project root:

```
project-root/
  api/
    auth/
      login.js
      register.js
      me.js
    thesis/
      index.js
      [id].js
    users/
      index.js
      [id].js
  frontend/
  ...
```

### Step 2: Convert Express Routes

Example conversion:

**Before (Express):**
```javascript
// routes/auth.js
router.post('/login', async (req, res) => {
  // login logic
});
```

**After (Vercel Serverless):**
```javascript
// api/auth/login.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  // login logic
}
```

### Step 3: Update File Uploads

Use cloud storage instead of local filesystem:

```javascript
// Use cloud storage
const { uploadFile } = require('../config/cloudStorage');
const fileInfo = await uploadFile(req.file, 'thesis/documents');
```

### Step 4: Configure Vercel

Create `vercel.json` in project root:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/**/*.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/$1"
    },
    {
      "src": "/(.*)",
      "dest": "/frontend/$1"
    }
  ]
}
```

### Step 5: Set Environment Variables

In Vercel dashboard, set:
- `DATABASE_URL` (Supabase)
- `JWT_SECRET`
- `STORAGE_TYPE` (s3, cloudinary, or blob)
- Cloud storage credentials

## 📝 Alternative: Use Vercel API Routes with Express

You can also use Express with Vercel's serverless functions:

```javascript
// api/index.js
const express = require('express');
const app = express();

// Your routes
app.use('/auth', authRoutes);
app.use('/thesis', thesisRoutes);

module.exports = app;
```

Then in `vercel.json`:
```json
{
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

## ⚠️ Limitations to Consider

1. **File Uploads**
   - Cannot save to local filesystem
   - Must use cloud storage
   - Need to handle large files carefully

2. **Cold Starts**
   - First request after inactivity can be slow
   - Subsequent requests are fast
   - Can be mitigated with Pro plan

3. **Timeout Limits**
   - Hobby: 10 seconds
   - Pro: 60 seconds
   - Enterprise: Custom

4. **Database Connections**
   - Need connection pooling
   - Consider using Supabase connection pooling
   - Or use serverless-friendly database clients

5. **State Management**
   - No persistent state
   - Use database for state
   - Use external cache (Redis) if needed

## 🎯 Recommendation

**For your project, I still recommend Railway for backend because:**
1. ✅ No code changes needed
2. ✅ Better for file uploads
3. ✅ No cold starts
4. ✅ No timeout limits
5. ✅ Easier to debug
6. ✅ More reliable

**But if you want to use Vercel, here's what you need to do:**
1. Convert Express routes to serverless functions
2. Use cloud storage for file uploads
3. Handle cold starts
4. Consider Pro plan for better limits
5. Test thoroughly

## 🚀 Quick Decision Guide

**Use Railway if:**
- ✅ You want easiest setup
- ✅ You need reliable file uploads
- ✅ You want no cold starts
- ✅ You need long-running processes

**Use Vercel if:**
- ✅ You want everything in one platform
- ✅ You're okay with serverless limitations
- ✅ You'll use cloud storage anyway
- ✅ You want to learn serverless
- ✅ You have Pro plan (better limits)

## 💡 My Final Recommendation

**Use Railway for backend + Vercel for frontend**

This is the best combination because:
- ✅ Vercel excels at frontend
- ✅ Railway excels at backend
- ✅ Easiest setup
- ✅ Most reliable
- ✅ Best performance

But if you really want to use Vercel for everything, I can help you convert it! Just let me know.

