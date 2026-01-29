const fs = require("fs");
const path = require("path");

const SKILL_FILE = path.join(__dirname, "../data/skills.txt");

let cachedSkills = [];

/**********************
 * Load skills once
 **********************/
const loadSkills = () => {
  const data = fs.readFileSync(SKILL_FILE, "utf-8");
  cachedSkills = data
    .split("\n")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
};

loadSkills();

/**********************
 * Skill aliases / variants
 **********************/
const ALIASES = {
  "node.js": "node",
  nodejs: "node",
  expressjs: "express",
  mongodb: "mongo",
  mongoose: "mongo",
  jwt: "jwt",
  bcrypt: "bcrypt",
  "restful api": "rest api",
  api: "api",
};

/**********************
 * Match skills from text
 **********************/
const matchSkills = (text = "") => {
  if (!text) return [];

  const normalized = text
    .toLowerCase()
    .replace(/[^\w\s]/g, " ") // remove symbols
    .replace(/\s+/g, " ");

  const found = new Set();

  // Exact skill match
  for (const skill of cachedSkills) {
    if (normalized.includes(skill)) {
      found.add(skill);
    }
  }

  // Alias match
  for (const alias in ALIASES) {
    if (normalized.includes(alias)) {
      found.add(ALIASES[alias]);
    }
  }

  return [...found];
};

module.exports = { matchSkills };
