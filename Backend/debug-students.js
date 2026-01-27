require('dotenv').config();
const mongoose = require('mongoose');
const Student = require('./models/studentModel');

async function checkStudents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');
    
    const students = await Student.find({});
    
    console.log('=================================');
    console.log('📊 DATABASE STUDENT CHECK');
    console.log('=================================');
    console.log(`Total students in database: ${students.length}\n`);
    
    if (students.length > 0) {
      students.forEach((student, index) => {
        console.log(`Student #${index + 1}:`);
        console.log(`  Email: ${student.email}`);
        console.log(`  Name: ${student.fullName}`);
        console.log(`  Password (hashed): ${student.password ? 'YES' : 'NO'}`);
        console.log(`  Created: ${student.createdAt}`);
        console.log('---');
      });
    } else {
      console.log('❌ NO STUDENTS FOUND IN DATABASE!');
      console.log('You need to signup first.');
    }
    
    console.log('=================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

checkStudents();
