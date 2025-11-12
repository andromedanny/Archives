# Deployment Fix Checklist

## 🎯 Issue
The deployed version on Vercel is missing the `downloadDocument` and `getDocumentUrl` methods, causing errors when viewing/downloading PDFs.

## ✅ Solution
The code has been updated with fallback methods. Now you need to rebuild and redeploy the frontend.

---

## 📋 Step-by-Step Fix

### Step 1: Commit All Changes
```bash
git add .
git commit -m "Fix: Add downloadDocument and getDocumentUrl methods with fallbacks"
git push origin main
```

### Step 2: Verify Vercel Auto-Deploy
1. **Go to Vercel Dashboard**
   - Open your project
   - Check if it's connected to GitHub
   - If connected, it will auto-deploy when you push to main

2. **Or Manually Redeploy**
   - Go to "Deployments" tab
   - Click the three dots (⋯) on the latest deployment
   - Click "Redeploy"
   - Wait for deployment to complete (2-3 minutes)

### Step 3: Verify Environment Variables
Make sure `VITE_API_URL` is set in Vercel:
1. Go to "Settings" → "Environment Variables"
2. Verify `VITE_API_URL` is set to your backend URL (e.g., `https://your-backend.onrender.com/api`)
3. If not set, add it and redeploy

### Step 4: Test the Fix
1. **Test PDF Viewing**
   - Go to `/my-theses`
   - Click "View" on a thesis
   - Should navigate to thesis detail page
   - Click "View PDF" - should display PDF in browser

2. **Test PDF Download**
   - Go to `/my-theses`
   - Click "PDF" button
   - Should download the PDF

3. **Test Thesis List**
   - Go to `/thesis`
   - Should load thesis list without errors
   - Click "View" - should navigate to thesis detail
   - Click "Download" - should download PDF (if available)

---

## 🔍 What Was Fixed

### 1. Added Fallback Methods
- If `getDocumentUrl` is missing, construct URL manually
- If `downloadDocument` is missing, use `downloadThesis` instead

### 2. Improved Error Handling
- Better error messages for missing methods
- Don't crash if methods are missing
- Show helpful messages to users

### 3. Better PDF Viewing
- Fixed PDF viewing URL construction
- Added token support for iframe viewing
- Improved error handling for PDF loading

---

## ✅ Verification Checklist

After redeploying, verify:

- [ ] Frontend builds successfully
- [ ] No console errors about missing methods
- [ ] PDF viewing works (click "View PDF" button)
- [ ] PDF download works (click "Download PDF" button)
- [ ] Thesis list loads without errors
- [ ] My Theses page loads without errors
- [ ] Navigation works (clicking "View" button)

---

## 🐛 If Issues Persist

### Issue: Methods Still Missing
**Solution:**
1. Clear browser cache
2. Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)
3. Check Vercel build logs for errors
4. Verify all files are committed and pushed

### Issue: PDF Not Loading
**Solution:**
1. Check if `VITE_API_URL` is set correctly
2. Verify backend is running
3. Check browser console for CORS errors
4. Verify backend `/api/thesis/:id/view` endpoint exists

### Issue: 404 Errors
**Solution:**
1. Check backend URL is correct
2. Verify backend is deployed and running
3. Test backend endpoint: `https://your-backend.onrender.com/api/health`
4. Check Vercel environment variables

---

## 📝 Notes

- The code now has fallback methods, so it won't crash if methods are missing
- However, you still need to redeploy to get the latest code
- After redeploy, the methods will be available and work correctly
- The fallbacks are just a safety net in case of build issues

---

## 🚀 Quick Deploy

If you're using GitHub:
1. Commit changes: `git add . && git commit -m "Fix PDF viewing" && git push`
2. Vercel will auto-deploy
3. Wait 2-3 minutes
4. Test the site

That's it! 🎉

