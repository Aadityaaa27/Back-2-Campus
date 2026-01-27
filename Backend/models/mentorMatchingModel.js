const mongoose = require("mongoose");

const mentorMatchingSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    careerGoal: {
      type: String,
      required: true,
    },
    // Matched mentors with their scores
    matchedMentors: [
      {
        mentor: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Mentor",
        },
        matchPercentage: {
          type: Number,
          min: 0,
          max: 100,
        },
        matchReason: String,
        topSkills: [String],
        keyStrengths: [String],
        status: {
          type: String,
          enum: ["recommended", "contacted", "connected", "declined"],
          default: "recommended",
        },
        contactedAt: Date,
      },
    ],
    // Student preferences used for matching
    studentPreferences: {
      skills: [String],
      interests: [String],
      experienceLevel: {
        type: String,
        enum: ["beginner", "intermediate", "advanced"],
      },
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
mentorMatchingSchema.index({ student: 1 });

module.exports = mongoose.model("MentorMatching", mentorMatchingSchema);
