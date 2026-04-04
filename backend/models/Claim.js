const mongoose = require('mongoose');

const ClaimSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy'
  },
  claimNumber: {
    type: String,
    unique: true,
    default: () => 'GS-CLM-' + Date.now()
  },
  claimType: {
    type: String,
    enum: ['platform_downtime', 'accident', 'weather_disruption', 'device_damage', 'other_income_loss'],
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  incidentDate: {
    type: Date,
    required: true
  },
  estimatedLoss: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  evidenceLink: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected', 'paid'],
    default: 'submitted'
  },
  approvedAmount: {
    type: Number,
    default: 0
  },
  reviewNotes: {
    type: String,
    default: ''
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  resolvedAt: {
    type: Date
  }
});

module.exports = mongoose.model('Claim', ClaimSchema);