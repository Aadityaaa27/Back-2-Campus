const Session = require("../../models/Session");
const Mentor = require("../../models/mentorModel");
const Student = require("../../models/studentModel");

// Create a new session
exports.createSession = async (req, res) => {
  try {
    const { title, description, startTime, endTime, capacity } = req.body;
    const conductorId = req.user.id; // Assuming auth middleware sets req.user

    // Validate mentor existence (optional but good practice)
    const mentor = await Mentor.findById(conductorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found" });
    }

    const session = new Session({
      conductor: conductorId,
      title,
      description,
      startTime,
      endTime,
      capacity,
    });

    await session.save();

    res.status(201).json({
      message: "Session created successfully",
      session,
    });
  } catch (error) {
    console.error("Error creating session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all sessions
exports.getAllSessions = async (req, res) => {
  try {
    const sessions = await Session.find()
      .populate("conductor", "fullName title company avatar")
      .sort({ startTime: 1 }); // Sort by start time ascending

    res.status(200).json(sessions);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    const { id } = req.params;
    const session = await Session.findById(id)
      .populate("conductor", "fullName title company avatar")
      .populate("attendees", "fullName email profile_picture")
      .populate("pendingRequests", "fullName email profile_picture");

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    res.status(200).json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Request to join a session (Student)
exports.requestToJoin = async (req, res) => {
  try {
    const { id } = req.params;
    const studentId = req.user.id;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Check if already an attendee
    if (session.attendees.includes(studentId)) {
      return res.status(400).json({ message: "You are already attending this session" });
    }

    // Check if already requested
    if (session.pendingRequests.includes(studentId)) {
      return res.status(400).json({ message: "You have already requested to join" });
    }

    // Check capacity (optional logic: can allow requests even if full, but maybe warn?)
    // For strict capacity:
    if (session.attendees.length >= session.capacity) {
       return res.status(400).json({ message: "Session is full" });
    }

    session.pendingRequests.push(studentId);
    await session.save();

    res.status(200).json({ message: "Join request sent successfully" });
  } catch (error) {
    console.error("Error requesting to join:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Manage join request (Mentor)
exports.manageRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId, status } = req.body; // status: 'approve' or 'reject'
    const conductorId = req.user.id;

    const session = await Session.findById(id);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    // Verify conductor
    if (session.conductor.toString() !== conductorId) {
      return res.status(403).json({ message: "Not authorized to manage this session" });
    }

    // Check if request exists
    if (!session.pendingRequests.includes(studentId)) {
      return res.status(404).json({ message: "Request not found for this student" });
    }

    if (status === "approve") {
      // Check capacity again just in case
      if (session.attendees.length >= session.capacity) {
        return res.status(400).json({ message: "Session is full, cannot approve more students" });
      }

      // Remove from pending
      session.pendingRequests = session.pendingRequests.filter(
        (reqId) => reqId.toString() !== studentId
      );
      // Add to attendees
      session.attendees.push(studentId);
    } else if (status === "reject") {
       // Remove from pending
       session.pendingRequests = session.pendingRequests.filter(
        (reqId) => reqId.toString() !== studentId
      );
    } else {
        return res.status(400).json({ message: "Invalid status. Use 'approve' or 'reject'" });
    }

    await session.save();

    res.status(200).json({ message: `Request ${status}ed successfully` });
  } catch (error) {
    console.error("Error managing request:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
