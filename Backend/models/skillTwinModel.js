const mongoose = require("mongoose");

/* ---------- SUB SCHEMAS ---------- */

// Individual skill
const SkillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "other" },
    confidence: { type: Number, min: 0, max: 1 },
    tier: {
      type: String,
      enum: ["high", "medium", "low"],
    },
  },
  { _id: false },
);

// Career readiness info
const CareerReadinessSchema = new mongoose.Schema(
  {
    targetRole: String,
    percentage: Number,
    status: String,
    timeline: String,
  },
  { _id: false },
);

// Growth projection
const GrowthPeriodSchema = new mongoose.Schema(
  {
    percentage: { type: Number, required: true },
    skills: [{ type: String }],
  },
  { _id: false },
);

// Growth projection schema
const GrowthProjectionSchema = new mongoose.Schema(
  {
    thirtyDays: [GrowthPeriodSchema],
    sixtyDays: [GrowthPeriodSchema],
    ninetyDays: [GrowthPeriodSchema],
  },
  { _id: false },
);

/* ---------- MAIN SCHEMA ---------- */

const SkillTwinSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // must provide userId
    },

    proofSource: {
      type: String,
      enum: ["text", "file", "github", "image"],
      required: true,
    },

    proofSummary: {
      type: String, // small extracted text summary
    },

    skills: [SkillSchema],

    careerReadiness: CareerReadinessSchema,

    growthProjection: GrowthProjectionSchema,

    aiInsight: {
      enabled: { type: Boolean, default: false },
      summary: String,
    },

    version: {
      type: Number,
      default: 1, // future SkillTwin evolution
    },
  },
  {
    timestamps: true,
  },
);

// Index for faster queries
SkillTwinSchema.index({ userId: 1 });

module.exports = mongoose.model("SkillTwin", SkillTwinSchema);
