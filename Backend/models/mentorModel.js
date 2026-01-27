const mongoose = require("mongoose");

const mentorSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    passedYear: { type: Number, required: true },

    // Profile information
    title: { type: String, default: "" }, // e.g., "Senior Staff Engineer"
    company: { type: String, default: "" }, // e.g., "Google"
    yearsOfExperience: { type: Number, default: 0 },

    expertise: {
      type: [String],
      default: [],
    },

    bio: { type: String, default: "" },

    // Availability
    isAvailable: { type: Boolean, default: true },

    // Profile picture/avatar
    avatar: { type: String, default: "" }, // URL or initials

    // Extended profile fields
    location: {
      address: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zipcode: { type: String, default: "" },
    },

    experiences: [
      {
        title: { type: String, default: "" },
        company: { type: String, default: "" },
        startDate: { type: Date },
        endDate: { type: Date },
        description: { type: String, default: "" },
      },
    ],

    socialLinks: {
      website: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
    },

    role: { type: String, default: "MENTOR" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Mentor", mentorSchema);
