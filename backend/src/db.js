const mongoose = require('mongoose');

let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && mongoose.connection.readyState === 1) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const db = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });

    mongoose.connection.on('connected', () => {
      console.log('MongoDB connected successfully');
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', {
        message: err.message,
        code: err.code,
        name: err.name
      });
      cachedDb = null;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
      cachedDb = null;
    });

    cachedDb = db;
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    cachedDb = null;
    throw error;
  }
}

module.exports = { connectToDatabase };
