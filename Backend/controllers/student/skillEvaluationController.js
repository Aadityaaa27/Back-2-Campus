const fs = require("fs").promises;
const Tesseract = require("tesseract.js");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Evaluate student's code from an uploaded image using OCR + OpenAI
 */
exports.evaluateSkillFromImage = async (req, res) => {
  let uploadedFile;

  try {
    // 1️⃣ Validate upload
    uploadedFile = req.file || (Array.isArray(req.files) && req.files[0]);
    if (!uploadedFile) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file",
      });
    }

    const skill = req.body.skill?.trim() || "JavaScript";
    const level = req.body.level?.trim() || "Intermediate";

    // 2️⃣ OCR
    const ocrResult = await Tesseract.recognize(uploadedFile.path, "eng", {
      logger: () => {},
    });

    const extractedCode = ocrResult.data.text?.trim();
    if (!extractedCode) {
      throw new Error("Failed to extract code from image");
    }

    // 3️⃣ Sanitize OCR text (VERY IMPORTANT)
    const sanitizedCode = extractedCode
      .replace(/[“”]/g, '"')
      .replace(/[‘’]/g, "'")
      .replace(/[^\x00-\x7F]/g, "")
      .trim();

    // 4️⃣ Prompt
    const prompt = `
You are an expert code evaluator.

Analyze the following code and evaluate it based on:
- Code quality
- Best practices
- Logic and efficiency
- Error handling
- Documentation
- Skill level

Skill: ${skill}
Expected Level: ${level}

CODE:
${sanitizedCode}

Return ONLY valid JSON in this exact format:
{
  "score": number,
  "evaluation": "summary",
  "strengths": ["..."],
  "improvements": ["..."]
}
`;

    // 5️⃣ Call OpenAI (STABLE MODEL)
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.2,
      max_tokens: 700,
    });

    const rawText = completion.choices[0].message.content;

    // 6️⃣ Parse JSON safely
    let evaluation;
    try {
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      evaluation = JSON.parse(cleaned);
    } catch (err) {
      evaluation = {
        score: 50,
        evaluation: rawText,
        strengths: ["Code extracted successfully"],
        improvements: ["AI response was not in strict JSON"],
      };
    }

    // 7️⃣ Cleanup image
    await fs.unlink(uploadedFile.path).catch(() => {});

    // 8️⃣ Response
    return res.status(200).json({
      success: true,
      message: "Code evaluation completed successfully",
      data: {
        score: `${evaluation.score}%`,
        scoreValue: evaluation.score,
        evaluation: evaluation.evaluation,
        strengths: evaluation.strengths,
        improvements: evaluation.improvements,
        skill,
        level,
      },
    });
  } catch (error) {
    console.error("Error evaluating skill:", error);
    if (uploadedFile?.path) {
      await fs.unlink(uploadedFile.path).catch(() => {});
    }

    return res.status(500).json({
      success: false,
      message: "Failed to evaluate code",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

/**
 * Test endpoint to check if API is working
 * @route GET /api/v1/skills/test
 */
exports.testSkillEvaluation = async (req, res) => {
  res.status(200).json({
    success: true,
    message: "Skill evaluation API is working",
    endpoints: {
      evaluate:
        "POST /api/v1/skills/evaluate - Upload code image for evaluation",
    },
  });
};
