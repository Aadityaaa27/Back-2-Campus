const mongoose = require("mongoose");
const student = require("./studentModel");
const mentor = require("./mentorModel");

const mentorshipRequestSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    mentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Mentor",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "ACCEPTED", "REJECTED"],
      default: "PENDING",
    },

    message: {
      type: String,
    },

    respondedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

/* Prevent duplicate requests */
mentorshipRequestSchema.index({ student: 1, mentor: 1 }, { unique: true });

module.exports = mongoose.model("MentorshipRequest", mentorshipRequestSchema);
