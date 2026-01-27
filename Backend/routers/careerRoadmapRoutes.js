const express = require("express");
const {
  getCareerRoadmap,
  getLearningRecommendations,
  getCareerProgress,
  getMyCareerRoadmap,
  updateTaskStatus,
} = require("../controllers/student/careerRoadmapController");
const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// Get personalized career roadmap (AI-generated)
router.post("/get-roadmap", protect, getCareerRoadmap);

// Get saved career roadmap matching frontend design
router.get("/my-roadmap", protect, getMyCareerRoadmap);

// Update task completion status
router.patch("/task/:weekNumber/:taskIndex", protect, updateTaskStatus);

// Get learning recommendations
router.post("/recommendations", protect, getLearningRecommendations);

// Get career progress
router.get("/progress/:userId", protect, getCareerProgress);

module.exports = router;
