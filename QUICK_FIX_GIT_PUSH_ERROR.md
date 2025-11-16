# Quick Fix: Git Push Permission Error

## 🚨 Error

```
remote: Permission to andromedanny/Archives.git denied to TamayoRainierJustine.
fatal: unable to access 'https://github.com/andromedanny/Archives.git/': The requested URL returned error: 403
```

**Problem**: Git is using wrong GitHub account (`TamayoRainierJustine`) instead of correct account (`andromedanny`).

---

## ✅ Quick Fix (3 Steps)

### Step 1: Clear Stored Credentials

**Option A: Using Windows Credential Manager** (Easiest)

1. **Press `Windows Key + R`**
2. **Type**: `control /name Microsoft.CredentialManager`
3. **Press Enter**
4. **Go to "Windows Credentials" tab**
5. **Find and remove**:
   - `git:https://github.com`
   - `github.com`
   - Any entry with "TamayoRainierJustine" or "github"
6. **Click "Remove"** on each one

**Option B: Using Command Line**

```bash
cmdkey /delete:git:https://github.com
```

---

### Step 2: Create GitHub Personal Access Token

1. **Go to GitHub**: https://github.com/settings/tokens
2. **Click "Generate new token (classic)"**
3. **Token name**: `Railway Deployment`
4. **Select scopes**: Check `repo` (full control)
5. **Click "Generate token"**
6. **Copy the token** (you'll only see it once! Save it somewhere safe)

---

### Step 3: Push with Token

1. **Try pushing**:
   ```bash
   git push origin main
   ```

2. **When prompted**:
   - **Username**: `andromedanny`
   - **Password**: `paste-your-personal-access-token-here` (NOT your GitHub password)

3. **Success!** Railway will auto-deploy

---

## 🔍 Alternative: Use SSH (Recommended for Long-term)

### Step 1: Generate SSH Key

```bash
ssh-keygen -t ed25519 -C "prodanny80@gmail.com"
```
- Press Enter to accept default location
- Enter passphrase (optional)

### Step 2: Copy Public Key

```bash
cat ~/.ssh/id_ed25519.pub
```
- Copy the output (starts with `ssh-ed25519...`)

### Step 3: Add to GitHub

1. **Go to GitHub**: https://github.com/settings/ssh/new
2. **Title**: `Railway Deployment`
3. **Key**: Paste your public key
4. **Click "Add SSH key"**

### Step 4: Update Git Remote

```bash
git remote set-url origin git@github.com:andromedanny/Archives.git
```

### Step 5: Test and Push

```bash
ssh -T git@github.com
git push origin main
```

---

## 🎯 Recommended: Use Personal Access Token

1. **Clear credentials** (Windows Credential Manager)
2. **Create token** (GitHub → Settings → Tokens)
3. **Push with token** (use token as password)

---

## ✅ Verification

After fixing:

1. **Test push**:
   ```bash
   git push origin main
   ```

2. **Should see**:
   ```
   Enumerating objects: ...
   Writing objects: ...
   To https://github.com/andromedanny/Archives.git
      abc123..def456  main -> main
   ```

3. **Check Railway**:
   - Railway Dashboard → Deployments
   - Should see new deployment starting

---

## 🆘 Still Having Issues?

1. **Make sure you're logged in to GitHub as `andromedanny`**
2. **Verify repository exists**: https://github.com/andromedanny/Archives
3. **Check you have write access** to the repository
4. **Try using SSH** instead of HTTPS
5. **See detailed guide**: `FIX_GIT_PUSH_PERMISSION_ERROR.md`

---

**Last Updated**: 2024-01-01

