const genAI = require("../../config/googlGemini");

/**
 * Get AI-curated webinars based on student preferences
 * @route POST /api/v1/webinars/recommendations
 */
exports.getWebinarRecommendations = async (req, res) => {
  try {
    const { interests, skillLevel, preferredLanguage, topics } = req.body;

    const language = preferredLanguage || "English";

    const prompt = `Generate a list of relevant webinar recommendations for a student:

Interests: ${interests?.join(", ") || "General tech topics"}
Skill Level: ${skillLevel || "intermediate"}
Preferred Language: ${language}
Topics of Interest: ${topics?.join(", ") || "Not specified"}

Generate webinar recommendations covering current tech trends, skill development, and career growth.
Return JSON:
{
  "webinars": [
    {
      "title": "webinar title",
      "description": "brief description",
      "category": "category (e.g., AI, Web Dev, Data Science)",
      "level": "beginner/intermediate/advanced",
      "duration": "estimated duration",
      "keyTakeaways": ["takeaway1", "takeaway2"],
      "language": "${language}"
    }
  ],
  "upcomingTopics": ["trending topic 1", "trending topic 2"],
  "suggestedSchedule": "recommended viewing schedule"
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

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

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let webinarResult;
    try {
      webinarResult = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Response text:", text);
      throw new Error("Invalid JSON response from AI");
    }

    return res.status(200).json({
      success: true,
      message: "Webinar recommendations generated successfully",
      data: webinarResult,
    });
  } catch (error) {
    console.error("Error generating webinar recommendations:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to generate webinar recommendations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Translate webinar content to preferred language
 * @route POST /api/v1/webinars/translate
 */
exports.translateWebinarContent = async (req, res) => {
  try {
    const { content, targetLanguage } = req.body;

    if (!content || !targetLanguage) {
      return res.status(400).json({
        success: false,
        message: "Please provide content and target language",
      });
    }

    const prompt = `You are a professional translator. Translate the following webinar content to ${targetLanguage} while maintaining technical accuracy and context.

Content to translate:
${content}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 2000,
      },
    });

    const response = await result.response;
    const translatedContent = response.text();

    return res.status(200).json({
      success: true,
      message: "Content translated successfully",
      data: {
        original: content,
        translated: translatedContent,
        language: targetLanguage,
      },
    });
  } catch (error) {
    console.error("Error translating content:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to translate content",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get trending webinar topics
 * @route GET /api/v1/webinars/trending
 */
exports.getTrendingTopics = async (req, res) => {
  try {
    const { category } = req.query;

    const prompt = `Generate a list of trending webinar topics in ${
      category || "technology and career development"
    } for 2026.
    
Return JSON:
{
  "trendingTopics": [
    {
      "topic": "topic name",
      "relevance": "why it's trending",
      "targetAudience": "who should attend",
      "popularity": <1-10>
    }
  ]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 1500,
      },
    });

    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let topicsResult;
    try {
      topicsResult = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Response text:", text);
      throw new Error("Invalid JSON response from AI");
    }

    return res.status(200).json({
      success: true,
      message: "Trending topics retrieved successfully",
      data: topicsResult,
    });
  } catch (error) {
    console.error("Error fetching trending topics:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch trending topics",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get personalized webinar schedule
 * @route POST /api/v1/webinars/schedule
 */
exports.getPersonalizedSchedule = async (req, res) => {
  try {
    const { availableTime, goals, currentSkills } = req.body;

    const prompt = `Create a personalized webinar schedule:

Available Time: ${availableTime || "flexible"}
Learning Goals: ${goals?.join(", ") || "general skill improvement"}
Current Skills: ${currentSkills?.join(", ") || "beginner"}

Return JSON with a weekly schedule:
{
  "weeklySchedule": {
    "monday": {"topic": "topic", "duration": "duration"},
    "tuesday": {"topic": "topic", "duration": "duration"},
    "wednesday": {"topic": "topic", "duration": "duration"},
    "thursday": {"topic": "topic", "duration": "duration"},
    "friday": {"topic": "topic", "duration": "duration"},
    "weekend": {"topic": "optional deep-dive session", "duration": "duration"}
  },
  "estimatedProgress": "expected progress in 1 month",
  "tips": ["tip1", "tip2"]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        responseMimeType: "application/json",
        maxOutputTokens: 1500,
      },
    });

    const response = await result.response;
    let text = response.text();

    text = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    let scheduleResult;
    try {
      scheduleResult = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON parsing error:", parseError);
      console.error("Response text:", text);
      throw new Error("Invalid JSON response from AI");
    }

    return res.status(200).json({
      success: true,
      message: "Personalized schedule created successfully",
      data: scheduleResult,
    });
  } catch (error) {
    console.error("Error creating schedule:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create schedule",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
