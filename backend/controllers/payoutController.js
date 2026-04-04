const Payout = require('../models/Payout');
const { getPayoutSummary } = require('../services/payoutEngine');

// @GET /api/payouts
exports.getPayouts = async (req, res, next) => {
  try {
    const { status, limit = 20, page = 1 } = req.query;
    const query = { user: req.user.id };
    if (status && status !== 'all') query.status = status;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const payouts = await Payout.find(query).sort({ triggeredAt: -1 }).skip(skip).limit(parseInt(limit));
    const total = await Payout.countDocuments(query);
    res.json({ success: true, count: payouts.length, total, data: payouts });
  } catch (error) { next(error); }
};

// @GET /api/payouts/summary
exports.getSummary = async (req, res, next) => {
  try {
    const summary = await getPayoutSummary(req.user.id);
    res.json({ success: true, data: summary });
  } catch (error) { next(error); }
};

// @GET /api/payouts/:id
exports.getPayoutById = async (req, res, next) => {
  try {
    const payout = await Payout.findOne({ _id: req.params.id, user: req.user.id });
    if (!payout) return res.status(404).json({ success: false, message: 'Payout not found' });
    res.json({ success: true, data: payout });
  } catch (error) { next(error); }
};