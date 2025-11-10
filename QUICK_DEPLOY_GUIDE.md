# Quick Deploy Guide to Vercel

## 🎯 Recommended Setup

**Frontend**: Vercel (React/Vite)  
**Backend**: Railway or Render (Node.js/Express)  
**Database**: PlanetScale (MySQL) or Railway MySQL  
**File Storage**: AWS S3, Cloudinary, or Vercel Blob  

## 📦 Step 1: Prepare Your Code

### 1.1 Update Frontend API Configuration
The frontend already uses environment variables. You just need to set `VITE_API_URL` in Vercel.

### 1.2 Update Backend for Cloud Storage
You'll need to update file uploads to use cloud storage (we'll do this).

### 1.3 Update Database Configuration
The database config already supports environment variables. Just update the connection string.

## 🗄️ Step 2: Set Up Cloud Database

### Option A: PlanetScale (Recommended)
1. Go to https://planetscale.com
2. Sign up and create a database
3. Get connection string (format: `mysql://user:password@host:port/database`)
4. Copy the connection string

### Option B: Railway MySQL
1. Go to https://railway.app
2. Create new project
3. Add MySQL service
4. Get connection details from variables

## 💾 Step 3: Set Up Cloud File Storage

### Option A: AWS S3 (Most Flexible)
1. Create AWS account
2. Create S3 bucket
3. Get access keys
4. Install AWS SDK: `npm install aws-sdk`

### Option B: Cloudinary (Easiest)
1. Sign up at https://cloudinary.com
2. Get cloud name, API key, API secret
3. Install Cloudinary: `npm install cloudinary`

### Option C: Vercel Blob (Simplest for Vercel)
1. Enable Vercel Blob in Vercel dashboard
2. Get blob store URL
3. Use Vercel Blob SDK

## 🚀 Step 4: Deploy Backend

### Using Railway (Recommended)
1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Select your repository
5. Select `backend` folder as root
6. Add environment variables:
   - `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`
   - `JWT_SECRET`, `JWT_EXPIRE`
   - `FRONTEND_URL` (your Vercel URL)
   - File storage credentials (if using S3/Cloudinary)
7. Deploy
8. Copy the backend URL (e.g., `https://your-app.railway.app`)

### Using Render
1. Go to https://render.com
2. Create new Web Service
3. Connect GitHub repository
4. Set root directory to `backend`
5. Add environment variables (same as Railway)
6. Deploy
7. Copy the backend URL

## 🌐 Step 5: Deploy Frontend to Vercel

1. Go to https://vercel.com
2. Sign up/login
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Add environment variables:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-app.railway.app/api`)
7. Deploy
8. Copy the frontend URL (e.g., `https://your-app.vercel.app`)

## 🔧 Step 6: Update Backend CORS

Update your backend `FRONTEND_URL` environment variable to your Vercel URL:
```
FRONTEND_URL=https://your-app.vercel.app
```

## ✅ Step 7: Test Deployment

1. Open your Vercel URL
2. Test login
3. Test file upload
4. Test file download
5. Test all features

## 🐛 Troubleshooting

### CORS Errors
- Check `FRONTEND_URL` in backend environment variables
- Make sure it matches your Vercel URL exactly

### API Not Working
- Check `VITE_API_URL` in frontend environment variables
- Make sure backend is deployed and running
- Check backend logs

### File Upload Fails
- Check file storage configuration
- Make sure credentials are correct
- Check file size limits

### Database Connection Fails
- Check connection string
- Make sure database is accessible
- Check firewall settings

## 📝 Next Steps

After deployment:
1. Set up custom domain (optional)
2. Set up SSL certificates (automatic on Vercel/Railway)
3. Set up monitoring
4. Set up backups
5. Set up CI/CD (optional)

## 🔒 Security Checklist

- [ ] Use strong JWT secret
- [ ] Use environment variables for all secrets
- [ ] Enable CORS properly
- [ ] Use HTTPS (automatic on Vercel/Railway)
- [ ] Set up rate limiting
- [ ] Validate file uploads
- [ ] Use secure file storage
- [ ] Regularly update dependencies

