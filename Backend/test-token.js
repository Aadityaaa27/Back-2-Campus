// Token verification test
require('dotenv').config();
const jwt = require('jsonwebtoken');

console.log('=== TOKEN DEBUG TEST ===\n');

// Test token from login
const testToken = "PASTE_YOUR_LOGIN_TOKEN_HERE";

console.log('1. Token length:', testToken.length);
console.log('2. Token starts with:', testToken.substring(0, 20) + '...');
console.log('3. JWT_SECRET exists:', process.env.JWT_SECRET ? 'YES' : 'NO');
console.log('4. JWT_SECRET value:', process.env.JWT_SECRET ? '***' + process.env.JWT_SECRET.slice(-4) : 'MISSING');

try {
  const decoded = jwt.verify(testToken, process.env.JWT_SECRET);
  console.log('\n✅ TOKEN VALID!');
  console.log('User ID:', decoded.id);
  console.log('Role:', decoded.role);
  console.log('Issued at:', new Date(decoded.iat * 1000));
  console.log('Expires at:', new Date(decoded.exp * 1000));
  
  const now = Date.now() / 1000;
  if (decoded.exp < now) {
    console.log('\n❌ TOKEN EXPIRED! Login again.');
  } else {
    console.log('\n✅ Token still valid for', Math.floor((decoded.exp - now) / 3600), 'hours');
  }
} catch (error) {
  console.log('\n❌ TOKEN INVALID!');
  console.log('Error:', error.message);
  
  if (error.message.includes('jwt malformed')) {
    console.log('\n💡 FIX: Token format galat hai. Login se poora token copy karo.');
  } else if (error.message.includes('expired')) {
    console.log('\n💡 FIX: Token expire ho gaya. Fresh login karo.');
  } else if (error.message.includes('signature')) {
    console.log('\n💡 FIX: Token kisi aur server ka hai ya JWT_SECRET galat hai.');
  }
}

console.log('\n=========================');
