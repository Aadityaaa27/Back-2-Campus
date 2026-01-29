# Campus Meetup - OTP Login System

## Features Implemented ✅

- **OTP-based Authentication**: Secure login using email OTP
- **Nodemailer Integration**: Automated email delivery
- **JWT Token Generation**: Secure token-based authentication after successful login
- **User Management**: Auto-create/update users
- **OTP Expiry**: 10-minute expiration for security

## Project Structure

```
Backend/
├── app.js                          # Main application file
├── package.json                    # Dependencies
├── .env                           # Environment variables
├── config/
│   └── database.js                # MongoDB connection
├── models/
│   └── User.js                    # User model with OTP fields
├── controllers/
│   └── authController.js          # Auth logic (sendOTP, verifyOTP)
├── routers/
│   └── authRoutes.js              # API routes
└── utils/
    ├── otpGenerator.js            # OTP generation utility
    ├── emailService.js            # Nodemailer email service
    └── authMiddleware.js          # JWT verification middleware
```

## API Endpoints

### 1. Send OTP

**POST** `/api/auth/send-otp`

**Request Body:**

```json
{
  "email": "user@example.com",
  "name": "John Doe"
}
```

**Response:**

```json
{
  "success": true,
  "message": "OTP sent successfully to your email",
  "email": "user@example.com"
}
```

### 2. Verify OTP & Login

**POST** `/api/auth/verify-otp`

**Request Body:**

```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response:**

```json
{
  "success": true,
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "isVerified": true
  }
}
```

### 3. Get Profile (Protected)

**GET** `/api/auth/profile`

**Headers:**

```
Authorization: Bearer <your-jwt-token>
```

**Response:**

```json
{
  "success": true,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "email": "user@example.com",
    "name": "John Doe",
    "isVerified": true,
    "createdAt": "2026-01-03T00:00:00.000Z"
  }
}
```

## Environment Variables (.env)

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/campus-meetup
JWT_SECRET=your_jwt_secret_key_change_this_in_production_12345
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=himanshugarg3731@gmail.com
EMAIL_PASS=saqxwujyteitnncb
OTP_EXPIRY_MINUTES=10
```

## Setup Instructions

### 1. Install MongoDB

Make sure MongoDB is installed and running on your system.

**Windows:**

- Download from https://www.mongodb.com/try/download/community
- Start MongoDB service: `net start MongoDB`

**Or use MongoDB Atlas (Cloud):**

- Update MONGODB_URI in .env with your Atlas connection string

### 2. Install Dependencies

Already done! Dependencies installed:

- nodemailer
- mongoose
- express
- jsonwebtoken
- dotenv
- bcrypt

### 3. Start the Server

```bash
npm start
# or for development with auto-reload
npm run dev
```

## Testing the API

### Using cURL:

**1. Send OTP:**

```bash
curl -X POST http://localhost:5000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"name\":\"Test User\"}"
```

**2. Verify OTP:**

```bash
curl -X POST http://localhost:5000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"test@example.com\",\"otp\":\"123456\"}"
```

**3. Get Profile (use token from step 2):**

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Thunder Client:

1. **Send OTP**

   - Method: POST
   - URL: `http://localhost:5000/api/auth/send-otp`
   - Body (JSON):
     ```json
     {
       "email": "your-email@gmail.com",
       "name": "Your Name"
     }
     ```

2. **Check your email** for the OTP code

3. **Verify OTP**

   - Method: POST
   - URL: `http://localhost:5000/api/auth/verify-otp`
   - Body (JSON):
     ```json
     {
       "email": "your-email@gmail.com",
       "otp": "YOUR_OTP_CODE"
     }
     ```

4. **Copy the token** from the response

5. **Get Profile**
   - Method: GET
   - URL: `http://localhost:5000/api/auth/profile`
   - Headers: `Authorization: Bearer YOUR_TOKEN`

## Security Features

- ✅ OTP expires after 10 minutes
- ✅ OTP cleared after successful verification
- ✅ JWT token with 7-day expiration
- ✅ Email validation
- ✅ Protected routes with JWT middleware
- ✅ Secure password handling ready (bcrypt installed)

## Next Steps

1. **Start MongoDB** if not running
2. **Test the API** using the endpoints above
3. **Customize** email templates in `utils/emailService.js`
4. **Add more routes** as needed for your application

## Troubleshooting

**MongoDB Connection Error:**

- Ensure MongoDB is running: `mongod` or `net start MongoDB`
- Check MONGODB_URI in .env file

**Email Not Sending:**

- Verify EMAIL_USER and EMAIL_PASS in .env
- For Gmail, you need an "App Password" (not your regular password)
- Enable 2-factor authentication and create app password at: https://myaccount.google.com/apppasswords

**Port Already in Use:**

- Change PORT in .env to a different number (e.g., 3000, 8000)
