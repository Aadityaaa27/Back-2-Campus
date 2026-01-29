# Back-2-Campus 🎓

Full-stack student-alumni networking platform connecting students with mentors for career guidance and skill development.

## 🚀 Live Demo

- **Frontend**: [Deployed on Vercel](https://back-2-campus.vercel.app)
- **Backend API**: Deployed on Render/Railway

## 📁 Project Structure

```
back-to-campus/
├── Backend/          # Node.js + Express API
├── Frontend/         # React + Vite + TypeScript
└── README.md
```

## ✨ Features

- 🔐 **Authentication**: Secure JWT-based login/signup for students and mentors
- 👥 **Mentor Matching**: AI-powered mentor recommendations
- 📊 **Skill Scanner**: Upload resume and get skill analysis
- 🎯 **Career Roadmap**: Personalized career path guidance
- 💬 **Real-time Chat**: Connect with mentors instantly
- 📚 **Webinars**: Access to expert sessions
- 🎨 **Modern UI**: Built with Tailwind CSS and Shadcn/ui

## 🛠️ Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn/ui
- Framer Motion
- React Router
- Axios

### Backend
- Node.js
- Express.js
- MongoDB
- JWT Authentication
- Bcrypt
- Google Gemini AI
- Swagger/OpenAPI

## 🏃 Running Locally

### Prerequisites
- Node.js (v18+)
- MongoDB
- Git

### Backend Setup

```bash
cd Backend
npm install
cp .env.example .env  # Add your MongoDB URI and secrets
npm run dev           # Runs on http://localhost:5000
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev          # Runs on http://localhost:8080
```

### Environment Variables

**Backend (.env):**
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:5000/api/v1
```

## 📚 API Documentation

Access Swagger docs at: `http://localhost:5000/docs`

### Key Endpoints

- `POST /api/v1/auth/signup-student` - Student registration
- `POST /api/v1/auth/login-student` - Student login
- `GET /api/v1/auth/profile` - Get user profile (protected)
- `POST /api/v1/auth/logout` - Logout user
- `POST /api/v1/auth/send-otp` - Send OTP for verification

## 🚀 Deployment

### Frontend (Vercel)
```bash
cd Frontend
vercel --prod
```

### Backend (Render/Railway)
- Push to GitHub
- Connect repository to Render/Railway
- Add environment variables
- Deploy

## 🧪 Testing

```bash
# Backend
cd Backend
npm test

# Test all endpoints
node test-backend.js
```

## 👥 Test Credentials

```
Email: test2026@example.com
Password: Test@12345
Role: Student
```

## 📝 License

MIT License

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.

## 📧 Contact

For questions or support, reach out via GitHub issues.

---

Made with ❤️ by Back-2-Campus Team
