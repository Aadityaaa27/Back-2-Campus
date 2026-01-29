const express = require("express");
const {
  assessWellbeingFallback,
  getWellnessSuggestions,
  getMentalHealthResources,
  trackWellbeingProgress,
  wellbeingChatSupport,
} = require("../controllers/student/wellbeingController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Assess student wellbeing and burnout risk
router.post("/assess", protect, assessWellbeingFallback);

// Get personalized wellness suggestions
router.post("/suggestions", protect, getWellnessSuggestions);

// Get mental health resources
router.get("/resources", protect, getMentalHealthResources);

// Track wellbeing progress
router.post("/track", protect, trackWellbeingProgress);

// AI chat support for wellness
router.post("/chat", protect, wellbeingChatSupport);

module.exports = router;
