const express = require("express");
const router = express.Router();
const {
  getAllConnectionRequests,
  getConnectionRequestById,
  acceptConnectionRequest,
  rejectConnectionRequest,
} = require("../controllers/mentor/studentconnectionController");
const protect = require("../middlewares/authMiddleware");

// All routes are protected - only authenticated mentors can access
router.get("/connection-requests", protect, getAllConnectionRequests);
router.get("/connection-requests/:id", protect, getConnectionRequestById);
router.put("/connection-requests/:id/accept", protect, acceptConnectionRequest);
router.put("/connection-requests/:id/reject", protect, rejectConnectionRequest);

module.exports = router;
