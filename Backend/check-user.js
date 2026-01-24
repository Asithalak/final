const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');

async function checkUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const email = 'lakmal@gmail.com';
    const testPassword = '123456'; // Common test password
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.log('User not found with email:', email);
    } else {
      console.log('User found:', {
        name: user.name,
        email: user.email,
        role: user.role,
        isApproved: user.isApproved,
        passwordHash: user.password?.substring(0, 20) + '...'
      });
      
      // Test password
      const isMatch = await user.comparePassword(testPassword);
      console.log(`Password "${testPassword}" matches:`, isMatch);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

checkUser();
