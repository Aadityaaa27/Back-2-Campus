// Create test user with known password
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Student = require('./models/studentModel');

async function createTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const testEmail = 'test2026@example.com';
    const testPassword = 'Test@12345';
    
    // Check if already exists
    const existing = await Student.findOne({ email: testEmail });
    if (existing) {
      console.log('⚠️  User already exists!');
      console.log('Email:', testEmail);
      console.log('Password:', testPassword);
      console.log('\nUse these credentials to login!\n');
      process.exit(0);
    }
    
    // Create new student
    const hashedPassword = await bcrypt.hash(testPassword, 10);
    
    await Student.create({
      fullName: 'Test User 2026',
      email: testEmail,
      password: hashedPassword,
      current_year: 'Final Year',
      college_name: 'Test College',
      subject_to_discuss: 'MERN Stack',
      role: 'student'
    });
    
    console.log('✅ TEST USER CREATED!\n');
    console.log('=================================');
    console.log('📧 Email:', testEmail);
    console.log('🔑 Password:', testPassword);
    console.log('=================================');
    console.log('\n✅ Use these credentials in Postman!\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createTestUser();
