const mongoose = require("mongoose");

const studentConnectionRequestSchema = new mongoose.Schema(
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
studentConnectionRequestSchema.index({ student: 1, mentor: 1 }, { unique: true });

module.exports = mongoose.model("StudentConnectionRequest", studentConnectionRequestSchema);
