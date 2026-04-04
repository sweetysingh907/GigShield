const express = require('express');
const router = express.Router();
const { getDashboardStats, getIncomeChart, getRiskReport } = require('../controllers/analyticsController');
const { protect } = require('../middleware/auth');

router.get('/dashboard', protect, getDashboardStats);
router.get('/income-chart', protect, getIncomeChart);
router.get('/risk-report', protect, getRiskReport);

module.exports = router;