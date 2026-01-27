const fs = require("fs");
const path = require("path");

const SKILL_FILE = path.join(__dirname, "../data/skills.txt");
const ALIAS_FILE = path.join(__dirname, "../data/aliases.json"); // optional mapping
const CATEGORY_FILE = path.join(__dirname, "../data/categories.json"); // optional categories

/* ---------------- LOAD ONCE ---------------- */

let cachedSkills = [];
let aliases = {};
let categories = {};

try {
  cachedSkills = fs
    .readFileSync(SKILL_FILE, "utf-8")
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);

  if (fs.existsSync(ALIAS_FILE)) {
    aliases = JSON.parse(fs.readFileSync(ALIAS_FILE, "utf-8"));
  }

  if (fs.existsSync(CATEGORY_FILE)) {
    categories = JSON.parse(fs.readFileSync(CATEGORY_FILE, "utf-8"));
  }
} catch (err) {
  console.error("Error loading skills or aliases:", err);
}

/* ---------------- MATCH ENGINE ---------------- */

const matchSkills = (text) => {
  if (!text) return [];

  // Normalize text
  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // remove punctuation
    .replace(/\s+/g, " "); // collapse spaces

  const words = normalized.split(" ");
  const frequency = {};
  const found = new Set();

  // O(n) single pass, check single and double word tokens
  for (let i = 0; i < words.length; i++) {
    const single = words[i];
    const pair = `${words[i]} ${words[i + 1] || ""}`.trim();

    // Check aliases first
    const token = aliases[pair] || aliases[single] || pair || single;

    if (cachedSkills.includes(token)) {
      found.add(token);
      frequency[token] = (frequency[token] || 0) + 1;
    }
  }

  // Build skill objects with confidence and category
  return [...found].map((skill) => {
    const conf = Math.min(
      1,
      frequency[skill] / Math.max(1, words.length / 100),
    );
    return {
      name: skill,
      confidence: conf,
      tier: conf >= 0.7 ? "high" : conf >= 0.4 ? "medium" : "low",
      category: categories[skill] || "other",
    };
  });
};

module.exports = { matchSkills };
