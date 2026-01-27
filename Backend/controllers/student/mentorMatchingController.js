const genAI = require("../../config/googlGemini");
const Mentor = require("../../models/mentorModel");
const MentorshipRequest = require("../../models/mentorshipRequestModel");
const MentorMatching = require("../../models/mentorMatchingModel");
const { z } = require("zod");

/* ======================================================
   ZOD SCHEMA — STRICT AI RESPONSE VALIDATION
====================================================== */
const MentorRecommendationSchema = z.object({
  mentors: z
    .array(
      z.object({
        mentorId: z.string(),
        matchPercentage: z.number().min(70).max(99),
        matchReason: z.string().min(5),
        topSkills: z.array(z.string()).min(1).max(4),
        keyStrengths: z.array(z.string()).max(5).optional(),
      }),
    )
    .min(1)
    .max(5),
});

/* ======================================================
   GEMINI CALL WITH RETRY + TOKEN OPTIMIZATION
====================================================== */
async function callGeminiWithRetry({ prompt, retries = 2 }) {
  let lastError;

  for (let attempt = 1; attempt <= retries + 1; attempt++) {
    try {
      const result = await genAI.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", text: prompt }],
        generationConfig: {
          responseMimeType: "application/json",
          maxOutputTokens: 800, // 🔥 COST CONTROL
          temperature: 0.3,
          topP: 0.9,
        },
      });

      let text =
        result?.candidates?.[0]?.content?.parts?.[0]?.text ||
        result?.candidates?.[0]?.content?.text ||
        result?.output_text;

      if (!text) {
        throw new Error("Gemini returned empty response");
      }

      text = String(text)
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      const parsed = JSON.parse(text);

      // 🔒 Validate AI output
      MentorRecommendationSchema.parse(parsed);

      return parsed;
    } catch (err) {
      lastError = err;
      console.warn(`⚠️ Gemini attempt ${attempt} failed`);

      if (attempt > retries) break;
    }
  }

  throw lastError;
}

/* ======================================================
   GET AI-POWERED MENTOR RECOMMENDATIONS
====================================================== */
exports.getMentorRecommendations = async (req, res) => {
  try {
    const { skills, interests, careerGoal, experienceLevel } = req.body;
    const studentId = req.user.id;

    if (!careerGoal) {
      return res.status(400).json({
        success: false,
        message: "Please provide your career goal",
      });
    }

    const mentors = await Mentor.find({ isAvailable: true }).limit(20);

    if (mentors.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No mentors available at the moment",
        data: { mentors: [], totalCount: 0 },
      });
    }

    /* 🔥 TOKEN-OPTIMIZED MENTOR PAYLOAD */
    const mentorsData = mentors.map((m) => ({
      id: m._id.toString(),
      expertise: m.expertise.slice(0, 5),
      yearsOfExperience: m.yearsOfExperience,
      title: m.title,
    }));

    /* 🧠 LEAN PROMPT (NO CHAIN-OF-THOUGHT) */
    const prompt = `Match mentors to this student.

Student:
Skills: ${skills?.join(", ") || "None"}
Interests: ${interests?.join(", ") || "None"}
Career Goal: ${careerGoal}
Experience: ${experienceLevel || "beginner"}

Mentors:
${JSON.stringify(mentorsData)}

Rules:
- Return ONLY JSON
- No markdown
- No explanations
- Max 5 mentors
- Match % between 85 and 99

JSON format:
{
  "mentors": [
    {
      "mentorId": "string",
      "matchPercentage": number,
      "matchReason": "string",
      "topSkills": ["string"],
      "keyStrengths": ["string"]
    }
  ]
}`;

    const aiResult = await callGeminiWithRetry({ prompt, retries: 2 });

    /* 🎯 ENRICH AI RESULTS WITH FULL MENTOR DATA */
    const enrichedMentors = aiResult.mentors
      .map((rec) => {
        const mentor = mentors.find((m) => m._id.toString() === rec.mentorId);
        if (!mentor) return null;

        const initials = mentor.fullName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        return {
          id: mentor._id,
          name: mentor.fullName,
          title: mentor.title || "Mentor",
          company: mentor.company || "Tech Company",
          expertise: rec.topSkills,
          matchPercentage: rec.matchPercentage,
          matchReason: rec.matchReason,
          avatar: mentor.avatar || initials,
          bio: mentor.bio,
          yearsOfExperience: mentor.yearsOfExperience,
          keyStrengths: rec.keyStrengths || [],
        };
      })
      .filter(Boolean);

    /* 💾 SAVE MATCHES */
    await MentorMatching.findOneAndUpdate(
      { student: studentId },
      {
        student: studentId,
        careerGoal,
        matchedMentors: enrichedMentors.map((m) => ({
          mentor: m.id,
          matchPercentage: m.matchPercentage,
          matchReason: m.matchReason,
          topSkills: m.expertise,
          keyStrengths: m.keyStrengths,
          status: "recommended",
        })),
        studentPreferences: {
          skills: skills || [],
          interests: interests || [],
          experienceLevel: experienceLevel || "beginner",
        },
        lastUpdated: new Date(),
      },
      { upsert: true, new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Mentor recommendations generated successfully",
      data: {
        mentors: enrichedMentors,
        totalCount: enrichedMentors.length,
        careerGoal,
      },
    });
  } catch (error) {
    console.error("❌ Mentor matching error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get mentor recommendations",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/* ======================================================
   SEND MENTORSHIP REQUEST
====================================================== */
exports.sendMentorshipRequest = async (req, res) => {
  try {
    const { mentorId, message, goals } = req.body;
    const studentId = req.user.id;

    if (!mentorId || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide mentor ID and message",
      });
    }

    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      mentor: mentorId,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request with this mentor",
      });
    }

    const request = await MentorshipRequest.create({
      student: studentId,
      mentor: mentorId,
      message,
      goals: goals || [],
      status: "pending",
    });

    return res.status(201).json({
      success: true,
      message: "Mentorship request sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("❌ Send request error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send mentorship request",
    });
  }
};

/* ======================================================
   GET SAVED MATCHES
====================================================== */
exports.getMySavedMatches = async (req, res) => {
  try {
    const studentId = req.user.id;

    const matchingData = await MentorMatching.findOne({
      student: studentId,
    }).populate(
      "matchedMentors.mentor",
      "fullName title company expertise yearsOfExperience bio avatar",
    );

    if (!matchingData) {
      return res.status(404).json({
        success: false,
        message: "No mentor matches found",
      });
    }

    const formatted = matchingData.matchedMentors.map((m) => {
      const mentor = m.mentor;
      const initials = mentor.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return {
        id: mentor._id,
        name: mentor.fullName,
        title: mentor.title,
        company: mentor.company,
        expertise: m.topSkills,
        matchPercentage: m.matchPercentage,
        matchReason: m.matchReason,
        avatar: mentor.avatar || initials,
        bio: mentor.bio,
        yearsOfExperience: mentor.yearsOfExperience,
        keyStrengths: m.keyStrengths || [],
        status: m.status,
        contactedAt: m.contactedAt,
      };
    });

    return res.status(200).json({
      success: true,
      data: {
        mentors: formatted,
        totalCount: formatted.length,
        careerGoal: matchingData.careerGoal,
        lastUpdated: matchingData.lastUpdated,
      },
    });
  } catch (error) {
    console.error("❌ Fetch saved matches error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved matches",
    });
  }
};

/**
 * Send mentorship request to a mentor
 * @route POST /api/v1/mentors/request
 */
exports.sendMentorshipRequest = async (req, res) => {
  try {
    const { mentorId, message, goals } = req.body;
    const studentId = req.user.id;

    if (!mentorId || !message) {
      return res.status(400).json({
        success: false,
        message: "Please provide mentor ID and message",
      });
    }

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Check for existing pending request
    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      mentor: mentorId,
      status: "PENDING",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request with this mentor",
      });
    }

    // Create new mentorship request
    const request = new MentorshipRequest({
      student: studentId,
      mentor: mentorId,
      message,
      goals: goals || [],
      status: "PENDING",
    });

    await request.save();

    return res.status(201).json({
      success: true,
      message: "Mentorship request sent successfully",
      data: request,
    });
  } catch (error) {
    console.error("Error sending mentorship request:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to send mentorship request",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get all mentorship requests for a student
 * @route GET /api/v1/mentors/my-requests
 */
exports.getMyMentorshipRequests = async (req, res) => {
  try {
    const studentId = req.user.id;

    const requests = await MentorshipRequest.find({ student: studentId })
      .populate("mentor", "fullName expertise company yearsOfExperience")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "Mentorship requests retrieved successfully",
      data: requests,
    });
  } catch (error) {
    console.error("Error fetching mentorship requests:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentorship requests",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get all available mentors
 * @route GET /api/v1/mentors/all
 */
exports.getAllMentors = async (req, res) => {
  try {
    const { expertise, company, minExperience } = req.query;

    const filter = { isAvailable: true };
    if (expertise) filter.expertise = { $in: [expertise] };
    if (company) filter.company = new RegExp(company, "i");
    if (minExperience)
      filter.yearsOfExperience = { $gte: parseInt(minExperience) };

    const mentors = await Mentor.find(filter).sort({ yearsOfExperience: -1 });

    return res.status(200).json({
      success: true,
      message: "Mentors retrieved successfully",
      data: mentors,
      count: mentors.length,
    });
  } catch (error) {
    console.error("Error fetching mentors:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch mentors",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get saved mentor recommendations for current student
 * @route GET /api/v1/mentors/my-matches
 */
exports.getMySavedMatches = async (req, res) => {
  try {
    const studentId = req.user.id;

    const matchingData = await MentorMatching.findOne({
      student: studentId,
    }).populate({
      path: "matchedMentors.mentor",
      select: "fullName title company expertise yearsOfExperience bio avatar",
    });

    if (!matchingData) {
      return res.status(404).json({
        success: false,
        message:
          "No mentor matches found. Please generate recommendations first.",
      });
    }

    // Format the response to match frontend design
    const formattedMentors = matchingData.matchedMentors.map((match) => {
      const mentor = match.mentor;

      // Generate initials if no avatar
      const initials = mentor.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);

      return {
        id: mentor._id,
        name: mentor.fullName,
        title: mentor.title || "Mentor",
        company: mentor.company || "Tech Company",
        expertise: match.topSkills || mentor.expertise.slice(0, 4),
        matchPercentage: match.matchPercentage,
        matchReason: match.matchReason,
        avatar: mentor.avatar || initials,
        bio: mentor.bio,
        yearsOfExperience: mentor.yearsOfExperience,
        keyStrengths: match.keyStrengths || [],
        status: match.status,
        contactedAt: match.contactedAt,
      };
    });

    return res.status(200).json({
      success: true,
      message: "Saved mentor matches retrieved successfully",
      data: {
        mentors: formattedMentors,
        totalCount: formattedMentors.length,
        careerGoal: matchingData.careerGoal,
        lastUpdated: matchingData.lastUpdated,
      },
    });
  } catch (error) {
    console.error("Error fetching saved matches:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch saved matches",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Connect with a mentor (send connection request)
 * @route POST /api/v1/mentors/connect/:mentorId
 */
exports.connectWithMentor = async (req, res) => {
  try {
    const { mentorId } = req.params;
    const { message, goals } = req.body;
    const studentId = req.user.id;

    // Check if mentor exists
    const mentor = await Mentor.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    // Update mentor matching status
    await MentorMatching.findOneAndUpdate(
      {
        student: studentId,
        "matchedMentors.mentor": mentorId,
      },
      {
        $set: {
          "matchedMentors.$.status": "contacted",
          "matchedMentors.$.contactedAt": new Date(),
        },
      },
    );

    // Create mentorship request
    const existingRequest = await MentorshipRequest.findOne({
      student: studentId,
      mentor: mentorId,
      status: "pending",
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message:
          "You already have a pending connection request with this mentor",
      });
    }

    const request = new MentorshipRequest({
      student: studentId,
      mentor: mentorId,
      message: message || "I would like to connect with you as my mentor.",
      goals: goals || [],
      status: "PENDING",
    });

    await request.save();

    return res.status(201).json({
      success: true,
      message: "Connection request sent successfully",
      data: {
        requestId: request._id,
        mentor: {
          id: mentor._id,
          name: mentor.fullName,
          title: mentor.title,
          company: mentor.company,
        },
      },
    });
  } catch (error) {
    console.error("Error connecting with mentor:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to connect with mentor",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Get mentor profile by ID
 * @route GET /api/v1/mentors/:id
 */
exports.getMentorProfile = async (req, res) => {
  try {
    const mentorId = req.params.id;

    const mentor = await Mentor.findById(mentorId).select("-password");

    if (!mentor) {
      return res.status(404).json({
        success: false,
        message: "Mentor not found",
      });
    }

    res.status(200).json({
      success: true,
      data: mentor,
    });
  } catch (error) {
    console.error("Error fetching mentor profile:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch mentor profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
