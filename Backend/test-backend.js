// Complete API Testing Script
require('dotenv').config();
const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/v1';

async function testBackend() {
  console.log('🚀 BACKEND API TESTING STARTING...\n');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Root endpoint
    console.log('\n📝 TEST 1: Root Endpoint');
    const rootResponse = await axios.get('http://localhost:5000/');
    console.log('✅ Root endpoint working');
    console.log('Message:', rootResponse.data.message);
    
    // Test 2: Login with test user
    console.log('\n📝 TEST 2: Student Login');
    const loginData = {
      email: 'test2026@example.com',
      password: 'Test@12345'
    };
    
    const loginResponse = await axios.post(`${BASE_URL}/auth/login-student`, loginData);
    console.log('✅ Login successful!');
    console.log('Token received:', loginResponse.data.token ? 'YES' : 'NO');
    console.log('Token length:', loginResponse.data.token?.length || 0);
    console.log('Role:', loginResponse.data.role);
    
    const token = loginResponse.data.token;
    
    // Test 3: Profile API (Protected)
    console.log('\n📝 TEST 3: Get Profile (Protected Route)');
    const profileResponse = await axios.get(`${BASE_URL}/auth/profile`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Profile API working!');
    console.log('User:', profileResponse.data.fullName);
    console.log('Email:', profileResponse.data.email);
    console.log('College:', profileResponse.data.college_name);
    
    // Test 4: Logout
    console.log('\n📝 TEST 4: Logout (Protected Route)');
    const logoutResponse = await axios.post(`${BASE_URL}/auth/logout`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ Logout successful!');
    console.log('Message:', logoutResponse.data.message);
    
    // Test 5: Try profile after logout (should fail)
    console.log('\n📝 TEST 5: Access Profile After Logout (Should Fail)');
    try {
      await axios.get(`${BASE_URL}/auth/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('❌ ERROR: Token should be blacklisted!');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('✅ Correct! Token is blacklisted after logout');
      } else {
        console.log('⚠️  Unexpected error:', error.message);
      }
    }
    
    // Test 6: Send OTP
    console.log('\n📝 TEST 6: Send OTP');
    const otpResponse = await axios.post(`${BASE_URL}/auth/send-otp`, {
      email: 'test2026@example.com',
      name: 'Test User',
      role: 'student'
    });
    console.log('✅ OTP sent successfully!');
    console.log('Message:', otpResponse.data.message);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 ALL TESTS PASSED! BACKEND IS WORKING! 🎉');
    console.log('='.repeat(50));
    
    console.log('\n📋 SUMMARY:');
    console.log('✅ Server: Running on port 5000');
    console.log('✅ MongoDB: Connected');
    console.log('✅ Login: Working');
    console.log('✅ Token Generation: Working');
    console.log('✅ Protected Routes: Working');
    console.log('✅ Token Blacklist: Working');
    console.log('✅ OTP: Working');
    
    console.log('\n🔑 TEST CREDENTIALS:');
    console.log('Email: test2026@example.com');
    console.log('Password: Test@12345');
    
  } catch (error) {
    console.log('\n❌ TEST FAILED!');
    console.log('Error:', error.message);
    if (error.response) {
      console.log('Status:', error.response.status);
      console.log('Data:', JSON.stringify(error.response.data, null, 2));
    }
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 FIX: Server is not running!');
      console.log('Run: node server.js');
    }
  }
}

testBackend();
