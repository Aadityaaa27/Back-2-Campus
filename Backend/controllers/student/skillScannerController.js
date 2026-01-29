// const genAI = require("../../config/googlGemini");
// const multer = require("multer");
// const fs = require("fs").promises;
// const path = require("path");
// const axios = require("axios");
// const tesseract = require("tesseract.js");

// /** OCR helper */
// const extractTextFromImage = async (filePath) => {
//   const {
//     data: { text },
//   } = await tesseract.recognize(filePath, "eng");
//   return text;
// };

// /** GitHub README helper */
// const fetchTextFromGitHub = async (url) => {
//   try {
//     if (!url.includes("github.com")) return url;
//     const repoPath = url.replace("https://github.com/", "");
//     const apiUrl = `https://raw.githubusercontent.com/${repoPath}/main/README.md`;
//     const response = await axios.get(apiUrl);
//     return response.data;
//   } catch (err) {
//     console.warn("Could not fetch GitHub content; using URL as text");
//     return url;
//   }
// };

// exports.detectSkills = async (req, res) => {
//   try {
//     let content = "";

//     // Get text from uploaded files
//     if (req.files && req.files.length > 0) {
//       const filePath = req.files[0].path;
//       const fileType = req.files[0].mimetype;

//       if (fileType.startsWith("image/")) {
//         // OCR
//         content = await extractTextFromImage(filePath);
//       } else {
//         content = await fs.readFile(filePath, "utf-8");
//       }

//       await fs.unlink(filePath);
//     } else if (req.body.url) {
//       content = await fetchTextFromGitHub(req.body.url);
//     } else if (req.body.content) {
//       content = req.body.content;
//     } else {
//       return res.status(400).json({
//         success: false,
//         message: "Please provide a document, image, URL, or text content",
//       });
//     }

//     const prompt = `You are an AI that detects skills from any student content (notes, assignments, code, projects, documents, handwritten images).
// Do NOT judge, rate, or analyze. Return ONLY the skills mentioned or implied.
// Return only valid JSON with an array field named "skills".

// Content:
// ${content}`;

//     // ✅ Correct text generation call
//     const response = await genAI.models.generateContent({
//       model: "gemini-2.0-flash-001", // use a valid Gemini model
//       contents: prompt,
//     });

//     // Response text from model
//     const text = response.text;

//     const cleaned = text
//       .replace(/```json/g, "")
//       .replace(/```/g, "")
//       .trim();

//     let result;
//     try {
//       result = JSON.parse(cleaned);
//     } catch (parseError) {
//       console.error("JSON parse error:", parseError, cleaned);
//       throw new Error("Invalid JSON response from AI");
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Skills detected successfully",
//       data: result,
//     });
//   } catch (error) {
//     console.error("Error detecting skills:", error);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to detect skills",
//       error:
//         process.env.NODE_ENV === "development"
//           ? error.message
//           : "Internal server error",
//     });
//   }
// };
const fs = require("fs").promises;
const axios = require("axios");
const tesseract = require("tesseract.js");
const { matchSkills } = require("../../data/skillMatcher");

/**********************
 * Helper: Extract text from image using OCR
 **********************/
const extractTextFromImage = async (filePath) => {
  const {
    data: { text },
  } = await tesseract.recognize(filePath, "eng");
  return text;
};

/**********************
 * Helper: Fetch text from GitHub README
 **********************/
const fetchTextFromGitHub = async (url) => {
  try {
    if (!url.includes("github.com")) return url;

    const repoPath = url.replace("https://github.com/", "").replace(/\/$/, "");
    const branches = ["main", "master"];

    for (const branch of branches) {
      try {
        const apiUrl = `https://raw.githubusercontent.com/${repoPath}/${branch}/README.md`;
        const response = await axios.get(apiUrl);
        return response.data;
      } catch (_) {}
    }

    return repoPath;
  } catch {
    return url;
  }
};

const toTitleCase = (str) =>
  str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

/**********************
 * Rule-based Skill Detection
 **********************/
exports.detectSkillsFallback = async (req, res) => {
  try {
    let content = "";

    if (req.files && req.files.length > 0) {
      const { path: filePath, mimetype } = req.files[0];

      if (mimetype.startsWith("image/")) {
        content = await extractTextFromImage(filePath);
      } else {
        content = await fs.readFile(filePath, "utf-8");
      }

      await fs.unlink(filePath).catch(() => {});
    } else if (req.body?.url) {
      content = await fetchTextFromGitHub(req.body.url);
    } else if (req.body?.content) {
      content = req.body.content;
    } else {
      return res.status(400).json({
        success: false,
        message: "Please provide a file, URL, or text content",
      });
    }

    // console.log("CONTENT START ========");
    // console.log(content.slice(0, 1000));
    // console.log("CONTENT END ==========");

    const detectedSkills = matchSkills(content);

    return res.status(200).json({
      success: true,
      message: "Skills detected successfully",
      data: {
        skills: detectedSkills,
      },
    });

    // return res.status(200).json({
    //   success: true,
    //   message: "Skills detected successfully",
    //   data: {
    //     skills: detectedSkills.map(toTitleCase),
    //   },
    // });
  } catch (error) {
    console.error("Skill detection error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to detect skills",
      error: error.message,
    });
  }
};
