# 🎯 BACKEND TESTING COMPLETE GUIDE

## ✅ FIXES APPLIED:

### 1. **getProfile Controller Fixed**
- **Issue:** Was using `User` model but students are in `Student` model
- **Fix:** Now checks user role and queries correct model
- **Location:** `controllers/authController.js` line 442

### 2. **User Model Updated**
- **Issue:** Role enum didn't have "mentor"
- **Fix:** Added "mentor" to allowed roles
- **Location:** `models/User.js`

### 3. **Utility Functions Created**
- **OTP Generator:** `utils/otpGenerator.js`
- **Email Service:** `utils/emailService.js` (mock for now)

---

## 🔑 TEST CREDENTIALS:

```
Email: test2026@example.com
Password: Test@12345
```

---

## 📋 COMPLETE TESTING STEPS (POSTMAN):

### **Step 1: Server Start**
```bash
# In CMD window (NOT VS Code terminal)
cd C:\Users\lenovo\Documents\Backend(back-to-campus\Backend
node server.js
```

**Expected Output:**
```
✅ Server running on port 5000
✅ MongoDB connected
📝 Available routes listed
```

---

### **Step 2: Test Login**

**Postman Request:**
```
POST http://localhost:5000/api/v1/auth/login-student

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "email": "test2026@example.com",
  "password": "Test@12345"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "user logged in successfully",
  "token": "eyJhbGci...",
  "role": "student"
}
```

**✅ COPY THE TOKEN!**

---

### **Step 3: Test Profile (Protected)**

**Postman Request:**
```
GET http://localhost:5000/api/v1/auth/profile

Authorization Tab:
Type: Bearer Token
Token: <PASTE_TOKEN_HERE>
```

**Expected Response (200 OK):**
```json
{
  "_id": "...",
  "fullName": "Test User 2026",
  "email": "test2026@example.com",
  "current_year": "Final Year",
  "college_name": "Test College",
  "subject_to_discuss": "MERN Stack",
  "role": "student",
  "createdAt": "2026-01-27T...",
  "updatedAt": "2026-01-27T..."
}
```

---

### **Step 4: Test Logout**

**Postman Request:**
```
POST http://localhost:5000/api/v1/auth/logout

Authorization Tab:
Type: Bearer Token
Token: <SAME_TOKEN>
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

### **Step 5: Test Send OTP**

**Postman Request:**
```
POST http://localhost:5000/api/v1/auth/send-otp

Headers:
Content-Type: application/json

Body (raw JSON):
{
  "email": "test2026@example.com",
  "name": "Test User",
  "role": "student"
}
```

**Expected Response (200 OK):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "email": "test2026@example.com",
  "role": "student"
}
```

**Check CMD window:** You'll see OTP in server logs.

---

## 🚀 AUTOMATED TEST (After Server Restart):

```bash
node test-backend.js
```

**Should show:**
```
✅ Root endpoint working
✅ Login successful
✅ Profile API working
✅ Logout successful
✅ Token blacklist working
✅ OTP working

🎉 ALL TESTS PASSED!
```

---

## ⚠️ IMPORTANT NOTES:

1. **Server Must Be Restarted** after code changes
2. **Token Format:** `Bearer <space> token` (no quotes)
3. **Token Expires:** After 7 days or after logout
4. **Password:** Encrypted, can't be decrypted

---

## 🐛 TROUBLESHOOTING:

### **401 Unauthorized**
- Token expired → Login again
- Token format wrong → Check "Bearer " (with space)
- Token from different server → Use correct server token

### **404 User Not Found**
- Server not restarted → Restart with `node server.js`
- Wrong model → Fixed in getProfile controller
- User doesn't exist → Use test credentials above

### **500 Internal Error**
- MongoDB not connected → Check .env file
- Missing dependencies → Run `npm install`
- Code error → Check server logs in CMD window

---

## 📸 NEXT STEPS:

1. ✅ **Test all endpoints** in Postman
2. ✅ **Export Postman collection** for backup
3. ✅ **Add frontend** folder
4. ✅ **Connect frontend** to backend
5. ✅ **Upload to GitHub**
6. ✅ **Deploy** (optional)

---

## 🎓 WHAT YOU LEARNED:

- ✅ Backend API development
- ✅ JWT authentication
- ✅ Protected routes
- ✅ Token management
- ✅ MongoDB integration
- ✅ Postman testing
- ✅ Error handling
- ✅ Password hashing
- ✅ Role-based access

---

**Backend is READY! Ab frontend add karo!** 🚀
