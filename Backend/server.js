console.log("🚀 Starting comprehensive backend test and setup...\n");

require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

console.log("✅ Middleware configured");

// Import routes
const authRoutes = require("./routers/authRoutes");
const MentorRoutes = require("./routers/mentorRoutes");
const studentRoutes = require("./routers/studentRoutes");
const studentConnectionRoutes = require("./routers/studentConnectionRoutes");
const sessionRoutes = require("./routers/sessionRoutes");

console.log("✅ Routes imported");

// Mount routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/alumini-mentor", MentorRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/mentor/connections", studentConnectionRoutes);
app.use("/api/v1/sessions", sessionRoutes);

console.log("✅ Routes mounted");

// Root route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Back-2-Campus API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/v1/auth/*",
      mentors: "/api/v1/alumini-mentor/*",
      students: "/api/v1/students/*",
      sessions: "/api/v1/sessions/*"
    }
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path
  });
});

// Connect to MongoDB and start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log("\n🎉 ========================================");
      console.log(`✅ Server running on port ${PORT}`);
      console.log(`✅ API: http://localhost:${PORT}`);
      console.log(`✅ MongoDB connected`);
      console.log("🎉 ========================================\n");
      
      console.log("📝 Available routes:");
      console.log("   POST /api/v1/auth/send-otp");
      console.log("   POST /api/v1/auth/verify-otp");
      console.log("   POST /api/v1/auth/signup-student");
      console.log("   POST /api/v1/auth/signup-mentor");
      console.log("   POST /api/v1/auth/login-student");
      console.log("   POST /api/v1/auth/login-mentor");
      console.log("   GET  /api/v1/auth/profile");
      console.log("   POST /api/v1/auth/logout\n");
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });

module.exports = app;
