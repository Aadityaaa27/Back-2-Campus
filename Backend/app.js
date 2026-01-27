require("dotenv").config();
const express = require("express");
const connectDB = require("./config/database");
const authRoutes = require("./routers/authRoutes");
const MentorRoutes = require("./routers/mentorRoutes");
const studentRoutes = require("./routers/studentRoutes");
const studentConnectionRoutes = require("./routers/studentConnectionRoutes");
const path = require("path");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  );
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/alumini-mentor", MentorRoutes);
app.use("/api/v1/students", studentRoutes);
app.use("/api/v1/mentor/connections", studentConnectionRoutes);
app.use("/api/v1/sessions", require("./routers/sessionRoutes"));

// Swagger UI
try {
  const swaggerSpecPath = path.join(__dirname, "openapi.yaml");
  const swaggerDocument = YAML.load(swaggerSpecPath);
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  console.log("Swagger UI available at /docs");
} catch (err) {
  console.warn("Could not load OpenAPI spec for Swagger UI:", err.message);
}

// Root route
app.get("/", (req, res) => {
  res.json({
    message: "Campus Meetup API",
    version: "1.0.0",
    description: "AI-Powered Student Success Platform",
    endpoints: {
      auth: {
        sendOTP: "POST /api/v1/auth/send-otp",
        verifyOTP: "POST /api/v1/auth/verify-otp",
        getProfile: "GET /api/v1/auth/profile (Protected)",
      },
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

const PORT = process.env.PORT || 5000;

// Debug helper to print nested routes
function printRoutes(stack, prefix = "") {
  stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods)
        .map((m) => m.toUpperCase())
        .join(",");
      console.log(methods, prefix + layer.route.path);
    } else if (layer.name === "router" && layer.handle && layer.handle.stack) {
      printRoutes(layer.handle.stack, prefix);
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API available at http://localhost:${PORT}`);
  console.log("MongoDB connected successfully");

  console.log("AUTH ROUTES TYPE:", typeof authRoutes);
  try {
    console.log("AUTH ROUTES KEYS:", Object.keys(authRoutes));
  } catch (e) {
    console.log("AUTH ROUTES KEYS: (failed)", e.message);
  }

  console.log("✅ ALL ROUTES:");
  if (app._router && app._router.stack) printRoutes(app._router.stack);

  console.log("✅ AUTH ROUTES STACK:");
  if (authRoutes && authRoutes.stack) {
    authRoutes.stack.forEach((layer) => {
      if (layer.route) {
        const methods = Object.keys(layer.route.methods)
          .map((m) => m.toUpperCase())
          .join(",");
        console.log(methods, "/api/v1/auth" + layer.route.path);
      }
    });
  } else {
    console.log("❌ authRoutes.stack not found");
  }
});

module.exports = app;
