const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { generateOTP, getOTPExpiry } = require("../utils/otpGenerator");
const { sendOTPEmail } = require("../utils/emailService");

// Send OTP for login

const bcrypt = require("bcryptjs");
const Student = require("../models/studentModel");
const Mentor = require("../models/mentorModel");
const { generateToken } = require("../config/jwt");
const BlacklistToken = require("../models/blacklistTokenModel");

// STUDENT SIGNUP
const studentSignup = async (req, res) => {
  try {
    const {
      fullName,
      email,
      password,
      current_year,
      college_name,
      subject_to_discuss,
    } = req.body;

    const exists = await Student.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Student.create({
      fullName,
      email,
      password: hashedPassword,
      current_year,
      college_name,
      subject_to_discuss,
    });

    res.status(201).json({ 
      success: true,
      message: "Student registered successfully" 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MENTOR SIGNUP
const mentorSignup = async (req, res) => {
  try {
    const { fullName, email, password, passedYear, expertise } = req.body;

    const exists = await Mentor.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    await Mentor.create({
      fullName,
      email,
      password: hashedPassword,
      passedYear,
      expertise,
    });

    res.status(201).json({ 
      success: true,
      message: "Mentor registered successfully" 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// STUDENT LOGIN
const studentLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(student._id, student.role);
    res.status(200).json({
      success: true,
      message: "Student logged in successfully",
      token,
      role: student.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// MENTOR LOGIN
const mentorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const mentor = await Mentor.findOne({ email });
    if (!mentor) return res.status(404).json({ message: "Mentor not found" });

    const isMatch = await bcrypt.compare(password, mentor.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = generateToken(mentor._id, mentor.role);
    res.status(200).json({
      success: true,
      message: "Mentor logged in successfully",
      token,
      role: mentor.role,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const sendOTP = async (req, res) => {
  console.log("📥 sendOTP called with body:", req.body);
  try {
    const { email, name, role } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: "Email and name are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Role handling (default to student)
    const allowedRoles = ["student", "mentor"];
    let userRole = "student";
    if (role) {
      if (!allowedRoles.includes(role.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Allowed: student, alumni, mentor",
        });
      }
      userRole =
        role.toLowerCase() === "alumini" ? "alumni" : role.toLowerCase();
    }

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Find or create user
    let user = await User.findOne({ email });

    if (user) {
      // Update existing user
      user.name = name;
      user.role = userRole;
      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      // Create new user
      user = new User({
        email,
        name,
        role: userRole,
        otp,
        otpExpiry,
      });
      await user.save();
    }

    // Send OTP via email
    await sendOTPEmail(email, otp, name);

    res.status(200).json({
      success: true,
      message: "OTP sent successfully to your email",
      email: email,
      role: userRole,
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

// Verify OTP and login
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Validate input
    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Verify OTP
    if (!user.isOTPValid(otp)) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    // Mark user as verified
    user.isVerified = true;
    user.otp = null; // Clear OTP after successful verification
    user.otpExpiry = null;
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }, // Token expires in 7 days
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        isVerified: user.isVerified,
        role: user.role || "student",
      },
    });
  } catch (error) {
    console.error("Verify OTP error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
};

// Unified login endpoint:
// - If `password` provided -> password login
// - Else if `otp` provided -> delegate to verifyOTP
// - Else -> send OTP (delegates to sendOTP)
const login = async (req, res) => {
  try {
    const { email, name, password, otp } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });
    }

    // Password login
    if (password) {
      const user = await User.findOne({ email });
      if (!user || !user.password) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res
          .status(401)
          .json({ success: false, message: "Invalid credentials" });
      }

      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role || "student",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" },
      );

      return res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
          role: user.role || "student",
        },
      });
    }

    // OTP verification
    if (otp) {
      return verifyOTP(req, res);
    }

    // Default: send OTP flow
    // Ensure `name` exists for sendOTP (use existing name if available)
    if (!name) {
      const existing = await User.findOne({ email });
      req.body.name = existing && existing.name ? existing.name : "User";
    }
    return sendOTP(req, res);
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ success: false, message: "Login failed", error: error.message });
  }
};

// Register user (email + password)
const register = async (req, res) => {
  try {
    const { email, name, password, role } = req.body;

    if (!email || !name || !password) {
      return res.status(400).json({
        success: false,
        message: "Email, name and password are required",
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // Role handling
    const allowedRoles = ["student", "alumni", "alumini", "mentor"];
    let userRole = "student";
    if (role) {
      if (!allowedRoles.includes(role.toLowerCase())) {
        return res.status(400).json({
          success: false,
          message: "Invalid role. Allowed: student, alumni, mentor",
        });
      }
      userRole =
        role.toLowerCase() === "alumini" ? "alumni" : role.toLowerCase();
    }

    // Check if user exists
    let user = await User.findOne({ email });

    // If user exists and already has a password, prevent duplicate registration
    if (user && user.password) {
      return res.status(409).json({
        success: false,
        message: "User already registered. Please login.",
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    if (user) {
      // user exists but likely created via OTP; update with password and role
      user.name = name;
      user.password = hashed;
      user.role = userRole;
      user.isVerified = true;
      await user.save();
    } else {
      user = new User({
        email,
        name,
        password: hashed,
        role: userRole,
        isVerified: true,
      });
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "student",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.status(201).json({
      success: true,
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role || "student",
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to register user",
      error: error.message,
    });
  }
};

// Get user profile (protected route example)
const getProfile = async (req, res) => {
  try {
    // req.user comes from authMiddleware (has id, email, role)
    const userId = req.user.id;
    const userRole = req.user.role;
    
    let user;
    
    // Check role and query appropriate model
    if (userRole === 'student') {
      user = await Student.findById(userId).select('-password');
    } else if (userRole === 'alumni' || userRole === 'mentor') {
      user = await Mentor.findById(userId).select('-password');
    } else {
      // Fallback to User model (for OTP-based users)
      user = await User.findById(userId).select('-otp -otpExpiry -password');
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Return user data
    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile",
      error: error.message,
    });
  }
};

const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (token) {
      // Add token to blacklist
      await BlacklistToken.create({ token });
    }
    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
  register,
  getProfile,
  studentSignup,
  mentorSignup,
  studentLogin,
  mentorLogin,
  logout,
};
