// const axios = require("axios");
// const CareerRoadmap = require("../../models/careerRoadmapModel");

const genAI = require("../../config/googlGemini.js");
const CareerRoadmap = require("../../models/careerRoadmapModel.js");

// Helper function to clean and fix common JSON issues
const cleanJSON = (text) => {
  // Remove markdown code blocks
  let cleaned = text.replace(/```json|```/g, "").trim();

  // Remove any leading/trailing non-JSON text
  const jsonStart = cleaned.indexOf("{");
  const jsonEnd = cleaned.lastIndexOf("}");
  if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
    cleaned = cleaned.substring(jsonStart, jsonEnd + 1);
  }

  // Remove trailing commas before closing brackets
  cleaned = cleaned.replace(/,(\s*[}\]])/g, "$1");

  return cleaned;
};

const getCareerRoadmap = async (req, res) => {
  try {
    const {
      whatToMaster,
      careerGoal,
      experience,
      timeline = "12 weeks",
    } = req.body;

    if (!whatToMaster || !careerGoal) {
      return res.status(400).json({
        success: false,
        message: "Please provide what you want to master and career goal",
      });
    }

    // 🔥 STRONG, SCHEMA-LOCKED PROMPT
    const prompt = `
You are a ${whatToMaster} mentor.

Generate a ${timeline} career roadmap to crack  ${careerGoal} goal with experience of ${experience}  in STRICT JSON.
Return ONLY valid JSON. No markdown. No explanations.

The JSON MUST strictly follow this structure:

{
  "title": "Career Roadmap",
  "subtitle": "Your personalized path to success",
  "weeklyPlan": {
    "duration": "${timeline}",
    "weeks": [
      {
        "weekNumber": 1,
        "title": "Week title",
        "icon": "🧱",
        "whatYouWillAchieve": "Clear outcome statement",
        "progressCompleted": "6%",
        "confidenceBoost": "Motivational confidence gain",

        "tasks": [
          { "name": "Task description", "completed": false }
        ],

        "resources": {
          "courses": [
            {
              "name": "Course name",
              "platform": "Udemy / Coursera / etc",
              "link": "https://example.com",
              "type": "Free / Paid / Free preview"
            }
          ],
          "documentation": [
            { "name": "Doc name", "link": "https://example.com" }
          ],
          "articles": [
            {
              "title": "Article title",
              "platform": "Medium / Blog",
              "link": "https://example.com"
            }
          ],
          "videos": [
            {
              "title": "Video title",
              "platform": "YouTube",
              "link": "https://example.com"
            }
          ]
        },

        "practiceAndTesting": {
          "handsOnPractice": [
            {
              "platform": "HackerRank / Exercism",
              "focus": "Practice focus",
              "link": "https://example.com",
              "free": true
            }
          ],
          "mockTests": [
            {
              "platform": "TestDome / SkillValue",
              "focus": "Assessment focus",
              "link": "https://example.com",
              "free": "Limited"
            }
          ],
          "projectBasedPractice": [
            {
              "platform": "GitHub / Codecrafters",
              "focus": "Real-world backend project",
              "link": "https://example.com",
              "free": true
            }
          ]
        },

        "weeklySelfCheck": {
          "reflectionQuestions": [
            "Question 1?",
            "Question 2?"
          ],
          "expectedOutcome": "Concrete measurable outcome"
        }
      }
    ]
  }
}

IMPORTANT RULES:
- Generate ALL weeks (no empty arrays)
- Progress percentages must gradually increase
- Tasks must be backend-focused and realistic
- Links must look real (no placeholders like example.com)
- Icons must vary
- Difficulty should match the profile below

STUDENT PROFILE:
- What to master: ${whatToMaster}
- Career goal: ${careerGoal}
- Experience level: ${experience || "Beginner"}
- Timeline: ${timeline}
`;

    // 🔹 Gemini 3 call
    const response = await genAI.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ role: "user", text: prompt }],
      generationConfig: {
        responseMimeType: "application/json", // ✅ THIS FIXES EVERYTHING
        temperature: 0.4,
      },
    });

    // 🔹 Safe extraction
    const text =
      response.output_text ||
      response.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.log("Full Gemini response:", JSON.stringify(response, null, 2));
      throw new Error("No text returned from Gemini AI");
    }

    const cleanText = cleanJSON(text);

    let parsed;
    try {
      parsed = JSON.parse(cleanText);
      // =======================
      // 🔒 NORMALIZE WEEKS
      // =======================

      const rawWeeks = parsed?.weeklyPlan?.weeks;

      if (!Array.isArray(rawWeeks) || rawWeeks.length === 0) {
        throw new Error("Gemini returned empty or invalid weeks array");
      }

      const normalizedWeeks = rawWeeks.map((week, index) => ({
        weekNumber: week.weekNumber ?? index + 1,
        title: week.title ?? `Week ${index + 1}`,
        icon: week.icon ?? "📘",

        whatYouWillAchieve: week.whatYouWillAchieve ?? "",
        progressCompleted:
          week.progressCompleted ?? `${Math.min((index + 1) * 6, 100)}%`,
        confidenceBoost: week.confidenceBoost ?? "",

        tasks: Array.isArray(week.tasks)
          ? week.tasks.map((task) => ({
              name: task.name ?? "",
              completed: Boolean(task.completed),
            }))
          : [],

        resources: {
          courses: week.resources?.courses ?? [],
          documentation: week.resources?.documentation ?? [],
          articles: week.resources?.articles ?? [],
          videos: week.resources?.videos ?? [],
        },

        practiceAndTesting: {
          handsOnPractice: week.practiceAndTesting?.handsOnPractice ?? [],
          mockTests: week.practiceAndTesting?.mockTests ?? [],
          projectBasedPractice:
            week.practiceAndTesting?.projectBasedPractice ?? [],
        },

        weeklySelfCheck: {
          reflectionQuestions: week.weeklySelfCheck?.reflectionQuestions ?? [],
          expectedOutcome: week.weeklySelfCheck?.expectedOutcome ?? "",
        },
      }));

      // Update parsed with normalized weeks
      parsed.weeklyPlan.weeks = normalizedWeeks;
    } catch (err) {
      console.error("JSON parse error:", err);
      console.log("Raw text:", cleanText);
      throw new Error("Invalid JSON returned from Gemini");
    }

    // 🔹 Save to DB
    const roadmapData = {
      student: req.user.id,
      whatToMaster,
      careerGoal,
      experience,
      timeline,
      ...parsed,
    };

    const savedRoadmap = await CareerRoadmap.findOneAndUpdate(
      { student: req.user.id },
      roadmapData,
      { new: true, upsert: true },
    );

    return res.status(200).json({
      success: true,
      message: "Career roadmap generated successfully",
      totalWeeks: parsed.weeklyPlan.weeks.length,
      data: savedRoadmap,
    });
  } catch (error) {
    console.error("Error generating career roadmap:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate career roadmap",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get personalized learning recommendations
 * @route POST /api/v1/career/recommendations
 */
const getLearningRecommendations = async (req, res) => {
  try {
    const { skills, interests, learningStyle } = req.body;

    const prompt = `Provide personalized learning recommendations based on the following:

Current Skills: ${skills?.join(", ") || "None"}
Interests: ${interests?.join(", ") || "None"}
Learning Style: ${learningStyle || "visual"}

Return ONLY valid JSON with this exact structure:
{
  "courses": [
    {
      "title": "course name",
      "platform": "platform URL",
      "duration": "duration",
      "difficulty": "beginner/intermediate/advanced",
      "url": "course url or description"
    }
  ],
  "books": [
    {
      "title": "book title",
      "author": "author name",
      "description": "brief description"
    }
  ],
  "videos": [
    {
      "title": "video/channel name",
      "platform": "YouTube/Udemy/etc",
      "description": "what it covers"
    }
  ],
  "practiceProjects": [
    {
      "title": "project name",
      "description": "project description",
      "difficulty": "beginner/intermediate/advanced"
    }
  ],
  "communities": [
    {
      "name": "community name",
      "platform": "Discord/Slack/Reddit/etc",
      "description": "what makes it valuable"
    }
  ]
}

Provide at least 3-5 items for each category based on the skills and interests provided.`;

    // Get the generative model from genAI
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Generate content using Gemini AI
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 2000,
      },
    });

    const response = await result.response;
    let text = response.text();

    // Clean up the response
    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let parsedResult;
    try {
      parsedResult = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Response text:", text);
      throw new Error("Invalid JSON response from AI");
    }

    return res.status(200).json({
      success: true,
      message: "Learning recommendations generated successfully",
      data: parsedResult,
    });
  } catch (error) {
    console.error("Error generating recommendations:", error);

    if (isGeminiQuotaOrRateLimitError(error)) {
      return res.status(429).json({
        success: false,
        message:
          "Gemini AI quota/rate limit exceeded. Please check API key or retry later.",
        error:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to generate recommendations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get saved career roadmap data for the student
 * @route GET /api/v1/career/my-roadmap
 */
const getMyCareerRoadmap = async (req, res) => {
  try {
    // Fetch existing roadmap from database
    let roadmapData = await CareerRoadmap.findOne({ student: req.user.id });

    // If no roadmap exists, return sample data matching frontend design
    if (!roadmapData) {
      roadmapData = {
        title: "Career Roadmap",
        subtitle: "Your personalized path to success",
        overallProgress: {
          percentage: 22,
          description: "Go back to reach your goals",
        },
        weeklyPlan: {
          duration: "12-Week Plan",
          weeks: [
            {
              weekNumber: 1,
              title: "Foundation Building",
              progress: 68,
              icon: "📝",
              tasks: [
                { name: "Complete JavaScript fundamentals", completed: true },
                { name: "Practice problem-solving exercises", completed: true },
                {
                  name: "Contribute to an open-source project",
                  completed: false,
                },
              ],
            },
            {
              weekNumber: 2,
              title: "System Design Mastery",
              progress: 0,
              icon: "⚙️",
              tasks: [
                {
                  name: "Study distributed systems architecture",
                  completed: false,
                },
                {
                  name: "Design a scalable microservices system",
                  completed: false,
                },
                { name: "Practice system design interviews", completed: false },
              ],
            },
            {
              weekNumber: 3,
              title: "Leadership & Soft Skills",
              progress: 0,
              icon: "👥",
              tasks: [
                { name: "Lead a team code review session", completed: false },
                { name: "Mentor a junior developer", completed: false },
                {
                  name: "Present a technical topic to peers",
                  completed: false,
                },
              ],
            },
          ],
        },
        learningGoals: [
          { skill: "Master TypeScript generics", progress: 83 },
          { skill: "Learn Kubernetes basics", progress: 43 },
          { skill: "Study ML fundamentals", progress: 20 },
          { skill: "Improve system design skills", progress: 60 },
        ],
      };
    }

    return res.status(200).json({
      success: true,
      message: "Career roadmap retrieved successfully",
      data: roadmapData,
    });
  } catch (error) {
    console.error("Error fetching career roadmap:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career roadmap",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Update task completion status
 * @route PATCH /api/v1/career/task/:weekNumber/:taskIndex
 */
const updateTaskStatus = async (req, res) => {
  try {
    const { weekNumber, taskIndex } = req.params;
    const { completed } = req.body;

    // Update task status in database
    const roadmap = await CareerRoadmap.findOne({ student: req.user.id });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Career roadmap not found",
      });
    }

    const week = roadmap.weeklyPlan.weeks.find(
      (w) => w.weekNumber === parseInt(weekNumber),
    );

    if (!week || !week.tasks[parseInt(taskIndex)]) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    // Update task completion status
    week.tasks[parseInt(taskIndex)].completed = completed;
    if (completed) {
      week.tasks[parseInt(taskIndex)].completedAt = new Date();
    } else {
      week.tasks[parseInt(taskIndex)].completedAt = undefined;
    }

    // Save the updated roadmap (pre-save hook will calculate progress)
    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: "Task status updated successfully",
      data: {
        weekNumber: parseInt(weekNumber),
        taskIndex: parseInt(taskIndex),
        completed: completed,
        weekProgress: week.progress,
        overallProgress: roadmap.overallProgress.percentage,
      },
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update task status",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Track career progress
 * @route GET /api/v1/career/progress/:userId
 */
const getCareerProgress = async (req, res) => {
  try {
    // Fetch roadmap from database
    const roadmap = await CareerRoadmap.findOne({ student: req.user.id });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "No career roadmap found",
      });
    }

    // Calculate progress metrics
    const totalWeeks = roadmap.weeklyPlan?.weeks?.length || 0;
    const completedWeeks =
      roadmap.weeklyPlan?.weeks?.filter((week) => week.progress === 100)
        .length || 0;

    const allTasks =
      roadmap.weeklyPlan?.weeks?.flatMap((week) => week.tasks) || [];
    const completedTasks = allTasks.filter((task) => task.completed).length;

    const skillsAcquired =
      roadmap.learningGoals
        ?.filter((goal) => goal.progress >= 80)
        .map((goal) => goal.skill) || [];

    const skillsInProgress =
      roadmap.learningGoals
        ?.filter((goal) => goal.progress > 0 && goal.progress < 80)
        .map((goal) => goal.skill) || [];

    const progress = {
      currentPhase:
        roadmap.weeklyPlan?.weeks?.find(
          (w) => w.progress > 0 && w.progress < 100,
        )?.title || "Getting Started",
      completedMilestones: completedWeeks,
      totalMilestones: totalWeeks,
      completedTasks: completedTasks,
      totalTasks: allTasks.length,
      progressPercentage: roadmap.overallProgress?.percentage || 0,
      nextMilestone:
        roadmap.weeklyPlan?.weeks?.find((w) => w.progress === 0)?.title ||
        "Complete current phase",
      skillsAcquired: skillsAcquired,
      skillsInProgress: skillsInProgress,
      estimatedCompletion: roadmap.weeklyPlan?.duration || "12 weeks",
      careerGoal: roadmap.careerGoal,
    };

    return res.status(200).json({
      success: true,
      message: "Career progress retrieved successfully",
      data: progress,
    });
  } catch (error) {
    console.error("Error fetching career progress:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch career progress",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

module.exports = {
  getCareerRoadmap,
  getLearningRecommendations,
  getMyCareerRoadmap,
  updateTaskStatus,
  getCareerProgress,
};
