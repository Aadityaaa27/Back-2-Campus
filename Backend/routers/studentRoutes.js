const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  editMyProfile,
} = require("../controllers/student/studentController");
const protect = require("../middlewares/authMiddleware");

// Import all student-related route modules
const careerRoadmapRoutes = require("./careerRoadmapRoutes");
const mentorMatchingRoutes = require("./mentorMatchingRoutes");
const skillEvaluationRoutes = require("./skillEvaluationRoutes");
const skillScannerRoutes = require("./skillScannerRoutes");
const skillTwinRoutes = require("./skillTwinRoutes");
const webinarsRoutes = require("./webinarsRoutes");
const wellbeingRoutes = require("./wellbeingRoutes");

// Student profile routes
router.get("/my-profile", protect, getMyProfile);
router.put("/my-profile", protect, editMyProfile);

// Mount sub-routers for different student features
router.use("/career", careerRoadmapRoutes);
router.use("/mentors", mentorMatchingRoutes);
router.use("/skills", skillEvaluationRoutes);
router.use("/skillscanner", skillScannerRoutes);
router.use("/skilltwin", skillTwinRoutes);
router.use("/webinars", webinarsRoutes);
router.use("/wellbeing", wellbeingRoutes);

module.exports = router;
