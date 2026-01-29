const jwt = require("jsonwebtoken");

/**
 * Protect routes using JWT authentication
 */
const protect = (req, res, next) => {
  try {
    let token;

    // Expect header: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, token missing",
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to request
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Not authorized, token invalid or expired",
    });
  }
};

// Middleware to check if user is a mentor (alumni)
const isMentor = (req, res, next) => {
  if (req.user && req.user.role === "alumni") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, mentor access required",
    });
  }
};

// Middleware to check if user is a student
const isStudent = (req, res, next) => {
  if (req.user && req.user.role === "student") {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: "Not authorized, student access required",
    });
  }
};

// Attach middlewares to protect function for compatibility
protect.verifyToken = protect;
protect.isMentor = isMentor;
protect.isStudent = isStudent;

module.exports = protect;
