const Payout = require('../models/Payout');
const Policy = require('../models/Policy');
const User = require('../models/User');

/**
 * Auto-execute a parametric payout
 */
const executePayout = async ({ userId, triggerId, triggerType, platform, amount, description }) => {
  try {
    const user = await User.findById(userId);
    const policy = await Policy.findOne({ user: userId, status: 'active' });

    if (!policy) throw new Error('No active policy found for user');
    if (policy.monthlyPayoutUsed + amount > policy.incomeProtectionLimit) {
      throw new Error('Monthly payout limit reached');
    }
    if (amount > policy.singlePayoutCap) {
      amount = policy.singlePayoutCap;
    }

    const payout = await Payout.create({
      user: userId,
      policy: policy._id,
      trigger: triggerId || null,
      triggerType,
      platform,
      amount,
      status: 'processing',
      upiId: user.upiId || '',
      description,
      triggeredAt: new Date()
    });

    // Update policy usage
    policy.monthlyPayoutUsed += amount;
    await policy.save();

    // Update user total
    user.totalPayoutsReceived += amount;
    await user.save();

    // Simulate processing → paid after 1–4 mins
    const delay = Math.floor(Math.random() * 180000) + 60000;
    setTimeout(async () => {
      payout.status = 'paid';
      payout.paidAt = new Date();
      payout.processingTimeMs = delay;
      await payout.save();
      console.log(`[PAYOUT] ₹${amount} paid to ${user.name} (${user.upiId}) via UPI`);
    }, delay);

    return { success: true, payout };
  } catch (error) {
    console.error('[PAYOUT ENGINE]', error.message);
    return { success: false, message: error.message };
  }
};

/**
 * Get payout summary for a user
 */
const getPayoutSummary = async (userId) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const allPayouts = await Payout.find({ user: userId });
  const thisMonth = allPayouts.filter(p => p.triggeredAt >= startOfMonth);

  return {
    total: allPayouts.reduce((s, p) => s + (p.status === 'paid' ? p.amount : 0), 0),
    thisMonth: thisMonth.reduce((s, p) => s + (p.status === 'paid' ? p.amount : 0), 0),
    count: allPayouts.length,
    avgProcessingMs: allPayouts.reduce((s, p) => s + p.processingTimeMs, 0) / (allPayouts.length || 1)
  };
};

module.exports = { executePayout, getPayoutSummary };