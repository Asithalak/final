const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoMemoryServer } = require('mongodb-memory-server');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const furnitureRoutes = require('./routes/furniture');
const orderRoutes = require('./routes/orders');
const resourceRoutes = require('./routes/resources');
const userRoutes = require('./routes/users');

const app = express(); 

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database connection with options
const connectDB = async () => {
  let mongoUri = process.env.MONGODB_URI;
  
  try {
    // Try connecting to configured MongoDB first
    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB Atlas connected successfully');
  } catch (err) {
    console.log('⚠️  MongoDB Atlas not available, starting local memory database...');
    
    // Start MongoDB Memory Server as fallback
    const mongod = await MongoMemoryServer.create();
    mongoUri = mongod.getUri();
    
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB Memory Server connected successfully');
    console.log('📍 Using in-memory database (data will reset on restart)');
  }
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Database ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('⚠️  Database connection issue');
});

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Furniture Showroom API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("connected to backend");
});