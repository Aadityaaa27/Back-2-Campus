// Simple test without MongoDB
const express = require("express");
const app = express();
const PORT = 3000; // Different port

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Server working!" });
});

app.post("/api/v1/auth/send-otp", (req, res) => {
  console.log("Request body:", req.body);
  res.json({
    success: true,
    message: "OTP would be sent here",
    data: req.body
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
  console.log(`✅ Test with: http://localhost:${PORT}/`);
});
