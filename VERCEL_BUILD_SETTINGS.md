# Vercel Build Settings - What to Put

## 📋 Vercel Configuration Settings

### 1. Build Command

**Put this:**
```
npm run build
```

**Why:**
- Your `package.json` has a `build` script that runs `vite build`
- Vercel will run `npm run build` which executes the script
- This is the standard way to build Vite projects

**Alternative (also works, but less common):**
```
vite build
```

**Recommendation:** Use `npm run build` ✅

---

### 2. Output Directory

**Put this:**
```
dist
```

**Why:**
- Vite builds your project and outputs to the `dist/` folder
- This is the default output directory for Vite
- Vercel needs to know where to find the built files

**Note:** This should be relative to the Root Directory (`frontend/`)
- So the full path would be: `frontend/dist/`
- But you only put: `dist` (Vercel knows it's relative to Root Directory)

---

### 3. Install Command

**Put this:**
```
npm install
```

**Why:**
- This installs all dependencies from `package.json`
- Vercel needs to install dependencies before building
- This is the standard command for Node.js projects

**Alternative (also works):**
```
npm ci
```
- `npm ci` is faster and more reliable for CI/CD
- But `npm install` is simpler and works fine

**Recommendation:** Use `npm install` ✅

---

## 🎯 Complete Vercel Configuration

Here's what to put in each field:

| Setting | Value | Notes |
|---------|-------|-------|
| **Framework Preset** | `Vite` | Auto-detected |
| **Root Directory** | `frontend` | ⚠️ Important! |
| **Build Command** | `npm run build` | ✅ Recommended |
| **Output Directory** | `dist` | ✅ Standard |
| **Install Command** | `npm install` | ✅ Standard |

---

## 📝 Step-by-Step in Vercel

1. **Framework Preset**
   - Should auto-detect as `Vite`
   - If not, select `Vite` from dropdown

2. **Root Directory**
   - Click "Edit" or "Change"
   - Type: `frontend`
   - Click "Continue"

3. **Build Command**
   - Should auto-fill as `npm run build`
   - If not, type: `npm run build`
   - Leave it as is ✅

4. **Output Directory**
   - Should auto-fill as `dist`
   - If not, type: `dist`
   - Leave it as is ✅

5. **Install Command**
   - Should auto-fill as `npm install`
   - If not, type: `npm install`
   - Leave it as is ✅

---

## ✅ Quick Checklist

- [ ] Framework Preset: `Vite` (auto-detected)
- [ ] Root Directory: `frontend` ⚠️ **SET THIS!**
- [ ] Build Command: `npm run build`
- [ ] Output Directory: `dist`
- [ ] Install Command: `npm install`
- [ ] Environment Variable: `VITE_API_URL=https://your-backend.onrender.com/api`

---

## 🔍 Why These Settings?

### Build Command: `npm run build`
- Runs the `build` script from `package.json`
- Which runs `vite build`
- This is the standard way to build Vite projects

### Output Directory: `dist`
- Vite outputs built files to `dist/` folder
- Vercel serves files from this directory
- This is the default for Vite projects

### Install Command: `npm install`
- Installs all dependencies from `package.json`
- Must run before building
- This is the standard Node.js command

---

## 🚀 After Setting Up

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Check build logs for any errors
4. Your app will be live at `https://your-app.vercel.app`

---

## 🐛 Troubleshooting

### Build Fails
- Check Root Directory is set to `frontend`
- Check Build Command is `npm run build`
- Check Output Directory is `dist`
- Check Install Command is `npm install`

### Can't Find package.json
- Make sure Root Directory is set to `frontend`
- Vercel should find `frontend/package.json`

### Build Succeeds But App Doesn't Work
- Check environment variable `VITE_API_URL` is set
- Check it includes `/api` at the end
- Check backend is running on Render

---

## 📋 Summary

**Just use the default values that Vercel suggests:**

1. **Build Command**: `npm run build` ✅
2. **Output Directory**: `dist` ✅
3. **Install Command**: `npm install` ✅

**The only thing you need to change:**
- **Root Directory**: Set to `frontend` ⚠️

That's it! 🎉


