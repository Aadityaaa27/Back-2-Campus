const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    current_year: { type: String, required: true },
    college_name: { type: String, required: true },
    subject_to_discuss: {
      type: [String],
      default: [],
    },
    role: { type: String, default: "STUDENT" },
    bio: { type: String },
    profile_picture: { type: String },
    social_links: {
      linkedin: { type: String },
      github: { type: String },
      portfolio: { type: String },
    },
    skills: { type: [String], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
