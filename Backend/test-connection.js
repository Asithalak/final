const mongoose = require('mongoose');
require('dotenv').config();

console.log('🔍 Testing MongoDB Atlas Connection...\n');

// Mask password in output
const maskedUri = process.env.MONGODB_URI.replace(
  /\/\/([^:]+):([^@]+)@/,
  '//$1:****@'
);
console.log('📍 Connection URI:', maskedUri);
console.log('⏳ Attempting to connect...\n');

// Set timeout for connection
const timeoutId = setTimeout(() => {
  console.log('❌ Connection timeout after 30 seconds');
  console.log('\n💡 Possible issues:');
  console.log('   1. IP address not whitelisted in MongoDB Atlas');
  console.log('   2. Cluster is paused');
  console.log('   3. Wrong credentials');
  console.log('   4. Firewall blocking connection');
  console.log('\n📖 Check MONGODB_FIX.md for solutions');
  process.exit(1);
}, 30000);

mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 30000
})
  .then(() => {
    clearTimeout(timeoutId);
    console.log('✅ SUCCESS! MongoDB connected successfully!');
    console.log('📊 Connection Details:');
    console.log('   - Database:', mongoose.connection.name || 'default');
    console.log('   - Host:', mongoose.connection.host);
    console.log('   - Port:', mongoose.connection.port);
    console.log('   - Ready State:', mongoose.connection.readyState === 1 ? 'Connected' : 'Unknown');
    console.log('\n🎉 Your database is ready to use!');
    console.log('💡 You can now run: npm start\n');
    process.exit(0);
  })
  .catch((err) => {
    clearTimeout(timeoutId);
    console.log('❌ FAILED! MongoDB connection error\n');
    console.log('📋 Error Details:');
    console.log('   Type:', err.name);
    console.log('   Message:', err.message);
    
    console.log('\n🔧 Quick Fixes:');
    if (err.message.includes('IP') || err.message.includes('whitelist')) {
      console.log('   1. Go to https://cloud.mongodb.com/');
      console.log('   2. Click "Network Access" in left sidebar');
      console.log('   3. Click "+ ADD IP ADDRESS"');
      console.log('   4. Click "ADD CURRENT IP ADDRESS"');
      console.log('   5. Click "Confirm" and wait 1-2 minutes');
    } else if (err.message.includes('authentication')) {
      console.log('   1. Check username and password in .env file');
      console.log('   2. Verify credentials in MongoDB Atlas → Database Access');
      console.log('   3. Reset password if needed');
    } else if (err.message.includes('ENOTFOUND')) {
      console.log('   1. Check your internet connection');
      console.log('   2. Verify cluster hostname in connection string');
      console.log('   3. Make sure cluster is not paused');
    }
    
    console.log('\n📖 For detailed help, check: MONGODB_FIX.md\n');
    process.exit(1);
  });
