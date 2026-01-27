const fs = require("fs").promises;
const path = require("path");
const Mentor = require("../../models/mentorModel");

/**
 * Get mentor profile by id or current user
 * If `req.params.id` is provided return that mentor, otherwise return current user's mentor profile
 */
exports.getMyProfile = async (req, res) => {
  try {
    const mentorId = req.params.id || req.user?.id;
    if (!mentorId) {
      return res
        .status(400)
        .json({ success: false, message: "Mentor id missing" });
    }

    const mentor = await Mentor.findById(mentorId).select("-password");
    if (!mentor) {
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });
    }

    return res.status(200).json({ success: true, data: mentor });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentor profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Edit mentor profile (self)
 * Accepts multipart upload `avatar` (single file) and JSON fields
 */
exports.editMyProfile = async (req, res) => {
  try {
    const mentorId = req.user?.id;
    if (!mentorId)
      return res.status(401).json({ success: false, message: "Unauthorized" });

    const mentor = await Mentor.findById(mentorId);
    if (!mentor)
      return res
        .status(404)
        .json({ success: false, message: "Mentor not found" });

    // Allowed updatable fields
    const updatable = [
      "fullName",
      "title",
      "company",
      "yearsOfExperience",
      "expertise",
      "bio",
      "isAvailable",
      "passedYear",
    ];

    updatable.forEach((field) => {
      if (req.body[field] !== undefined) {
        // handle expertise as CSV
        if (field === "expertise" && typeof req.body[field] === "string") {
          mentor.expertise = req.body[field]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean);
        } else {
          mentor[field] = req.body[field];
        }
      }
    });

    // Location fields
    if (req.body.location) {
      try {
        const loc =
          typeof req.body.location === "string"
            ? JSON.parse(req.body.location)
            : req.body.location;
        mentor.location = { ...mentor.location, ...loc };
      } catch (e) {
        // ignore parse error
      }
    }

    // Experiences (array)
    if (req.body.experiences) {
      try {
        const exps =
          typeof req.body.experiences === "string"
            ? JSON.parse(req.body.experiences)
            : req.body.experiences;
        if (Array.isArray(exps)) mentor.experiences = exps;
      } catch (e) {
        // ignore
      }
    }

    // Social links
    if (req.body.socialLinks) {
      try {
        const links =
          typeof req.body.socialLinks === "string"
            ? JSON.parse(req.body.socialLinks)
            : req.body.socialLinks;
        mentor.socialLinks = { ...mentor.socialLinks, ...links };
      } catch (e) {}
    }

    // Avatar upload handling (multer should populate req.file)
    if (req.file) {
      // store relative path (uploads/filename)
      const relative = path
        .relative(process.cwd(), req.file.path)
        .replace(/\\/g, "/");
      mentor.avatar = relative;
    }

    await mentor.save();

    return res
      .status(200)
      .json({ success: true, message: "Profile updated", data: mentor });
  } catch (error) {
    console.error("Error updating mentor profile:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Admin or public helper to get brief mentor list (delegated to existing controllers)
 * This file focuses on profile operations.
 */
