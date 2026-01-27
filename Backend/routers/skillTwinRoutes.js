const express = require("express");
const router = express.Router();
const multer = require("multer");
const protect = require("../middlewares/authMiddleware");

const { buildSkillTwin } = require("../controllers/student/skillTwinController");

/* ---------- FILE UPLOAD ---------- */

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
});

/**
 * POST /api/v1/skilltwin
 * Build & store SkillTwin from proof
 */
router.post(
  "/",
  upload.any(),
  protect, // supports text, image, pdf later
  buildSkillTwin,
);

module.exports = router;
