const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  evaluateSkillFromImage,
  testSkillEvaluation,
} = require("../controllers/student/skillEvaluationController");

const protect = require("../middlewares/authMiddleware");

const router = express.Router();

// --- Multer configuration ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "code-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, JPG, PNG, and WEBP images are allowed.",
      ),
      false,
    );
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 30MB
});

// --- Routes ---

// Test route
router.get("/test", testSkillEvaluation);

// Evaluate skill from uploaded code image
// Accepts: skill (optional), level (optional), and a single file
router.post(
  "/evaluate",
  protect,
  // Single file upload: expects 'codeImage', fallback to 'image'
  (req, res, next) => {
    const uploader = upload.single("codeImage");
    uploader(req, res, (err) => {
      if (!err) return next();

      // If unexpected field, try the alternative 'image'
      if (
        err instanceof multer.MulterError &&
        err.code === "LIMIT_UNEXPECTED_FILE"
      ) {
        const altUploader = upload.single("image");
        return altUploader(req, res, next);
      }

      // For other errors, pass to error handler
      return next(err);
    });
  },
  evaluateSkillFromImage,
);

module.exports = router;
