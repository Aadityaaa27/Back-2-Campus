# 🚀 DEPLOYMENT GUIDE - Back-2-Campus

## 📌 Overview

You have 3 options to deploy this project:

### Option 1: **Separate Deployment (Recommended)**
- Frontend → Vercel (Free)
- Backend → Render/Railway (Free tier available)

### Option 2: **Single Platform Deployment**
- Both on Vercel (Requires Pro plan)
- Both on Railway (Easier setup)

### Option 3: **Traditional Hosting**
- VPS (DigitalOcean, AWS EC2, etc.)

---

## ✅ OPTION 1: SEPARATE DEPLOYMENT (BEST FOR FREE TIER)

### **Step 1: Deploy Backend (Render)**

1. **Create Render Account**
   - Go to: https://render.com
   - Sign up with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Select your repo: `back-to-campus`

3. **Configure Backend**
   ```
   Name: back2campus-api
   Region: Choose nearest
   Branch: main
   Root Directory: Backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   Instance Type: Free
   ```

4. **Add Environment Variables**
   ```
   MONGO_URI=your_mongodb_atlas_uri
   JWT_SECRET=your_random_secret_key_here
   PORT=5000
   NODE_ENV=production
   GOOGLE_GEMINI_API_KEY=your_key_here
   ```

5. **Deploy!**
   - Click "Create Web Service"
   - Wait 5-10 minutes
   - Your API URL: `https://back2campus-api.onrender.com`

---

### **Step 2: Deploy Frontend (Vercel)**

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy Frontend**
   ```bash
   cd Frontend
   vercel --prod
   ```

4. **Configure During Deploy**
   - Project name: `back-2-campus`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

5. **Add Environment Variable**
   Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   ```
   VITE_API_URL=https://back2campus-api.onrender.com/api/v1
   ```

6. **Redeploy**
   ```bash
   vercel --prod
   ```

✅ **Done! Your app is live!**

---

## ✅ OPTION 2: RAILWAY (SINGLE PLATFORM - EASIEST)

### **Deploy Both Frontend + Backend on Railway**

1. **Create Railway Account**
   - Go to: https://railway.app
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `back-to-campus` repo

3. **Add Backend Service**
   ```
   Service Name: backend
   Root Directory: Backend
   Start Command: npm start
   ```

4. **Add Frontend Service**
   ```
   Service Name: frontend
   Root Directory: Frontend
   Start Command: npm run build && npm run preview
   ```

5. **Add Environment Variables**
   
   **Backend:**
   ```
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=random_secret_key
   PORT=5000
   NODE_ENV=production
   ```
   
   **Frontend:**
   ```
   VITE_API_URL=https://your-backend-railway-url.up.railway.app/api/v1
   ```

6. **Generate Domain**
   - Click each service → Settings → Generate Domain
   - Update Frontend env with Backend URL

✅ **Done!**

---

## ✅ OPTION 3: VPS DEPLOYMENT

### **Deploy on Ubuntu Server**

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# 3. Install MongoDB
sudo apt install -y mongodb

# 4. Install PM2
sudo npm install -g pm2

# 5. Clone your repo
git clone https://github.com/YOUR_USERNAME/back-to-campus.git
cd back-to-campus

# 6. Setup Backend
cd Backend
npm install
cp .env.example .env
# Edit .env with your values
pm2 start app.js --name backend

# 7. Setup Frontend
cd ../Frontend
npm install
npm run build

# 8. Install Nginx
sudo apt install nginx -y

# 9. Configure Nginx
sudo nano /etc/nginx/sites-available/back2campus

# Add this config:
server {
    listen 80;
    server_name your-domain.com;
    
    # Frontend
    location / {
        root /path/to/back-to-campus/Frontend/dist;
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# 10. Enable site
sudo ln -s /etc/nginx/sites-available/back2campus /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx

# 11. Save PM2 config
pm2 save
pm2 startup
```

✅ **Done!**

---

## 🔧 POST-DEPLOYMENT CHECKLIST

### **1. Test Backend API**
```bash
curl https://your-backend-url.com/api/v1/auth/send-otp \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test","role":"student"}'
```

### **2. Test Frontend**
- Open: `https://your-frontend-url.com`
- Go to Login page
- Try logging in with test credentials

### **3. Check MongoDB Connection**
- Ensure MongoDB Atlas IP whitelist includes `0.0.0.0/0` for Render/Railway
- Or specific IPs for VPS

### **4. Enable CORS**
Backend should have:
```javascript
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});
```

---

## 📊 COST COMPARISON

| Platform | Backend | Frontend | Total/Month |
|----------|---------|----------|-------------|
| **Vercel + Render** | Free (sleeps) | Free | $0 |
| **Railway** | Free tier | Free tier | $0-5 |
| **VPS (DigitalOcean)** | $6 | Included | $6 |
| **AWS (t2.micro)** | Free 1yr | Free 1yr | $0-15 |

---

## 🎯 RECOMMENDED SETUP FOR SINGLE WEBSITE

### **Best Option: Railway (Single Dashboard)**

**Why Railway?**
✅ Single dashboard for both services
✅ Easy environment variable management
✅ Auto-deployments from GitHub
✅ Free tier available
✅ Built-in domains
✅ No credit card required for free tier

**Deployment Time:** ~10 minutes

---

## 🚨 TROUBLESHOOTING

### **Issue: Backend sleeps on free tier**
**Solution:** Use UptimeRobot to ping your API every 5 minutes
```
Ping URL: https://your-api.com/
Interval: 5 minutes
```

### **Issue: CORS errors**
**Solution:** Ensure backend has proper CORS headers (already added in app.js)

### **Issue: MongoDB connection fails**
**Solution:** Whitelist all IPs in MongoDB Atlas (0.0.0.0/0)

### **Issue: Frontend can't reach backend**
**Solution:** Check VITE_API_URL in frontend .env points to correct backend URL

---

## 📱 NEXT STEPS AFTER DEPLOYMENT

1. ✅ Test all features
2. ✅ Update README with live links
3. ✅ Add SSL certificates (auto on Vercel/Railway)
4. ✅ Setup custom domain (optional)
5. ✅ Monitor with UptimeRobot
6. ✅ Setup error tracking (Sentry)

---

## 🎉 QUICK START (RECOMMENDED)

```bash
# 1. Push to GitHub (already done ✅)

# 2. Deploy Backend on Render
# - Go to render.com
# - New Web Service
# - Connect repo
# - Add environment variables
# - Deploy

# 3. Deploy Frontend on Vercel
cd Frontend
vercel --prod

# 4. Update frontend env with backend URL
# Vercel Dashboard → Settings → Environment Variables
# VITE_API_URL = https://your-render-backend.onrender.com/api/v1

# 5. Redeploy frontend
vercel --prod

# DONE! 🎉
```

---

**Need help?** Create an issue on GitHub!
