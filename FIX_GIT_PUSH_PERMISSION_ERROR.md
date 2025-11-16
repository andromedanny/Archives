# Fix Git Push Permission Error

## 🚨 Error Message

```
remote: Permission to andromedanny/Archives.git denied to TamayoRainierJustine.
fatal: unable to access 'https://github.com/andromedanny/Archives.git/': The requested URL returned error: 403
```

**Problem**: Git is using the wrong GitHub account credentials (`TamayoRainierJustine`) instead of the correct account (`andromedanny`).

---

## ✅ Solution: Fix GitHub Authentication

### Option 1: Clear Stored Credentials (Recommended)

Windows Git Credential Manager has stored the wrong credentials. Clear them:

1. **Open Windows Credential Manager**:
   - Press `Windows Key + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Go to "Windows Credentials"** tab

3. **Find GitHub credentials**:
   - Look for: `git:https://github.com`
   - Or: `github.com`
   - Or any entry related to GitHub

4. **Remove the wrong credentials**:
   - Click on the credential entry
   - Click "Remove" or "Delete"
   - Confirm deletion

5. **Try pushing again**:
   ```bash
   git push origin main
   ```

6. **Windows will prompt for credentials**:
   - Enter your GitHub username: `andromedanny`
   - Enter your GitHub password or Personal Access Token
   - Click "OK"

---

### Option 2: Use Personal Access Token

If you don't have a password (GitHub requires tokens now), use a Personal Access Token:

1. **Create Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Click "Generate new token (classic)"
   - Give it a name: `Railway Deployment`
   - Select scopes: `repo` (full control of private repositories)
   - Click "Generate token"
   - Copy the token (you'll only see it once!)

2. **Use token when pushing**:
   - When prompted for password, paste the token instead
   - Username: `andromedanny`
   - Password: `your-personal-access-token`

---

### Option 3: Update Git Remote to Use SSH

Switch from HTTPS to SSH to avoid credential issues:

1. **Check if you have SSH key**:
   ```bash
   ls -al ~/.ssh
   ```
   - Look for `id_rsa.pub` or `id_ed25519.pub`

2. **If no SSH key, create one**:
   ```bash
   ssh-keygen -t ed25519 -C "prodanny80@gmail.com"
   ```
   - Press Enter to accept default location
   - Enter a passphrase (optional)
   - Copy the public key: `cat ~/.ssh/id_ed25519.pub`

3. **Add SSH key to GitHub**:
   - Go to GitHub → Settings → SSH and GPG keys
   - Click "New SSH key"
   - Paste your public key
   - Click "Add SSH key"

4. **Update Git remote to use SSH**:
   ```bash
   git remote set-url origin git@github.com:andromedanny/Archives.git
   ```

5. **Test SSH connection**:
   ```bash
   ssh -T git@github.com
   ```
   - Should say: "Hi andromedanny! You've successfully authenticated..."

6. **Try pushing again**:
   ```bash
   git push origin main
   ```

---

### Option 4: Use GitHub CLI (gh)

Use GitHub CLI to authenticate:

1. **Install GitHub CLI** (if not installed):
   - Download from: https://cli.github.com/
   - Or use: `winget install GitHub.cli`

2. **Authenticate with GitHub**:
   ```bash
   gh auth login
   ```
   - Follow the prompts
   - Select GitHub.com
   - Select HTTPS or SSH
   - Authenticate with browser or token

3. **Try pushing again**:
   ```bash
   git push origin main
   ```

---

## 🔍 Quick Fix (Windows)

### Clear Git Credentials via Command Line

1. **Clear stored credentials**:
   ```bash
   git credential-manager-core erase
   ```
   - Or: `git credential reject https://github.com`

2. **Or use Windows Credential Manager**:
   - Press `Windows Key`
   - Type: "Credential Manager"
   - Open "Windows Credentials"
   - Find and remove GitHub credentials

3. **Try pushing again**:
   ```bash
   git push origin main
   ```

---

## 🎯 Recommended Solution

### Step 1: Clear Stored Credentials

1. **Open Windows Credential Manager**:
   - Press `Windows Key + R`
   - Type: `control /name Microsoft.CredentialManager`
   - Press Enter

2. **Remove GitHub credentials**:
   - Go to "Windows Credentials" tab
   - Find and remove: `git:https://github.com` or `github.com`

### Step 2: Create Personal Access Token

1. **Go to GitHub**: https://github.com/settings/tokens
2. **Click "Generate new token (classic)"**
3. **Set token name**: `Railway Deployment`
4. **Select scopes**: `repo` (full control)
5. **Click "Generate token"**
6. **Copy the token** (save it securely!)

### Step 3: Push with Token

1. **Try pushing**:
   ```bash
   git push origin main
   ```

2. **When prompted**:
   - Username: `andromedanny`
   - Password: `your-personal-access-token` (paste the token)

3. **Success!** Railway will auto-deploy

---

## 📋 Alternative: Update Remote URL

If you have access to the repository with a different account, update the remote URL:

1. **Check current remote**:
   ```bash
   git remote -v
   ```

2. **Update remote URL** (if needed):
   ```bash
   git remote set-url origin https://github.com/andromedanny/Archives.git
   ```

3. **Try pushing again**:
   ```bash
   git push origin main
   ```

---

## 🆘 Still Having Issues?

### Issue 1: Still Getting 403 Error

**Solution**:
1. Make sure you're logged in to GitHub as `andromedanny`
2. Check if you have write access to the repository
3. Verify the repository exists: https://github.com/andromedanny/Archives
4. Try using SSH instead of HTTPS

### Issue 2: Token Not Working

**Solution**:
1. Make sure token has `repo` scope
2. Check if token is expired
3. Generate a new token
4. Make sure you're using the token as the password (not your GitHub password)

### Issue 3: SSH Not Working

**Solution**:
1. Verify SSH key is added to GitHub
2. Test SSH connection: `ssh -T git@github.com`
3. Check SSH key permissions
4. Try generating a new SSH key

---

## ✅ Verification

After fixing authentication:

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
   - Railway should auto-deploy from GitHub
   - Check Railway Dashboard → Deployments
   - Should see new deployment

---

## 🎯 Quick Summary

1. **Clear Windows Credential Manager** (remove GitHub credentials)
2. **Create Personal Access Token** on GitHub
3. **Push with token** (use token as password)
4. **Railway will auto-deploy** from GitHub

---

## 📚 Related Guides

- **GitHub Personal Access Tokens**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token
- **Git Credential Manager**: https://github.com/GitCredentialManager/git-credential-manager
- **GitHub SSH Keys**: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

**Last Updated**: 2024-01-01
**Version**: 1.0.0

