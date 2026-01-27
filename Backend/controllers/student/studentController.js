const Student = require("../../models/studentModel");

// Get My Profile
const getMyProfile = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

// Edit My Profile
const editMyProfile = async (req, res) => {
  try {
    const {
      fullName,
      current_year,
      college_name,
      subject_to_discuss,
      bio,
      profile_picture,
      social_links,
      skills,
    } = req.body;

    // Find student
    const student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Update fields if provided
    if (fullName) student.fullName = fullName;
    if (current_year) student.current_year = current_year;
    if (college_name) student.college_name = college_name;
    if (subject_to_discuss) student.subject_to_discuss = subject_to_discuss;
    if (bio) student.bio = bio;
    if (profile_picture) student.profile_picture = profile_picture;
    if (skills) student.skills = skills;

    // Handle nested social_links object
    if (social_links) {
      student.social_links = {
        ...student.social_links,
        ...social_links,
      };
    }

    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: student,
    });
  } catch (error) {
    console.error("Edit profile error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  editMyProfile,
};
