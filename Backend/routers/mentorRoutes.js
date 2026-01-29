const express = require("express");
const {
  getMyProfile,
  editMyProfile,
} = require("../controllers/mentor/mentorProfileController");
const {
  getMentorRecommendations,
  sendMentorshipRequest,
  getMyMentorshipRequests,
  getAllMentors,
  getMySavedMatches,
  connectWithMentor,
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
  limits: { fileSize: 10 * 1024 * 1024 },
});
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Get or edit current mentor profile
router.get("/profile/me", protect, getMyProfile);
router.patch("/profile/me", protect, upload.single("avatar"), editMyProfile);

module.exports = router;
