const mongoose = require("mongoose");

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 604800, // Token will be automatically deleted after 7 days (matches JWT expiry)
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("BlacklistToken", blacklistTokenSchema);
