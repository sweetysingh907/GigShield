require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');

const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');
const triggerMonitor = require('./services/triggerMonitor.js');

// Route imports
const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policy');
const payoutRoutes = require('./routes/payouts');
const claimRoutes = require('./routes/claims');
const triggerRoutes = require('./routes/triggers');
const platformRoutes = require('./routes/platforms');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// Connect to MongoDB
connectDB();

// ==================== UPDATED CORS CONFIGURATION ====================
// Allow multiple origins for development and production
const allowedOrigins = [
  'http://localhost:5500',      // Live Server
  'http://127.0.0.1:5500',      // Live Server (alternative)
  'http://localhost:3000',      // React dev server
  'http://127.0.0.1:3000',      // React dev server (alternative)
  'http://localhost:5000',      // Same origin
  'http://127.0.0.1:5000',      // Same origin (alternative)
  'http://localhost',           // Localhost without port
  'http://127.0.0.1',           // Localhost IP without port
  'http://192.168.1.*',         // Local network (wildcard pattern)
  'null',                       // For file:// protocol
  process.env.FRONTEND_URL      // Production frontend URL from .env
].filter(Boolean); // Remove any undefined values

// CORS options
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    // Allow all origins in production (for Render deployment)
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(null, false);
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  credentials: true
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// ==================== SECURITY MIDDLEWARE ====================
// Helmet with custom configuration for development
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "unsafe-none" },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false
}));

// ==================== RATE LIMITING ====================
// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: { success: false, message: 'Too many authentication attempts. Please try again later.' },
  skipSuccessfulRequests: true
});

// General limiter for other routes
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests. Please try again later.' }
});

// Apply rate limiting
app.use('/api/auth', authLimiter);
app.use('/api/', generalLimiter);

// ==================== BODY PARSING ====================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==================== LOGGING ====================
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Request logger for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GigShield API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ==================== API ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/analytics', analyticsRoutes);

// ==================== TEST ROUTE FOR CORS VERIFICATION ====================
app.get('/api/test-cors', (req, res) => {
  res.json({
    success: true,
    message: 'CORS is working!',
    origin: req.headers.origin,
    timestamp: new Date().toISOString()
  });
});

// ==================== 404 HANDLER ====================
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: `Route ${req.originalUrl} not found`,
    availableRoutes: [
      '/api/health',
      '/api/auth/*',
      '/api/policy/*',
      '/api/payouts/*',
      '/api/claims/*',
      '/api/triggers/*',
      '/api/platforms/*',
      '/api/analytics/*',
      '/api/test-cors'
    ]
  });
});

// ==================== GLOBAL ERROR HANDLER ====================
app.use(errorHandler);

// ==================== CRON JOBS ====================
// Run trigger monitor every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log(`[CRON] Running trigger monitor at ${new Date().toISOString()}...`);
  try {
    await triggerMonitor.runAll();
    console.log(`[CRON] Trigger monitor completed successfully`);
  } catch (error) {
    console.error(`[CRON] Trigger monitor failed:`, error.message);
  }
});

// Optional: Run daily cleanup at midnight
cron.schedule('0 0 * * *', async () => {
  console.log(`[CRON] Running daily cleanup at ${new Date().toISOString()}...`);
  // Add cleanup logic here if needed
});

// ==================== SERVER START ====================
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🚀 GigShield backend running on port ${PORT}`);
  console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🧪 Test CORS: http://localhost:${PORT}/api/test-cors`);
  console.log(`📦 MongoDB Status: ${mongoose.connection.readyState === 1 ? 'Connected ✅' : 'Disconnected ❌'}`);
  console.log('========================================\n');
});

// ==================== ERROR HANDLING ====================
// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Rejection:', err.message);
  console.error(err.stack);
  // Gracefully close server
  server.close(() => {
    console.log('Server closed due to unhandled rejection');
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err.message);
  console.error(err.stack);
  // Gracefully close server
  server.close(() => {
    console.log('Server closed due to uncaught exception');
    process.exit(1);
  });
});

// Handle SIGTERM (for cloud deployments)
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed');
      process.exit(0);
    });
  });
});

module.exports = app;