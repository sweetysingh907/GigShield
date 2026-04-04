const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getTriggers, createTrigger, updateTrigger, deleteTrigger, toggleTrigger } = require('../controllers/triggerController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getTriggers);
router.post('/', protect, [
  body('name').notEmpty().withMessage('Trigger name is required'),
  body('type').notEmpty().withMessage('Trigger type is required'),
  body('threshold').notEmpty().withMessage('Threshold is required'),
  body('payoutAmount').isNumeric().withMessage('Payout amount must be a number')
], createTrigger);
router.put('/:id', protect, updateTrigger);
router.patch('/:id/toggle', protect, toggleTrigger);
router.delete('/:id', protect, deleteTrigger);

module.exports = router;