const Payout = require('../models/Payout');
const Claim = require('../models/Claim');
const Trigger = require('../models/Trigger');
const Policy = require('../models/Policy');
const { calculateRiskScore, getRiskLevel, getRiskFactors, getRecommendations } = require('../services/aiRiskEngine');

// @GET /api/analytics/dashboard
exports.getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [payouts, triggers, policy] = await Promise.all([
      Payout.find({ user: req.user.id }),
      Trigger.find({ user: req.user.id }),
      Policy.findOne({ user: req.user.id, status: 'active' })
    ]);

    const monthPayouts = payouts.filter(p => p.triggeredAt >= startOfMonth && p.status === 'paid');
    const totalPaid = payouts.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
    const monthPaid = monthPayouts.reduce((s, p) => s + p.amount, 0);
    const armedTriggers = triggers.filter(t => t.status === 'armed' || t.status === 'monitoring').length;

    res.json({
      success: true,
      data: {
        totalPayouts: totalPaid,
        monthPayouts: monthPaid,
        activeTriggers: triggers.length,
        armedTriggers,
        riskScore: req.user.riskScore,
        coverageStatus: policy ? policy.status : 'none',
        renewalDate: policy ? policy.renewalDate : null,
        planName: req.user.plan
      }
    });
  } catch (error) { next(error); }
};

// @GET /api/analytics/income-chart
exports.getIncomeChart = async (req, res, next) => {
  try {
    const { period = '6m' } = req.query;
    const months = period === '1y' ? 12 : period === '3m' ? 3 : 6;
    const labels = [];
    const incomeData = [];
    const payoutData = [];

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      labels.push(d.toLocaleString('default', { month: 'short' }));
      incomeData.push(Math.floor(20000 + Math.random() * 20000));
      payoutData.push(Math.floor(Math.random() * 8000));
    }

    res.json({ success: true, data: { labels, income: incomeData, payouts: payoutData } });
  } catch (error) { next(error); }
};

// @GET /api/analytics/risk-report
exports.getRiskReport = async (req, res, next) => {
  try {
    const score = req.user.riskScore;
    const factors = getRiskFactors(score);
    const recommendations = getRecommendations(score, factors);
    const history = [72, 78, 65, 82, 80, score];
    const labels = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
    res.json({ success: true, data: { score, level: getRiskLevel(score), factors, recommendations, history: { labels, scores: history } } });
  } catch (error) { next(error); }
};