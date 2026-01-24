const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

async function updateCarpenters() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Update all carpenters to be approved
    const result = await User.updateMany(
      { role: 'carpenter' },
      { $set: { isApproved: true } }
    );
    
    console.log('Updated carpenters:', result);
    
    // List all users
    const users = await User.find({}).select('name email role isApproved');
    console.log('All users:', users);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

updateCarpenters();
