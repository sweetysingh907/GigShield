const express = require('express');
const router = express.Router();
const { getPayouts, getPayoutById, getSummary } = require('../controllers/payoutController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getPayouts);
router.get('/summary', protect, getSummary);
router.get('/:id', protect, getPayoutById);

module.exports = router;