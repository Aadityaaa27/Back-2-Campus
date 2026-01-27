const express = require("express");
const router = express.Router();
const sessionController = require("../controllers/mentor/sessionController");
const authMiddleware = require("../middlewares/authMiddleware"); // Assuming this is the name, will verify.

// Public or Auth routes (depending on requirements, listing might be public)
router.get("/all", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);

// Mentor routes
router.post(
  "/create",
  authMiddleware.verifyToken,
  authMiddleware.isMentor,
  sessionController.createSession
);

router.post(
  "/:id/manage",
  authMiddleware.verifyToken,
  authMiddleware.isMentor,
  sessionController.manageRequest
);

// Student routes
router.post(
  "/:id/join",
  authMiddleware.verifyToken,
  authMiddleware.isStudent, // Assuming we want to restrict to students
  sessionController.requestToJoin
);

module.exports = router;
