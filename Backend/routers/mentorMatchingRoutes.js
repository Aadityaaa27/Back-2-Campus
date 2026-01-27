const express = require("express");
const {
  getMentorRecommendations,
  sendMentorshipRequest,
  getMyMentorshipRequests,
  getAllMentors,
  getMySavedMatches,
  connectWithMentor,
  getMentorProfile,
} = require("../controllers/student/mentorMatchingController");

const multer = require("multer");
const path = require("path");

// Multer setup for avatar uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "avatar-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Get AI-powered mentor recommendations (generates new matches)
router.post("/recommendations", protect, getMentorRecommendations);

// Get saved mentor matches
router.get("/my-matches", protect, getMySavedMatches);

// Connect with a mentor
router.post("/connect/:mentorId", protect, connectWithMentor);

// Send mentorship request (legacy - use connect instead)
router.post("/request", protect, sendMentorshipRequest);

// Get student's mentorship requests
router.get("/my-requests", protect, getMyMentorshipRequests);

// Get all available mentors
router.get("/all", protect, getAllMentors);

// Get mentor profile by id (public)
router.get("/:id", getMentorProfile);

module.exports = router;
