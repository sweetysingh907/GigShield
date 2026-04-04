const { validationResult } = require('express-validator');
const User = require('../models/User');
const Policy = require('../models/Policy');
const Trigger = require('../models/Trigger');

const sendToken = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({ success: true, token, data: { id: user._id, name: user.name, email: user.email, plan: user.plan, riskScore: user.riskScore } });
};

// @POST /api/auth/register
exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { name, email, phone, password, primaryPlatform } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ success: false, message: 'Email already registered.' });

    const user = await User.create({ name, email, phone, password, primaryPlatform });

    // Auto-create starter policy
    const premiums = { starter: 299, pro: 699, enterprise: 1499 };
    await Policy.create({ user: user._id, plan: 'starter', monthlyPremium: premiums.starter });

    // Auto-create default triggers
    await Trigger.insertMany([
      { user: user._id, name: 'Platform Downtime', type: 'platform_downtime', status: 'armed', platform: primaryPlatform || 'Uber', threshold: 'Uptime < 95% for 60+ mins', payoutAmount: 1500 },
      { user: user._id, name: 'Weather Trigger', type: 'weather', status: 'monitoring', platform: 'All', threshold: 'Rainfall > 20mm in 3h', payoutAmount: 850 }
    ]);

    sendToken(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @POST /api/auth/login
exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ success: false, errors: errors.array() });

  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    sendToken(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @GET /api/auth/me
exports.getMe = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json({ success: true, data: user });
};

// @PUT /api/auth/update
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, upiId, city } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, upiId, city }, { new: true, runValidators: true });
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};