# Vercel Deployment Guide

## ✅ Frontend-Backend Connection Complete

Your frontend is now configured to connect to your Render backend.

### Configuration Details

- **Backend URL:** `https://student-alumini-webapp.onrender.com`
- **API Base URL:** `https://student-alumini-webapp.onrender.com/api/v1`

### Environment Variables in Vercel

Make sure to set the following environment variable in your Vercel project settings:

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add the following variable:

```
VITE_API_URL=https://student-alumini-webapp.onrender.com/api/v1
```

4. Redeploy your project for changes to take effect

### Quick Deploy Steps

1. **Commit and Push Changes:**
   ```bash
   git add .
   git commit -m "Connect frontend to Render backend"
   git push origin main
   ```

2. **Vercel Auto-Deploy:**
   - Vercel will automatically detect the push and start a new deployment
   - Wait for deployment to complete

3. **Verify Deployment:**
   - Visit your Vercel URL
   - Open browser console (F12)
   - Check that API calls are going to `https://student-alumini-webapp.onrender.com/api/v1`

### Testing the Connection

1. Open your Vercel frontend URL
2. Try to login/register
3. Check browser Network tab - all API requests should go to Render backend
4. Verify responses are coming back successfully

### CORS Settings

✅ Backend is already configured to accept requests from any origin (CORS: `*`)
No additional backend changes needed for now.

### Troubleshooting

**If API calls fail:**

1. Check browser console for errors
2. Verify the environment variable in Vercel is set correctly
3. Ensure backend is running on Render (check Render dashboard)
4. Check Network tab to see actual URL being called

**Common Issues:**

- **401 Unauthorized:** Token expired or invalid - clear localStorage and login again
- **Network Error:** Backend might be sleeping (Render free tier) - wait 30 seconds and retry
- **CORS Error:** Backend CORS is already set to `*`, should not occur

### Single Link Deployment

✅ **Your final deployment:**
- Share only your Vercel frontend URL
- Frontend automatically connects to Render backend
- Users only need one link!

### Next Steps (Optional - Production Hardening)

For production, consider:
1. Setting specific CORS origin in backend (instead of `*`)
2. Adding rate limiting
3. Setting up custom domain
4. Enabling HTTPS everywhere

---

**Status:** ✅ Ready to Deploy!
