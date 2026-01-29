const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    otp: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["student", "alumni", "mentor"],
      default: "student",
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Method to check if OTP is valid
userSchema.methods.isOTPValid = function (otp) {
  if (!this.otp || !this.otpExpiry) {
    return false;
  }

  // Check if OTP matches and hasn't expired
  const isMatch = this.otp === otp;
  const isNotExpired = new Date() < this.otpExpiry;

  return isMatch && isNotExpired;
};

module.exports = mongoose.model("User", userSchema);
