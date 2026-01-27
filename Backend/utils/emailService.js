/**
 * Send OTP via email
 * For now, this is a mock implementation that logs to console
 * TODO: Integrate with actual email service (Nodemailer, SendGrid, etc.)
 * 
 * @param {string} email - Recipient email
 * @param {string} otp - OTP code
 * @param {string} name - Recipient name
 */
const sendOTPEmail = async (email, otp, name) => {
  // Mock implementation - just log for now
  console.log("📧 Sending OTP Email:");
  console.log(`   To: ${email}`);
  console.log(`   Name: ${name}`);
  console.log(`   OTP: ${otp}`);
  console.log(`   Valid for: 5 minutes`);
  
  // Simulate async email sending
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("✅ OTP email sent successfully (mock)");
      resolve(true);
    }, 100);
  });
  
  // TODO: Replace with actual email service
  // Example with Nodemailer:
  // const transporter = nodemailer.createTransport({ ... });
  // await transporter.sendMail({
  //   from: process.env.EMAIL_FROM,
  //   to: email,
  //   subject: "Your OTP Code",
  //   html: `<p>Hi ${name},</p><p>Your OTP is: <strong>${otp}</strong></p>`
  // });
};

module.exports = {
  sendOTPEmail,
};
