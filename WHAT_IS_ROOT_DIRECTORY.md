# What is Root Directory in Vercel?

## 📁 Understanding Root Directory

**Root Directory** tells Vercel which folder contains your frontend code to build and deploy.

## 🎯 Why It Matters for Your Project

Your project structure looks like this:

```
Archives/
├── backend/          ← Backend code (Node.js/Express)
│   ├── server.js
│   ├── routes/
│   └── ...
├── frontend/         ← Frontend code (React/Vite) ⭐ THIS IS YOUR ROOT DIRECTORY
│   ├── src/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
└── README.md
```

## 🔍 What Vercel Needs to Know

Vercel needs to know:
1. **Where is your frontend code?** → `frontend/` folder
2. **Where is `package.json`?** → Inside `frontend/` folder
3. **Where is `vite.config.js`?** → Inside `frontend/` folder
4. **Where to run `npm install`?** → Inside `frontend/` folder
5. **Where to run `npm run build`?** → Inside `frontend/` folder

## ⚠️ What Happens If You Don't Set Root Directory?

### If Root Directory is Empty (Default):
- Vercel looks in the **root of your repository** (`Archives/`)
- Vercel won't find `package.json` in the root (it's in `frontend/`)
- **Build will fail!** ❌

### If Root Directory is Set to `frontend`:
- Vercel looks in the `frontend/` folder
- Vercel finds `package.json` in `frontend/`
- Vercel runs `npm install` in `frontend/`
- Vercel runs `npm run build` in `frontend/`
- **Build succeeds!** ✅

## 🎯 How to Set Root Directory in Vercel

### Step 1: Create Project
1. Go to Vercel
2. Click "Add New..." → "Project"
3. Import your repository

### Step 2: Configure Project
1. You'll see project settings
2. Look for **"Root Directory"** field
3. Click "Edit" or "Change" next to it
4. Type: `frontend`
5. Click "Continue" or "Save"

### Step 3: Verify Settings
After setting root directory, Vercel will:
- **Root Directory**: `frontend`
- **Build Command**: `npm run build` (runs in `frontend/`)
- **Output Directory**: `dist` (created in `frontend/dist/`)
- **Install Command**: `npm install` (runs in `frontend/`)

## 📋 Visual Example

### Without Root Directory (Wrong ❌):
```
Vercel looks here:
Archives/                    ← Vercel starts here
├── backend/
├── frontend/                ← Your code is here, but Vercel doesn't know
│   ├── package.json         ← Vercel won't find this
│   └── src/
└── README.md
```

### With Root Directory = "frontend" (Correct ✅):
```
Vercel looks here:
Archives/
├── backend/
└── frontend/                ← Vercel starts here (root directory)
    ├── package.json         ← Vercel finds this ✅
    ├── vite.config.js       ← Vercel finds this ✅
    ├── src/                 ← Vercel builds this ✅
    └── dist/                ← Vercel creates this ✅
```

## 🔧 Real-World Analogy

Think of it like this:
- **Repository Root**: Your entire house (`Archives/`)
- **Root Directory**: The specific room where your frontend lives (`frontend/`)
- **Vercel**: A builder who needs to know which room to work in

If you don't tell the builder which room, they'll look in the wrong place!

## ✅ Quick Checklist

When deploying to Vercel:
- [ ] Root Directory: `frontend` ⚠️ **MUST SET THIS!**
- [ ] Framework: `Vite` (auto-detected)
- [ ] Build Command: `npm run build` (auto-filled)
- [ ] Output Directory: `dist` (auto-filled)
- [ ] Environment Variable: `VITE_API_URL` (you add this)

## 🎯 Summary

**Root Directory** = The folder where your frontend code lives

For your project:
- **Set Root Directory to**: `frontend`
- **Why**: Because your React/Vite app is in the `frontend/` folder
- **What happens**: Vercel will build and deploy only the frontend code

## 💡 Pro Tip

If you had a simple project with frontend code in the root:
```
MyProject/
├── package.json      ← In root
├── src/
└── ...
```

Then you wouldn't need to set Root Directory (leave it empty), because Vercel would find everything in the root.

But since you have a **monorepo** (backend + frontend in one repo), you need to tell Vercel which folder to use!

## 🚀 Next Steps

1. Go to Vercel
2. Create new project
3. **Set Root Directory to `frontend`** ⚠️
4. Add environment variable: `VITE_API_URL`
5. Deploy!

That's it! 🎉

