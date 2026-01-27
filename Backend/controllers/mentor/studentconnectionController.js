const StudentConnectionRequest = require("../../models/studentConnectionRequestModel");
const Student = require("../../models/studentModel");
const Mentor = require("../../models/mentorModel");

/**
 * Get all connection requests for the logged-in mentor
 * Optional query param: ?status=PENDING|ACCEPTED|REJECTED
 */
exports.getAllConnectionRequests = async (req, res) => {
  try {
    const mentorId = req.user?.id;
    if (!mentorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Verify mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ success: false, message: "Mentor not found" });
    }

    // Build query filter
    const filter = { mentor: mentorId };
    if (req.query.status) {
      const validStatuses = ["PENDING", "ACCEPTED", "REJECTED"];
      if (validStatuses.includes(req.query.status.toUpperCase())) {
        filter.status = req.query.status.toUpperCase();
      }
    }

    // Fetch connection requests with student details populated
    const requests = await StudentConnectionRequest.find(filter)
      .populate("student", "-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: requests.length,
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch connection requests",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get a specific connection request by ID
 */
exports.getConnectionRequestById = async (req, res) => {
  try {
    const mentorId = req.user?.id;
    const requestId = req.params.id;

    if (!mentorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const request = await StudentConnectionRequest.findOne({
      _id: requestId,
      mentor: mentorId,
    }).populate("student", "-password");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    console.error("Error fetching connection request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch connection request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Accept a connection request
 */
exports.acceptConnectionRequest = async (req, res) => {
  try {
    const mentorId = req.user?.id;
    const requestId = req.params.id;

    if (!mentorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the request
    const request = await StudentConnectionRequest.findOne({
      _id: requestId,
      mentor: mentorId,
    }).populate("student", "-password");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    // Check if already processed
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status.toLowerCase()}`,
      });
    }

    // Update status
    request.status = "ACCEPTED";
    request.respondedAt = new Date();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Connection request accepted successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error accepting connection request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to accept connection request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Reject a connection request
 */
exports.rejectConnectionRequest = async (req, res) => {
  try {
    const mentorId = req.user?.id;
    const requestId = req.params.id;

    if (!mentorId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Find the request
    const request = await StudentConnectionRequest.findOne({
      _id: requestId,
      mentor: mentorId,
    }).populate("student", "-password");

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found",
      });
    }

    // Check if already processed
    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: `Request already ${request.status.toLowerCase()}`,
      });
    }

    // Update status
    request.status = "REJECTED";
    request.respondedAt = new Date();
    await request.save();

    return res.status(200).json({
      success: true,
      message: "Connection request rejected successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error rejecting connection request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to reject connection request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
