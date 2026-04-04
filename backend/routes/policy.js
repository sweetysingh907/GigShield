const express = require('express');
const router = express.Router();
const { getPolicy, createPolicy, updatePolicy, getQuote } = require('../controllers/policyController');
const { protect } = require('../middleware/auth');

router.get('/quote', getQuote);
router.get('/', protect, getPolicy);
router.post('/', protect, createPolicy);
router.put('/', protect, updatePolicy);

module.exports = router;