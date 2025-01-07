const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// CORS configuration
const corsOptions = {
  origin: ["https://client-phi-one-89.vercel.app", "http://localhost:5173"], // Add your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
  ],
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

// Handle OPTIONS requests
app.options('*', cors(corsOptions));

// MongoDB User Schema
const userSchema = new mongoose.Schema({
  email: { 
    type: String, 
    required: true, 
    unique: true,
    trim: true,
    lowercase: true
  },
  password: { 
    type: String, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

// Auth middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      throw new Error('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication required', message: error.message });
  }
};

// MongoDB connection handling
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

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Email and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        error: 'User exists',
        message: 'Email already registered' 
      });
    }

    // Create new user
    const user = new User({ email, password });
    await user.save();

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '7d' }
    );

    res.status(201).json({ 
      message: 'User registered successfully',
      token,
      user: { 
        id: user._id, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      error: 'Registration failed',
      message: error.message 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    await connectToDatabase();
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ 
        error: 'Missing credentials',
        message: 'Email and password are required' 
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid email or password' 
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Invalid email or password' 
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET || 'your-default-secret-key',
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login successful',
      token,
      user: { 
        id: user._id, 
        email: user.email 
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      error: 'Login failed',
      message: error.message 
    });
  }
});

// Test route
app.get('/api/test', async (req, res) => {
  try {
    const db = await connectToDatabase();
    res.json({ 
      message: 'Backend is working!',
      env: process.env.NODE_ENV,
      mongoConnected: mongoose.connection.readyState === 1,
      dbState: mongoose.connection.readyState,
      dbHost: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.split('@')[1]?.split('/')[0] : 
        'URI not set'
    });
  } catch (error) {
    console.error('Test route error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack
    });
    res.status(500).json({ 
      error: 'Database connection failed',
      message: error.message,
      details: {
        code: error.code,
        name: error.name,
        state: mongoose.connection.readyState
      }
    });
  }
});

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await connectToDatabase();
    res.status(200).json({ 
      status: 'OK',
      env: process.env.NODE_ENV,
      dbState: mongoose.connection.readyState,
      dbHost: process.env.MONGODB_URI ? 
        process.env.MONGODB_URI.split('@')[1]?.split('/')[0] : 
        'URI not set'
    });
  } catch (error) {
    console.error('Health check error:', {
      message: error.message,
      code: error.code,
      name: error.name
    });
    res.status(500).json({ 
      status: 'ERROR',
      message: error.message,
      details: {
        code: error.code,
        name: error.name,
        state: mongoose.connection.readyState
      }
    });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Global error:', {
    message: err.message,
    code: err.code,
    name: err.name,
    stack: err.stack
  });
  res.status(500).json({ 
    error: 'Server Error',
    message: err.message,
    details: {
      code: err.code,
      name: err.name,
      state: mongoose.connection.readyState
    }
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Export the Express API
module.exports = app;

// Only start the server in development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 8000;
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
