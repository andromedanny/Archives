# How to Run the Database Reset Script

## 🎯 Where to Run the Commands

You can run the commands in any of these terminals:

### Option 1: VS Code Terminal (Recommended - Easiest!)

1. **Open VS Code**
   - Open your project folder in VS Code

2. **Open Terminal**
   - Press `Ctrl + `` (backtick) to open terminal
   - Or go to: `Terminal → New Terminal`

3. **Run Commands**
   ```bash
   cd backend
   npm run reset-db
   ```

### Option 2: PowerShell (Windows)

1. **Open PowerShell**
   - Press `Win + X`
   - Click "Windows PowerShell" or "Terminal"
   - Or search "PowerShell" in Start Menu

2. **Navigate to Project**
   ```powershell
   cd C:\Users\Rufino\Desktop\Archives\backend
   ```

3. **Run Reset Script**
   ```powershell
   npm run reset-db
   ```

### Option 3: Command Prompt (CMD)

1. **Open Command Prompt**
   - Press `Win + R`
   - Type `cmd` and press Enter

2. **Navigate to Project**
   ```cmd
   cd C:\Users\Rufino\Desktop\Archives\backend
   ```

3. **Run Reset Script**
   ```cmd
   npm run reset-db
   ```

### Option 4: Git Bash

1. **Open Git Bash**
   - Right-click in project folder
   - Select "Git Bash Here"

2. **Navigate to Backend**
   ```bash
   cd backend
   ```

3. **Run Reset Script**
   ```bash
   npm run reset-db
   ```

## 📋 Step-by-Step (VS Code - Recommended)

1. **Open VS Code**
   - Open folder: `C:\Users\Rufino\Desktop\Archives`

2. **Open Terminal**
   - Press `Ctrl + `` (backtick key)
   - Or: `Terminal → New Terminal`

3. **Check Current Directory**
   - Terminal should show: `C:\Users\Rufino\Desktop\Archives`

4. **Navigate to Backend**
   ```bash
   cd backend
   ```

5. **Run Reset Script**
   ```bash
   npm run reset-db
   ```

6. **Wait for Completion**
   - Should see: "PostgreSQL database connected successfully"
   - Should see: "Database tables recreated"
   - Should see: "Default admin user created"
   - Should see: "Database reset completed successfully!"

## ✅ What You Should See

```
Connecting to database...
PostgreSQL database connected successfully
Database: postgres
Starting database reset...
WARNING: This will delete ALL data in the database!
Dropping all tables (PostgreSQL)...
Database tables recreated
Default admin user created: admin@faith.edu.ph
Dummy student user created: student@faith.edu.ph
Department created: College of Engineering
  Course created: BS Computer Engineering (BS-CpE)
  Course created: BS Electronics Engineering (BS-ECE)
  ...
Database reset completed successfully!

Default Admin Credentials:
Email: admin@faith.edu.ph
Password: admin123

Default Student Credentials:
Email: student@faith.edu.ph
Password: student123

Please change the password after first login.
Database connection closed
```

## 🐛 Troubleshooting

### Error: "npm: command not found"
- **Solution**: Make sure Node.js is installed
- Check: `node --version`
- Install Node.js from: https://nodejs.org/

### Error: "Cannot find module"
- **Solution**: Install dependencies first
  ```bash
  cd backend
  npm install
  ```

### Error: "Cannot connect to database"
- **Solution**: Check `backend/.env` file
- Make sure `DATABASE_URL` is correct
- Make sure Supabase project is active

### Error: "JWT_SECRET is required"
- **Solution**: Update `backend/.env` file
- Add `JWT_SECRET=your_secret_here`
- Get it from Render or generate a new one

## 🎯 Quick Reference

**Full Path:**
```
C:\Users\Rufino\Desktop\Archives\backend
```

**Commands:**
```bash
cd C:\Users\Rufino\Desktop\Archives\backend
npm run reset-db
```

**Or from project root:**
```bash
cd backend
npm run reset-db
```

## 🚀 Ready to Run!

1. Open your terminal (VS Code recommended)
2. Navigate to `backend` folder
3. Run `npm run reset-db`
4. Wait for completion
5. Verify in Supabase dashboard

## 💡 Pro Tip

**Easiest Way:**
1. Open VS Code
2. Open project folder
3. Press `Ctrl + `` to open terminal
4. Type: `cd backend && npm run reset-db`
5. Press Enter

That's it! 🎉

