const genAI = require("../../config/googlGemini");
const SkillTwin = require("../../models/skillTwinModel");
const fs = require("fs");
const axios = require("axios");
const tesseract = require("tesseract.js");
const { matchSkills } = require("../../services/skillsMatch");

/* ------------------ CAREER MAP ------------------ */

const careerMap = {
  "backend developer": {
    core: ["javascript", "node", "express", "mongodb"],
    advanced: ["docker", "aws", "redis"],
  },
};

/* ------------------ HELPERS ------------------ */

const extractTextFromImage = async (path) => {
  const { data } = await tesseract.recognize(path, "eng");
  return data.text || "";
};

const fetchGitHubText = async (url) => {
  try {
    const repo = url.replace("https://github.com/", "").replace(/\/$/, "");
    for (const branch of ["main", "master"]) {
      try {
        const raw = `https://raw.githubusercontent.com/${repo}/${branch}/README.md`;
        return (await axios.get(raw)).data;
      } catch {}
    }
    return repo;
  } catch {
    return url;
  }
};

const tierFromConfidence = (c = 0) =>
  c >= 0.7 ? "high" : c >= 0.4 ? "medium" : "low";

/* ------------------ MAIN API ------------------ */

exports.buildSkillTwin = async (req, res) => {
  try {
    const { careerGoal, experience = "beginner" } = req.body || {};
    if (!careerGoal) {
      return res.status(400).json({
        success: false,
        message: "careerGoal is required",
      });
    }

    let content = "";

    /* -------- 1. PROOF EXTRACTION -------- */

    if (req.files?.length) {
      const file = req.files[0];
      content = file.mimetype.startsWith("image/")
        ? await extractTextFromImage(file.path)
        : fs.readFileSync(file.path, "utf-8");
    } else if (req.body.url) {
      content = await fetchGitHubText(req.body.url);
    } else if (req.body.content) {
      content = req.body.content;
    } else {
      return res.status(400).json({
        success: false,
        message: "Provide file, url, or text content",
      });
    }

    /* -------- 2. SKILL DETECTION -------- */

    const rawSkills = matchSkills(content);

    const skills = rawSkills
      .filter((s) => s?.name)
      .map((s) => ({
        name: s.name,
        category: s.category || "other",
        confidence: Number(s.confidence || 0),
        tier: tierFromConfidence(s.confidence),
      }));

    if (!skills.length) {
      return res.status(400).json({
        success: false,
        message: "No valid skills detected from provided proof",
      });
    }

    /* -------- 3. CAREER READINESS -------- */

    const roleKey = careerGoal.toLowerCase();
    const roleMap = careerMap[roleKey];

    let readiness = 0;
    let status = "Getting Started";
    let timeline = "6+ months";

    if (roleMap) {
      const owned = skills.map((s) => s.name);
      const matched = roleMap.core.filter((s) => owned.includes(s)).length;

      readiness = Math.round((matched / roleMap.core.length) * 100);

      status =
        readiness >= 85
          ? "Ready!"
          : readiness >= 60
            ? "Almost There!"
            : readiness >= 30
              ? "Halfway There"
              : "Getting Started";

      timeline =
        readiness >= 85
          ? "0–1 month"
          : readiness >= 60
            ? "2–3 months"
            : "4–6 months";
    }

    /* -------- 4. GROWTH PROJECTION -------- */

    const ownedSkills = skills.map((s) => s.name);

    const growthProjection = roleMap
      ? {
          thirtyDays: [
            {
              percentage: Math.min(readiness + 20, 100),
              skills: roleMap.core.filter((s) => !ownedSkills.includes(s)),
            },
          ],
          sixtyDays: [
            {
              percentage: Math.min(readiness + 40, 100),
              skills: roleMap.advanced.slice(0, 2),
            },
          ],
          ninetyDays: [
            {
              percentage: 100,
              skills: roleMap.advanced,
            },
          ],
        }
      : { thirtyDays: [], sixtyDays: [], ninetyDays: [] };

    /* -------- 5. OPTIONAL AI INSIGHT -------- */

    let aiInsight = { enabled: false };

    try {
      if (genAI?.getGenerativeModel) {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const aiResult = await model.generateContent({
          contents: [
            {
              role: "user",
              parts: [{ text: `Career advice for ${careerGoal}` }],
            },
          ],
          generationConfig: { maxOutputTokens: 300 },
        });

        const aiText = aiResult?.response?.text?.();

        aiInsight = {
          enabled: true,
          summary: String(aiText || "").slice(0, 1000),
        };
      }
    } catch (e) {
      console.warn("AI skipped:", e.message);
      aiInsight = { enabled: false, reason: "AI unavailable" };
    }

    /* -------- 6. SAVE SKILL TWIN -------- */

    const twin = await SkillTwin.create({
      userId: req.user?.id,
      proofSource: req.files?.length
        ? req.files[0].mimetype.startsWith("image/")
          ? "image"
          : "file"
        : req.body.url
          ? "github"
          : "text",
      proofSummary: content.slice(0, 500),
      skills: skills,
      careerReadiness: {
        targetRole: careerGoal,
        percentage: readiness,
        status,
        timeline,
      },
      growthProjection: growthProjection,
      aiInsight,
      version: 1,
    });

    return res.status(201).json({
      success: true,
      message: "SkillTwin generated successfully",
      data: twin,
    });
  } catch (err) {
    console.error("SkillTwin build error:", err);
    return res.status(500).json({
      success: false,
      message: "SkillTwin build failed",
    });
  }
};
