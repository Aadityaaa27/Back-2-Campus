const axios = require("axios");
const mongoose = require("mongoose");
require("dotenv").config();

// Configuration
const API_URL = "http://localhost:5000/api/v1";
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/campus-meetup";

// Test Data
const mentorData = {
  email: "test.mentor@example.com",
  name: "Test Mentor",
  role: "alumni", // Assuming this is the role string
};

const studentData = {
  email: "test.student@example.com",
  name: "Test Student",
  role: "student",
};

// Helper: Delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function runTest() {
  console.log("Starting Session Management Verification...");

  // 1. Setup Data directly in DB (to bypass OTP for now, or just use if we can)
  // Actually, better to use the `send-otp` flow if possible, but OTP is emailed.
  // So we might need to hack the DB to set a known OTP or just create users directly if we have DB access.
  // Let's assume we can connect to DB and create users with known tokens or valid OTPs.
  // Wait, the authMiddleware checks valid JWT. We need to generate JWTs.

  // Alternative: Login via API might tricky if OTP is random.
  // Let's look at `User` model again. `otp` is stored.
  // We can:
  // 1. Connect to DB.
  // 2. Create/Update Mentor & Student with known OTP '123456'.
  // 3. Call verify-otp to get tokens.

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB for test setup.");

    const User = require("../models/User");
    const Mentor = require("../models/mentorModel"); // Need to ensure Mentor profile exists for role check maybe?
    // User schema has role, but there is also a Mentor model.
    // The controller checks `req.user.id`.
    // And `createSession` checks `Mentor.findById(conductorId)`.
    // So we need a User entry AND a Mentor entry for the mentor.

    // 1. Setup Mentor
    console.log("Setting up Mentor...");
    let mentorUser = await User.findOne({ email: mentorData.email });
    if (!mentorUser) {
        mentorUser = new User(mentorData);
    }
    mentorUser.otp = "123456";
    mentorUser.otpExpiry = new Date(Date.now() + 10 * 60000);
    mentorUser.role = "alumni";
    await mentorUser.save();

    let mentorProfile = await Mentor.findOne({ email: mentorData.email });
    if (!mentorProfile) {
        mentorProfile = new Mentor({
            _id: mentorUser._id, // Ideally share ID, or linked?
            // Wait, usually User and Mentor are separate or same?
            // In `sessionController`, `conductorId` comes from `req.user.id`.
            // And it does `Mentor.findById(conductorId)`.
            // So `User._id` MUST match `Mentor._id`.
            fullName: mentorData.name,
            email: mentorData.email,
            password: "none",
            passedYear: 2020,
        });
        // We explicitly set _id if we can, or we rely on them being same.
        // Mongoose _id is auto generated.
        // If the system uses separate collections, we need to ensure consistency.
        // Let's assume for this test we force them to match or just create one.
        // Actually, if I create a new Mentor with specific ID...
        // Let's delete old ones to be clean.
        await Mentor.deleteOne({ email: mentorData.email });
         mentorProfile = new Mentor({
            _id: mentorUser._id, // Link them
            fullName: mentorData.name,
            email: mentorData.email,
            password: "none",
            passedYear: 2020,
        });
        await mentorProfile.save();
    }
     console.log("Mentor setup complete.");

    // 2. Setup Student
    console.log("Setting up Student...");
    let studentUser = await User.findOne({ email: studentData.email });
    if (!studentUser) {
        studentUser = new User(studentData);
    }
    studentUser.otp = "123456";
    studentUser.otpExpiry = new Date(Date.now() + 10 * 60000);
    studentUser.role = "student";
    await studentUser.save();
    console.log("Student setup complete.");

    // 3. Login to get Tokens
    console.log("Logging in Mentor...");
    const mentorLogin = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: mentorData.email,
        otp: "123456"
    });
    const mentorToken = mentorLogin.data.token;
    console.log("Mentor logged in. Token:", mentorToken ? "Received" : "Missing");

    console.log("Logging in Student...");
    const studentLogin = await axios.post(`${API_URL}/auth/verify-otp`, {
        email: studentData.email,
        otp: "123456"
    });
    const studentToken = studentLogin.data.token;
    console.log("Student logged in.");

    // 4. Create Session (Mentor)
    console.log("Creating Session...");
    const sessionRes = await axios.post(`${API_URL}/sessions/create`, {
        title: "Test Session",
        description: "A session for testing",
        startTime: new Date(Date.now() + 3600000), // 1 hour later
        endTime: new Date(Date.now() + 7200000),
        capacity: 5
    }, {
        headers: { Authorization: `Bearer ${mentorToken}` }
    });
    const sessionId = sessionRes.data.session._id;
    console.log(`Session created: ${sessionId}`);

    // 5. Join Request (Student)
    console.log("Student requesting to join...");
    await axios.post(`${API_URL}/sessions/${sessionId}/join`, {}, {
        headers: { Authorization: `Bearer ${studentToken}` }
    });
    console.log("Join request sent.");

    // 6. Manage Request (Mentor)
    console.log("Mentor approving request...");
    await axios.post(`${API_URL}/sessions/${sessionId}/manage`, {
        studentId: studentUser._id.toString(),
        status: "approve"
    }, {
        headers: { Authorization: `Bearer ${mentorToken}` }
    });
    console.log("Request approved.");

    // 7. Verify (Get Session)
    const sessionDetails = await axios.get(`${API_URL}/sessions/${sessionId}`, {
         headers: { Authorization: `Bearer ${mentorToken}` }
    });
    const attendees = sessionDetails.data.attendees;
    const isAttendee = attendees.some(a => a._id === studentUser._id.toString() || a === studentUser._id.toString());
    
    if (isAttendee) {
        console.log("✅ SUCCESS: Student is in attendees list!");
    } else {
        console.error("❌ FAILURE: Student not found in attendees.");
    }

  } catch (error) {
    console.error("Test Failed:", error.response ? error.response.data : error.message);
  } finally {
    await mongoose.disconnect();
  }
}

runTest();
