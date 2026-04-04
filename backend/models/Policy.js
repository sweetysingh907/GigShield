const mongoose = require('mongoose');

const PolicySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policyNumber: {
    type: String,
    unique: true,
    default: () => 'GS-' + Date.now()
  },
  plan: {
    type: String,
    enum: ['starter', 'pro', 'enterprise'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  monthlyPremium: {
    type: Number,
    required: true
  },
  incomeProtectionLimit: {
    type: Number,
    default: 150000
  },
  singlePayoutCap: {
    type: Number,
    default: 25000
  },
  incomeDropThreshold: {
    type: Number,
    default: 30 // percent
  },
  waitingPeriodHours: {
    type: Number,
    default: 2
  },
  addons: {
    accidentCover: { type: Boolean, default: false },
    deviceProtection: { type: Boolean, default: false },
    legalAssistance: { type: Boolean, default: false },
    mentalWellness: { type: Boolean, default: false }
  },
  monthlyPayoutUsed: {
    type: Number,
    default: 0
  },
  renewalDate: {
    type: Date,
    default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Policy', PolicySchema);