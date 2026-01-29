# 🚀 DEPLOYMENT STEPS - DO KARO YEH

## ✅ GitHub pe code push ho gaya!
**Repository:** https://github.com/Aadityaaa27/Back-2-Campus

---

## 📋 STEP 1: BACKEND DEPLOY (RENDER - 5 MINUTES)

### **Go to Render:**
1. Open: https://render.com/
2. Click **"Get Started for Free"**
3. Sign up with **GitHub**

### **Create Web Service:**
1. Click **"New +"** → **"Web Service"**
2. Click **"Connect Account"** → Select **GitHub**
3. Search & select: **"Back-2-Campus"** repository
4. Click **"Connect"**

### **Configure Backend:**
```
Name:                 back2campus-api
Region:               Singapore (or nearest)
Branch:               main
Root Directory:       Backend
Runtime:              Node
Build Command:        npm install
Start Command:        npm start
Instance Type:        Free
```

### **Add Environment Variables:**
Click **"Advanced"** → **"Add Environment Variable"**

Add these one by one:
```
MONGO_URI = mongodb+srv://your_mongodb_uri_here
JWT_SECRET = super_secret_key_12345_change_this
PORT = 5000
NODE_ENV = production
GOOGLE_GEMINI_API_KEY = your_api_key_here
```

**MongoDB URI kaha se mile?**
- Login: https://cloud.mongodb.com
- Clusters → Connect → Drivers
- Copy connection string
- Replace `<password>` with your actual password

### **Deploy!**
1. Click **"Create Web Service"**
2. Wait 3-5 minutes
3. **Backend URL mil jayega**: `https://back2campus-api.onrender.com`

✅ **Copy this URL!** Frontend me use karenge.

---

## 📋 STEP 2: FRONTEND DEPLOY (VERCEL - 2 MINUTES)

### **Option A: Vercel Dashboard (Easier)**

1. Open: https://vercel.com/new
2. Click **"Import Git Repository"**
3. Select: **"Aadityaaa27/Back-2-Campus"**
4. Configure:
   ```
   Framework Preset:    Vite
   Root Directory:      Frontend
   Build Command:       npm run build
   Output Directory:    dist
   Install Command:     npm install
   ```

5. **Add Environment Variable:**
   Click **"Environment Variables"**
   ```
   VITE_API_URL = https://back2campus-api.onrender.com/api/v1
   ```
   (Use your actual backend URL from Step 1)

6. Click **"Deploy"**
7. Wait 2-3 minutes

✅ **Frontend URL**: `https://back-2-campus-xxxxx.vercel.app`

---

### **Option B: Vercel CLI (Terminal)**

```bash
# Login first
vercel login

# Deploy Frontend
cd Frontend
vercel --prod

# When prompted:
# - Link to existing project? NO
# - Project name: back-2-campus
# - Directory: ./ (default)
# - Build settings: YES (default)

# After deployment, add environment variable:
# Go to: https://vercel.com/dashboard
# Your Project → Settings → Environment Variables
# Add: VITE_API_URL = https://back2campus-api.onrender.com/api/v1

# Redeploy to apply env variable:
vercel --prod
```

---

## 🎯 STEP 3: VERIFY DEPLOYMENT

### **Test Backend:**
Open browser:
```
https://back2campus-api.onrender.com/
```
Should show: "Back-2-Campus API" message

### **Test Frontend:**
1. Open: `https://back-2-campus-xxxxx.vercel.app`
2. Click **"Login"**
3. Select **"Student"**
4. Enter:
   ```
   Email: test2026@example.com
   Password: Test@12345
   ```
5. Should login successfully!

---

## ⚠️ IMPORTANT CHECKS

### **MongoDB Atlas:**
1. Go to: https://cloud.mongodb.com
2. Network Access → Add IP Address
3. Add: **0.0.0.0/0** (allows all)
4. Save

### **Backend Logs:**
Render Dashboard → Your Service → Logs
Check for errors

### **Frontend Console:**
Browser → F12 → Console
Check for API errors

---

## 🎉 SUCCESS CHECKLIST

- ✅ Backend deployed on Render
- ✅ Frontend deployed on Vercel
- ✅ Environment variables added
- ✅ MongoDB allows connections
- ✅ Login working
- ✅ API calls successful

---

## 📱 SHARE YOUR WEBSITE

After deployment:
- **Live URL**: `https://back-2-campus.vercel.app` (or your custom URL)
- Anyone can access!

---

## 🔄 AUTO-DEPLOY SETUP

**Already configured!** ✅

When you push to GitHub:
```bash
git add .
git commit -m "Update something"
git push
```

Both Render & Vercel will **auto-deploy**! 🚀

---

## 🚨 TROUBLESHOOTING

### **Backend not starting:**
- Check Render logs
- Verify MongoDB URI is correct
- Check environment variables

### **Frontend can't reach backend:**
- Verify VITE_API_URL is correct
- Check backend is running
- Open Network tab in browser

### **Login not working:**
- Check MongoDB has test user
- Verify backend `/api/v1/auth/login-student` endpoint works
- Check browser console for errors

---

## 💡 QUICK LINKS

- **GitHub Repo**: https://github.com/Aadityaaa27/Back-2-Campus
- **Render**: https://render.com
- **Vercel**: https://vercel.com
- **MongoDB**: https://cloud.mongodb.com

---

## 🎯 NEXT STEPS AFTER DEPLOYMENT:

1. Test all features
2. Custom domain (optional)
3. SSL certificate (auto on Vercel/Render)
4. Add more features
5. Share with friends!

---

**BAS 7 MINUTES ME HO JAYEGA!** ⚡

1. Backend Render pe (5 min)
2. Frontend Vercel pe (2 min)
3. Test karo!

**Need help? DM karo!** 💪
