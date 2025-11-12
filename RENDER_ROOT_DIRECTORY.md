# Render Root Directory Configuration

## 🎯 Root Directory: `backend`

### What to Put:
```
backend
```

### Why?
- Your backend code is in the `backend/` folder
- Your `package.json` is in `backend/package.json`
- Your `server.js` is in `backend/server.js`
- Render needs to know where to run commands

### Complete Render Configuration:

```
Name: faith-thesis-backend
Region: [Choose closest to you]
Branch: main
Root Directory: backend          ← PUT THIS HERE!
Runtime: Node
Build Command: npm install
Start Command: npm start
Plan: Free
```

## 📁 Project Structure

Your repository structure:
```
Archives/ (root)
  ├── backend/              ← Backend code is here
  │   ├── server.js
  │   ├── package.json
  │   ├── routes/
  │   ├── models/
  │   └── ...
  ├── frontend/             ← Frontend code (not needed for backend)
  │   ├── src/
  │   ├── package.json
  │   └── ...
  └── README.md
```

## ✅ What Happens:

1. **Render clones your repository**
2. **Render changes to `backend/` directory** (because Root Directory = `backend`)
3. **Render runs `npm install`** (in the `backend/` directory)
4. **Render runs `npm start`** (in the `backend/` directory)
5. **Render starts your server** from `backend/server.js`

## 🚨 Important Notes:

### ✅ DO:
- Set Root Directory to: `backend`
- This tells Render where your backend code is
- Render will only auto-deploy when `backend/` folder changes

### ❌ DON'T:
- Leave it empty (Render will look in root, won't find package.json)
- Set it to `frontend` (that's for frontend deployment)
- Set it to `/backend` (no leading slash needed)

## 📋 Quick Checklist:

- [ ] Root Directory: `backend` (no quotes, no slashes)
- [ ] Build Command: `npm install`
- [ ] Start Command: `npm start`
- [ ] All environment variables added
- [ ] Ready to deploy!

## 🎯 Example:

**Render Configuration:**
```
Root Directory: backend
Build Command: npm install
Start Command: npm start
```

**What Render Does:**
1. `cd backend` (changes to backend directory)
2. `npm install` (installs dependencies)
3. `npm start` (runs `node server.js`)
4. Server starts on port 10000

## 💡 Pro Tips:

1. **Root Directory is Case-Sensitive**: Make sure it matches your folder name exactly
2. **No Leading Slash**: Just `backend`, not `/backend`
3. **No Trailing Slash**: Just `backend`, not `backend/`
4. **Monorepo Setup**: This is perfect for monorepos with multiple apps
5. **Auto-Deploy**: Render will only deploy when `backend/` folder changes (not when `frontend/` changes)

## 🚀 After Setting Root Directory:

1. ✅ Set Root Directory: `backend`
2. ✅ Set Build Command: `npm install`
3. ✅ Set Start Command: `npm start`
4. ✅ Add environment variables
5. ✅ Click "Create Web Service"
6. ✅ Wait for deployment
7. ✅ Test your backend!

## 📞 Common Questions:

### Q: Why not leave it empty?
**A:** If you leave it empty, Render looks in the root directory. Your `package.json` is in `backend/`, so it won't find it.

### Q: Can I use `/backend`?
**A:** No, just use `backend` (no leading slash).

### Q: What if my folder is named differently?
**A:** Use the exact folder name. If it's `back-end`, use `back-end`.

### Q: Will it work if I change the folder name later?
**A:** Yes, but you'll need to update the Root Directory in Render settings.

## ✅ Final Answer:

**Root Directory: `backend`**

That's it! Just type `backend` in the Root Directory field.

