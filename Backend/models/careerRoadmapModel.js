const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  completedAt: {
    type: Date,
  },
});

const WeekSchema = new mongoose.Schema({
  weekNumber: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  icon: {
    type: String,
    default: "📝",
  },
  tasks: [TaskSchema],
});

const LearningGoalSchema = new mongoose.Schema({
  skill: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100,
  },
  targetProgress: {
    type: Number,
    default: 100,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

const CareerRoadmapSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  title: {
    type: String,
    default: "Career Roadmap",
  },
  subtitle: {
    type: String,
    default: "Your personalized path to success",
  },
  careerGoal: {
    type: String,
    required: true,
  },
  overallProgress: {
    percentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      type: String,
      default: "Go back to reach your goals",
    },
  },
  weeklyPlan: {
    duration: {
      type: String,
      default: "12-Week Plan",
    },
    weeks: [WeekSchema],
  },
  learningGoals: [LearningGoalSchema],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update the updatedAt field before saving
CareerRoadmapSchema.pre("save", async function () {
  this.updatedAt = Date.now();

  // Calculate overall progress based on completed tasks
  let totalTasks = 0;
  let completedTasks = 0;

  if (!this.weeklyPlan || !this.weeklyPlan.weeks) {
    return;
  }

  this.weeklyPlan.weeks.forEach((week) => {
    totalTasks += week.tasks.length;
    completedTasks += week.tasks.filter((task) => task.completed).length;

    // Update week progress based on completed tasks
    const weekCompleted = week.tasks.filter((task) => task.completed).length;
    week.progress =
      week.tasks.length > 0
        ? Math.round((weekCompleted / week.tasks.length) * 100)
        : 0;
  });

  // Update overall progress
  if (totalTasks > 0) {
    this.overallProgress.percentage = Math.round(
      (completedTasks / totalTasks) * 100,
    );
  }
});

// Index for faster queries
CareerRoadmapSchema.index({ student: 1 });
CareerRoadmapSchema.index({ createdAt: -1 });

module.exports = mongoose.model("CareerRoadmap", CareerRoadmapSchema);
