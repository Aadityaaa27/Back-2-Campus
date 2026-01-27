// const genAI = require("../../config/googlGemini");

// /**
//  * Monitor student burnout and stress levels
//  * @route POST /api/v1/wellbeing/assess
//  */
// exports.assessWellbeing = async (req, res) => {
//   try {
//     const {
//       sleepHours,
//       stressLevel,
//       workloadHours,
//       exerciseFrequency,
//       socialInteraction,
//       academicPressure,
//       mood,
//     } = req.body;

//     const prompt = `Assess the wellbeing of a student based on the following data:

// Sleep Hours per Night: ${sleepHours || "not specified"}
// Stress Level (1-10): ${stressLevel || "not specified"}
// Study/Work Hours per Day: ${workloadHours || "not specified"}
// Exercise Frequency: ${exerciseFrequency || "not specified"}
// Social Interaction Level: ${socialInteraction || "moderate"}
// Academic Pressure Level: ${academicPressure || "moderate"}
// Current Mood: ${mood || "neutral"}

// Analyze burnout risk and provide wellness recommendations. Return ONLY valid JSON with this structure:
// {
//   "burnoutRisk": {
//     "level": "low/moderate/high",
//     "score": 0-100,
//     "indicators": ["indicator1", "indicator2"]
//   },
//   "wellnessScore": 0-100,
//   "recommendations": [
//     {
//       "category": "sleep/exercise/social/stress",
//       "suggestion": "specific actionable advice",
//       "priority": "high/medium/low"
//     }
//   ],
//   "alerts": ["alert if immediate action needed"],
//   "positiveAspects": ["things they're doing well"]
// }`;

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//       generationConfig: {
//         responseMimeType: "application/json",
//         maxOutputTokens: 1500,
//       },
//     });

//     const response = await result.response;
//     const data = JSON.parse(response.text());

//     return res.status(200).json({
//       success: true,
//       message: "Wellbeing assessment completed successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error assessing wellbeing:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to assess wellbeing",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// /**
//  * Get personalized wellness suggestions
//  * @route POST /api/v1/wellbeing/suggestions
//  */
// exports.getWellnessSuggestions = async (req, res) => {
//   try {
//     const { concerns, lifestyle, goals } = req.body;

//     const prompt = `Provide personalized wellness suggestions for a student:

// Current Concerns: ${concerns?.join(", ") || "general wellness"}
// Lifestyle: ${lifestyle || "typical student"}
// Wellness Goals: ${goals?.join(", ") || "improve overall wellbeing"}

// Return ONLY valid JSON with this structure:
// {
//   "dailyRoutine": {
//     "morning": ["activity1", "activity2"],
//     "afternoon": ["activity1", "activity2"],
//     "evening": ["activity1", "activity2"]
//   },
//   "stressManagement": ["technique1", "technique2", "technique3"],
//   "selfCareActivities": ["activity1", "activity2"],
//   "resourcesAndSupport": ["resource1", "resource2"],
//   "weeklyGoals": ["goal1", "goal2"]
// }`;

//     const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//     const result = await model.generateContent({
//       contents: [
//         {
//           role: "user",
//           parts: [{ text: prompt }],
//         },
//       ],
//       generationConfig: {
//         responseMimeType: "application/json",
//         maxOutputTokens: 1500,
//       },
//     });

//     const response = await result.response;
//     const data = JSON.parse(response.text());

//     return res.status(200).json({
//       success: true,
//       message: "Wellness suggestions generated successfully",
//       data: data,
//     });
//   } catch (error) {
//     console.error("Error generating wellness suggestions:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to generate wellness suggestions",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });
//   }
// };

// /**
//  * Get mental health resources and support
//  * @route GET /api/v1/wellbeing/resources
//  */
// exports.getMentalHealthResources = async (req, res) => {
//   // ...existing code...
// };

// /**
//  * Track wellbeing progress over time
//  * @route POST /api/v1/wellbeing/track
//  */
// exports.trackWellbeingProgress = async (req, res) => {
//   // ...existing code...
// };

const fs = require("fs").promises;
const path = require("path");
const axios = require("axios");
const tesseract = require("tesseract.js");

exports.assessWellbeingFallback = (req, res) => {
  try {
    const {
      sleepHours,
      stressLevel,
      workloadHours,
      exerciseFrequency,
      socialInteraction,
      academicPressure,
      mood,
    } = req.body;

    const indicators = [];
    let burnoutScore = 0;

    if (sleepHours && sleepHours < 6) {
      indicators.push("Low sleep");
      burnoutScore += 30;
    }

    if (stressLevel && stressLevel > 7) {
      indicators.push("High stress");
      burnoutScore += 30;
    }
    if (workloadHours && workloadHours > 8) {
      indicators.push("Heavy workload");
      burnoutScore += 20;
    }
    if (exerciseFrequency && exerciseFrequency === 0) {
      indicators.push("No exercise");
      burnoutScore += 10;
    }
    if (socialInteraction && socialInteraction.toLowerCase() === "low") {
      indicators.push("Low social interaction");
      burnoutScore += 10;
    }

    burnoutScore = Math.min(burnoutScore, 100);
    const wellnessScore = 100 - burnoutScore;

    const level =
      burnoutScore < 30 ? "low" : burnoutScore < 70 ? "moderate" : "high";

    // Simple recommendations
    const recommendations = [];
    if (sleepHours && sleepHours < 7) {
      recommendations.push({
        category: "sleep",
        suggestion: "Get at least 7 hours of sleep per night",
        priority: "high",
      });
    }
    if (stressLevel && stressLevel > 6) {
      recommendations.push({
        category: "stress",
        suggestion: "Practice relaxation techniques or meditation",
        priority: "high",
      });
    }
    if (workloadHours && workloadHours > 8) {
      recommendations.push({
        category: "workload",
        suggestion: "Try time management or break tasks into smaller steps",
        priority: "medium",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Wellbeing assessed successfully (fallback)",
      data: {
        burnoutRisk: {
          level,
          score: burnoutScore,
          indicators,
        },
        wellnessScore,
        recommendations,
        positiveAspects: ["You are seeking feedback to improve wellbeing"],
      },
    });
  } catch (error) {
    console.error("Error in wellbeing fallback:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to assess wellbeing (fallback)",
      error: error.message,
    });
  }
};

// Primary export used by routes: delegates to fallback logic
exports.assessWellbeing = async (req, res) => {
  return exports.assessWellbeingFallback(req, res);
};

// Simple wellness suggestions endpoint
exports.getWellnessSuggestions = async (req, res) => {
  try {
    const { concerns, lifestyle, goals } = req.body;

    const suggestions = [];
    suggestions.push("Try a short 10-minute mindfulness break daily");
    suggestions.push("Keep a regular sleep schedule and aim for 7-8 hours");
    suggestions.push(
      "Break study sessions into focused 25-50 minute blocks with short breaks",
    );

    return res.status(200).json({
      success: true,
      message: "Wellness suggestions generated successfully",
      data: {
        dailyRoutine: {
          morning: ["Light exercise", "Healthy breakfast"],
          afternoon: ["Focused study blocks", "Short walk"],
          evening: ["Wind-down routine", "Limit screens before bed"],
        },
        stressManagement: ["Deep breathing", "Progressive muscle relaxation"],
        selfCareActivities: ["Short walks", "Social check-ins"],
        resourcesAndSupport: [
          "Campus counseling center",
          "Mental health hotline",
        ],
        weeklyGoals: [
          "Sleep 7+ hours nightly",
          "Do 3 short workouts this week",
        ],
      },
    });
  } catch (error) {
    console.error("Error generating wellness suggestions:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate suggestions" });
  }
};

// Return static mental health resources
exports.getMentalHealthResources = async (req, res) => {
  try {
    const resources = [
      {
        name: "Campus Counseling",
        contact: "counseling@university.edu",
        phone: "123-456-7890",
      },
      {
        name: "National Helpline",
        contact: "https://www.mentalhealth.gov",
        phone: "1-800-662-HELP",
      },
    ];
    return res.status(200).json({ success: true, data: resources });
  } catch (error) {
    console.error("Error fetching resources:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch resources" });
  }
};

// Track wellbeing progress (simple echo/backing-store placeholder)
exports.trackWellbeingProgress = async (req, res) => {
  try {
    const { date, metrics } = req.body;
    // In production, persist to DB. For now return received data.
    return res
      .status(200)
      .json({
        success: true,
        message: "Progress recorded (stub)",
        data: { date, metrics },
      });
  } catch (error) {
    console.error("Error tracking wellbeing progress:", error);
    return res
      .status(500)
      .json({ success: false, message: "Failed to track progress" });
  }
};

/**
 * Get AI chat support for wellness concerns
 * @route POST /api/v1/wellbeing/chat
 */
exports.wellbeingChatSupport = async (req, res) => {
  try {
    const { message, conversationHistory } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide a message",
      });
    }

    // Fallback non-AI response to ensure uptime; replace with AI call when genAI is configured
    const reply = `I'm sorry you're going through that. It can help to take a few deep breaths, reach out to a friend or campus counselor, and break tasks into smaller steps. If you're in immediate danger or having suicidal thoughts, please contact local emergency services or a crisis hotline.`;

    return res.status(200).json({
      success: true,
      message: "Response generated successfully (fallback)",
      data: {
        reply,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error in wellbeing chat:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate response",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
