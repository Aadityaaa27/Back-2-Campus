const express = require("express");
const {
  getWebinarRecommendations,
  translateWebinarContent,
  getTrendingTopics,
  getPersonalizedSchedule,
} = require("../controllers/student/webinarsController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Get AI-curated webinar recommendations
router.post("/recommendations", protect, getWebinarRecommendations);

// Translate webinar content to preferred language
router.post("/translate", protect, translateWebinarContent);

// Get trending webinar topics
router.get("/trending", protect, getTrendingTopics);

// Get personalized webinar schedule
router.post("/schedule", protect, getPersonalizedSchedule);

module.exports = router;
