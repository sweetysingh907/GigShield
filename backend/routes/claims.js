const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { getClaims, submitClaim, getClaimById } = require('../controllers/claimController');
const { protect } = require('../middleware/auth');

router.get('/', protect, getClaims);
router.get('/:id', protect, getClaimById);
router.post('/', protect, [
  body('claimType').notEmpty().withMessage('Claim type is required'),
  body('platform').notEmpty().withMessage('Platform is required'),
  body('incidentDate').isISO8601().withMessage('Valid incident date required'),
  body('estimatedLoss').isNumeric().withMessage('Valid estimated loss required'),
  body('description').isLength({ min: 10 }).withMessage('Description must be at least 10 characters')
], submitClaim);

module.exports = router;