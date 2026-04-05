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

// Routes
const authRoutes = require('./routes/auth');
const policyRoutes = require('./routes/policy');
const payoutRoutes = require('./routes/payouts');
const claimRoutes = require('./routes/claims');
const triggerRoutes = require('./routes/triggers');
const platformRoutes = require('./routes/platforms');
const analyticsRoutes = require('./routes/analytics');

const app = express();

// ==================== CONNECT DB ====================
connectDB();

// ==================== CORS (FIXED FOR RAILWAY) ====================
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without origin (Postman, mobile apps)
    if (!origin) return callback(null, true);

    // Allow all in production (Railway)
    if (process.env.NODE_ENV === 'production') {
      return callback(null, true);
    }

    // Allow local dev
    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      'http://localhost:5173'
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`❌ CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// ==================== SECURITY ====================
app.use(helmet());

// ==================== RATE LIMIT ====================
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});
app.use('/api/', limiter);

// ==================== BODY ====================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==================== LOGGING ====================
app.use(morgan('combined'));

// ==================== HEALTH ====================
app.get('/', (req, res) => {
  res.send('GigShield API Running 🚀');
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// ==================== ROUTES ====================
app.use('/api/auth', authRoutes);
app.use('/api/policy', policyRoutes);
app.use('/api/payouts', payoutRoutes);
app.use('/api/claims', claimRoutes);
app.use('/api/triggers', triggerRoutes);
app.use('/api/platforms', platformRoutes);
app.use('/api/analytics', analyticsRoutes);

// ==================== ERROR ====================
app.use(errorHandler);

// ==================== CRON ====================
cron.schedule('*/5 * * * *', async () => {
  console.log('Running trigger monitor...');
  try {
    await triggerMonitor.runAll();
  } catch (err) {
    console.error(err.message);
  }
});

// ==================== START ====================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});