const fs = require("fs");
const path = require("path");

const SKILLS_FILE = path.join(__dirname, "skills.txt");
const ALIAS_FILE = path.join(__dirname, "aliases.json");
const CATEGORY_FILE = path.join(__dirname, "categories.json");

/* ---------------- LOAD ONCE ---------------- */

const skills = new Set(
  fs
    .readFileSync(SKILLS_FILE, "utf-8")
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean),
);

const aliases = JSON.parse(fs.readFileSync(ALIAS_FILE, "utf-8"));
const categories = JSON.parse(fs.readFileSync(CATEGORY_FILE, "utf-8"));

const skillCategoryMap = {};
for (const [cat, list] of Object.entries(categories)) {
  list.forEach((s) => (skillCategoryMap[s] = cat));
}

/* ---------------- MATCH ENGINE ---------------- */

const matchSkills = (text) => {
  /* ---------------- NORMALIZE ---------------- */
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");

  const words = normalized.split(" ");
  const lines = text.toLowerCase().split("\n");

  const frequency = {};
  const found = new Set();

  /* ---------------- O(n) SINGLE PASS ---------------- */
  for (let i = 0; i < words.length; i++) {
    const single = words[i];
    const pair = `${words[i]} ${words[i + 1] || ""}`.trim();

    const token = aliases[pair] || aliases[single] || pair || single;

    if (skills.has(token)) {
      found.add(token);
      frequency[token] = (frequency[token] || 0) + 1;
    }
  }

  /* ---------------- AUTO-DETECT IMPORTANT SKILLS ---------------- */
  const importantSkills = new Set();

  for (const skill of found) {
    // Appears multiple times
    if (frequency[skill] >= 2) {
      importantSkills.add(skill);
      continue;
    }

    // Appears in headings or key sections
    if (
      lines.some(
        (l) =>
          l.startsWith("#") ||
          l.includes("tech stack") ||
          l.includes("features") ||
          l.includes("built with"),
      ) &&
      lines.some((l) => l.includes(skill))
    ) {
      importantSkills.add(skill);
    }
  }

  /* ---------------- CONFIDENCE HELPERS ---------------- */
  const calculateConfidence = (skill) => {
    const base = frequency[skill];
    const boost = importantSkills.has(skill) ? 2 : 1;
    const sizeFactor = Math.max(2, words.length / 500);

    return Math.min(1, (base * boost) / sizeFactor);
  };

  const confidenceTier = (confidence) => {
    if (confidence >= 0.7) return "high";
    if (confidence >= 0.4) return "medium";
    return "low";
  };

  /* ---------------- BUILD RESPONSE ---------------- */
  return [...found].map((skill) => {
    const confidence = calculateConfidence(skill);

    return {
      name: skill,
      category: skillCategoryMap[skill] || "other",
      confidence: Number(confidence.toFixed(2)),
      level: confidenceTier(confidence),
      important: importantSkills.has(skill),
    };
  });
};

module.exports = { matchSkills };
