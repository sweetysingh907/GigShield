const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy'
  },
  trigger: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trigger'
  },
  triggerType: {
    type: String,
    enum: ['platform_downtime', 'weather', 'income_drop', 'low_demand', 'manual'],
    required: true
  },
  platform: {
    type: String,
    default: 'N/A'
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'failed'],
    default: 'pending'
  },
  payoutMethod: {
    type: String,
    default: 'UPI'
  },
  upiId: {
    type: String,
    default: ''
  },
  processingTimeMs: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    default: ''
  },
  triggeredAt: {
    type: Date,
    default: Date.now
  },
  paidAt: {
    type: Date
  }
});

// Simulate payment on save
PayoutSchema.pre('save', function (next) {
  if (this.isNew) {
    const delay = Math.floor(Math.random() * 180000) + 60000; // 1–4 min
    this.processingTimeMs = delay;
    setTimeout(() => {
      this.status = 'paid';
      this.paidAt = new Date();
      this.save().catch(console.error);
    }, delay);
  }
  next();
});

module.exports = mongoose.model('Payout', PayoutSchema);