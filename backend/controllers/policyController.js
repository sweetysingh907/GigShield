const Policy = require('../models/Policy');
const { calculatePremium } = require('../services/aiRiskEngine');

// @GET /api/policy/quote
exports.getQuote = (req, res) => {
  const { income, platform, days, coverageType } = req.query;
  if (!income) return res.status(400).json({ success: false, message: 'Income is required' });
  const premium = calculatePremium(parseFloat(income), platform, parseInt(days) || 5, coverageType || 'income');
  const coverageAmt = Math.round(parseFloat(income) * 1.5 / 1000) * 1000;
  res.json({ success: true, data: { premium, coverageAmount: coverageAmt, payoutTime: coverageType === 'full' ? '2 min' : '4 min', riskLevel: parseFloat(income) > 60000 ? 'Medium' : 'Low' } });
};

// @GET /api/policy
exports.getPolicy = async (req, res, next) => {
  try {
    const policy = await Policy.findOne({ user: req.user.id, status: 'active' });
    if (!policy) return res.status(404).json({ success: false, message: 'No active policy found' });
    res.json({ success: true, data: policy });
  } catch (error) { next(error); }
};

// @POST /api/policy
exports.createPolicy = async (req, res, next) => {
  try {
    const { plan, addons } = req.body;
    const premiums = { starter: 299, pro: 699, enterprise: 1499 };
    const limits = { starter: 30000, pro: 150000, enterprise: 999999 };
    await Policy.deleteMany({ user: req.user.id });
    const policy = await Policy.create({
      user: req.user.id, plan,
      monthlyPremium: premiums[plan] || 299,
      incomeProtectionLimit: limits[plan] || 30000,
      addons: addons || {}
    });
    res.status(201).json({ success: true, data: policy });
  } catch (error) { next(error); }
};

// @PUT /api/policy
exports.updatePolicy = async (req, res, next) => {
  try {
    const { incomeProtectionLimit, singlePayoutCap, incomeDropThreshold, waitingPeriodHours, addons } = req.body;
    const policy = await Policy.findOneAndUpdate(
      { user: req.user.id, status: 'active' },
      { incomeProtectionLimit, singlePayoutCap, incomeDropThreshold, waitingPeriodHours, addons },
      { new: true, runValidators: true }
    );
    if (!policy) return res.status(404).json({ success: false, message: 'Active policy not found' });
    res.json({ success: true, data: policy });
  } catch (error) { next(error); }
};