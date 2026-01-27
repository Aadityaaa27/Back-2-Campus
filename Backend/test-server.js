require("dotenv").config();
const express = require("express");

const app = express();
const PORT = 5000;

app.use(express.json());

app.post("/api/v1/auth/send-otp", (req, res) => {
  console.log("✅ Request received:", req.body);
  res.json({
    success: true,
    message: "Test successful!",
    body: req.body
  });
});

app.listen(PORT, () => {
  console.log(`✅ Test server running on http://localhost:${PORT}`);
  console.log(`✅ Test: POST http://localhost:${PORT}/api/v1/auth/send-otp`);
});
