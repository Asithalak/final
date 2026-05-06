const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');

// Load environment variables from Backend/.env
dotenv.config({ path: path.join(__dirname, '.env') });

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.log('⚠️  Uncaught Exception:', err.message);
});

process.on('unhandledRejection', (err) => {
  console.log('⚠️  Unhandled Rejection:', err.message);
});

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
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection with options and retry
const connectDB = async (retries = 5) => {
  const mongoUri = process.env.MONGODB_URI;
  
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔄 Attempting to connect to MongoDB... (attempt ${i + 1}/${retries})`);
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 30000,
        socketTimeoutMS: 45000,
        family: 4,
      });
      console.log('✅ MongoDB connected successfully');
      return;
    } catch (err) {
      console.error(`❌ MongoDB connection attempt ${i + 1} failed:`, err.message);
      if (i < retries - 1) {
        console.log(`⏳ Waiting 5 seconds before retry...`);
        await new Promise(resolve => setTimeout(resolve, 5000));
      }
    }
  }
  console.log('💡 All connection attempts failed. Database operations will not work.');
};

// Handle MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('📡 Database ready!');
});

mongoose.connection.on('error', (err) => {
  console.log('⚠️  Database connection issue');
});

// Start server first, then connect to database
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("connected to backend");
  
  // Connect to database after server starts
  connectDB().catch(err => {
    console.log('⚠️  Will retry database connection...');
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/furniture', furnitureRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/users', userRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({ status: 'OK', message: 'Furniture Showroom API is running', database: dbStatus });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      message: err.message || 'File upload error',
      error: err.message
    });
  }

  if (err?.message === 'Only image files are allowed!') {
    return res.status(400).json({
      message: err.message,
      error: err.message
    });
  }

  res.status(500).json({ 
    message: 'Something went wrong!', 
    error: process.env.NODE_ENV === 'development' ? err.message : {} 
  });
});
