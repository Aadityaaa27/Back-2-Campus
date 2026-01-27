const express = require("express");
const router = express.Router();
const {
  sendOTP,
  verifyOTP,
  getProfile,
  register,
  login,
  studentLogin,
  studentSignup,
  mentorLogin,
  mentorSignup,
  logout,
} = require("../controllers/authController");
const protect = require("../middlewares/authMiddleware");

// Public routes

// Student login
router.post("/login-student", studentLogin);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);
router.post("/signup-student", studentSignup);
router.post("/signup-mentor", mentorSignup);
router.post("/login-mentor", mentorLogin);
// Mentor signup
// router.post("/signup/mentor", register);

// Protected routes
router.get("/profile", protect, getProfile);
router.post("/logout", protect, logout);

module.exports = router;
