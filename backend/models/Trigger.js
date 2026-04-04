const mongoose = require('mongoose');

const TriggerSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['platform_downtime', 'weather', 'income_drop', 'low_demand', 'custom'],
    required: true
  },
  status: {
    type: String,
    enum: ['armed', 'monitoring', 'standby', 'fired'],
    default: 'standby'
  },
  platform: {
    type: String,
    default: 'All'
  },
  threshold: {
    type: String,
    required: true
  },
  payoutAmount: {
    type: Number,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastFired: {
    type: Date
  },
  fireCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Trigger', TriggerSchema);